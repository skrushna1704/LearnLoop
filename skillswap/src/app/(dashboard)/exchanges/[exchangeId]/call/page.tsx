'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';

export default function VideoCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('waiting');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isOfferer = useRef(false);

  const params = useParams();
  const router = useRouter();
  const exchangeId = params.exchangeId as string;
  const callRoomId = `call-${exchangeId}`;

  // Use the global socket context
  const { socket, isConnected } = useSocket();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!socket || !isConnected || !currentUser) return;

    // 1. Join the exchange room and call room
    socket.emit('joinRoom', exchangeId);
    socket.emit('join-call-room', callRoomId);

    // 2. Get user's media stream (camera/mic)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(error => {
        console.error("Error accessing media devices.", error);
      });

    // 3. Emit call-presence to let the other user know we're here
    socket.emit('call-presence', { roomId: callRoomId, userId: currentUser.id });

    // 4. Listen for other users joining - ONLY this user creates the offer
    const handleUserJoined = (userId: string) => {
      console.log('Another user joined, I will create the offer:', userId);
      setConnectionStatus('creating-offer');
      isOfferer.current = true;
      
      // Start peer connection and create offer
      startPeerConnection().then(() => {
        createOffer();
      });
    };

    // 5. Listen for call-presence from the other user - this user waits for offer
    const handleCallPresence = ({ userId, socketId }: { userId: string; socketId: string }) => {
      console.log('Received call-presence from:', userId, socketId);
      setConnectionStatus('waiting-for-offer');
      // Don't start peer connection yet - wait for the offer
    };

    // 6. Listen for WebRTC offers - this user responds with answer
    const handleWebRTCOffer = ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      console.log('Received WebRTC offer, creating answer');
      setConnectionStatus('creating-answer');
      
      startPeerConnection().then(() => {
        peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(sdp))
          .then(() => {
            return peerConnectionRef.current?.createAnswer();
          })
          .then(answerSdp => {
            peerConnectionRef.current?.setLocalDescription(answerSdp);
            socket.emit('webrtc-answer', { sdp: answerSdp, answererId: socket.id, roomId: callRoomId });
            setConnectionStatus('connected');
          })
          .catch(error => {
            console.error('Error creating answer:', error);
            setConnectionStatus('error');
          });
      });
    };

    // 7. Listen for WebRTC answers - this user receives the answer
    const handleWebRTCAnswer = ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      console.log('Received WebRTC answer');
      peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(sdp))
        .then(() => {
          setConnectionStatus('connected');
        })
        .catch(error => {
          console.error('Error setting remote description:', error);
          setConnectionStatus('error');
        });
    };

    // 8. Listen for ICE candidates
    const handleICECandidate = ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      console.log('Received ICE candidate');
      peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    };

    socket.on('user-joined', handleUserJoined);
    socket.on('call-presence', handleCallPresence);
    socket.on('webrtc-offer', handleWebRTCOffer);
    socket.on('webrtc-answer', handleWebRTCAnswer);
    socket.on('webrtc-ice-candidate', handleICECandidate);

    // Cleanup logic
    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      socket.off('user-joined', handleUserJoined);
      socket.off('call-presence', handleCallPresence);
      socket.off('webrtc-offer', handleWebRTCOffer);
      socket.off('webrtc-answer', handleWebRTCAnswer);
      socket.off('webrtc-ice-candidate', handleICECandidate);
    };
  }, [socket, isConnected, exchangeId, callRoomId, currentUser]);

  const startPeerConnection = async () => {
    if (peerConnectionRef.current) return; // Already started
    
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ]
    });

    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('webrtc-ice-candidate', { candidate: event.candidate, roomId: callRoomId });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected');
      } else if (pc.connectionState === 'failed') {
        setConnectionStatus('error');
      }
    };

    peerConnectionRef.current = pc;
  };

  const createOffer = async () => {
    if (!peerConnectionRef.current) return;
    
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket?.emit('webrtc-offer', { sdp: offer, offererId: socket.id, roomId: callRoomId });
      console.log('Offer created and sent');
    } catch (error) {
      console.error('Error creating offer:', error);
      setConnectionStatus('error');
    }
  };

  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
    router.push('/exchanges');
  };
  
  const toggleMute = () => {
    if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
      if(localStreamRef.current) {
          localStreamRef.current.getVideoTracks().forEach(track => {
              track.enabled = !track.enabled;
          });
          setIsVideoOff(!isVideoOff);
      }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-900 text-white">
      {/* Video Streams */}
      <div className="relative flex-1">
        {/* Remote Video */}
        <div className="absolute top-0 left-0 h-full w-full bg-black flex items-center justify-center">
          <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
          <div className="absolute text-gray-400">
            {/* This will be hidden once remote video plays */}
            <p>
              {connectionStatus === 'waiting' && 'Waiting for the other user to join...'}
              {connectionStatus === 'waiting-for-offer' && 'Waiting for call to start...'}
              {connectionStatus === 'creating-offer' && 'Starting call...'}
              {connectionStatus === 'creating-answer' && 'Connecting...'}
              {connectionStatus === 'connected' && 'Connected'}
              {connectionStatus === 'error' && 'Connection failed'}
            </p>
          </div>
        </div>

        {/* Local Video */}
        <div className="absolute bottom-6 right-6 h-48 w-64 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg z-10">
          <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-800/50 backdrop-blur-sm z-10">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors ${isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        
        <button
          onClick={handleEndCall}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors mx-4"
        >
          <PhoneOff size={24} />
        </button>

        <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
} 