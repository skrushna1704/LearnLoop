'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  
  const params = useParams();
  const router = useRouter();
  const exchangeId = params.exchangeId as string;
  const callRoomId = `call-${exchangeId}`;

  const { socket, isConnected } = useSocket();
  const { user: currentUser } = useAuth();

  // Simple function to create PeerConnection
  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle remote tracks
    pc.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind);
      if (event.streams && event.streams[0] && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected');
      } else if (pc.connectionState === 'failed') {
        setConnectionStatus('error');
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('webrtc-ice-candidate', { candidate: event.candidate, roomId: callRoomId });
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [callRoomId, socket]);

  // Initialize call
  const initializeCall = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create PeerConnection
      const pc = createPeerConnection();
      
      // Determine who creates offer (lower user ID)
      const otherUserId = socket?.id === 'NdoIhrpsUnwXZEIGAABD' ? '6852c3874249701dc97d9953' : 'NdoIhrpsUnwXZEIGAABD';
      const isOfferer = (currentUser?.id || '') < otherUserId;

      if (isOfferer) {
        console.log('Creating offer...');
        setConnectionStatus('creating-offer');
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.emit('webrtc-offer', { sdp: offer, roomId: callRoomId });
      } else {
        console.log('Waiting for offer...');
        setConnectionStatus('waiting-for-offer');
      }
    } catch (error) {
      console.error('Error initializing call:', error);
      setConnectionStatus('error');
    }
  }, [currentUser?.id, callRoomId, socket, createPeerConnection]);

  // Handle incoming offer
  const handleOffer = useCallback(async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
    console.log('Received offer, creating answer...');
    setConnectionStatus('creating-answer');
    
    const pc = peerConnectionRef.current!;
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket?.emit('webrtc-answer', { sdp: answer, roomId: callRoomId });
  }, [callRoomId, socket]);

  // Handle incoming answer
  const handleAnswer = useCallback(async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
    console.log('Received answer');
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  }, []);

  // Handle ICE candidates
  const handleICECandidate = useCallback(async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  // Setup
  useEffect(() => {
    if (!socket || !isConnected || !currentUser) return;

    // Join room
    socket.emit('join-call-room', callRoomId);
    
    // Initialize call
    initializeCall();

    // Setup listeners
    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('webrtc-ice-candidate', handleICECandidate);

    return () => {
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('webrtc-ice-candidate', handleICECandidate);
    };
  }, [socket, isConnected, currentUser, callRoomId, initializeCall, handleOffer, handleAnswer, handleICECandidate]);

  // Cleanup
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
    };
  }, []);

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
    if (localStreamRef.current) {
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
            <p>
              {connectionStatus === 'waiting' && 'Starting call...'}
              {connectionStatus === 'waiting-for-offer' && 'Waiting for other user...'}
              {connectionStatus === 'creating-offer' && 'Creating connection...'}
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