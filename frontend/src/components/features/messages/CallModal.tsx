import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, X } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';

interface CallModalProps {
  exchangeId: string;
  open: boolean;
  onClose: () => void;
  audioOnly?: boolean;
  isIncoming?: boolean;
}

const CallModal: React.FC<CallModalProps> = ({ 
  exchangeId, 
  open, 
  onClose, 
  audioOnly = false,
  isIncoming = false
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(audioOnly);
  const [callState, setCallState] = useState<'incoming' | 'outgoing' | 'connecting' | 'connected' | 'ended'>(
    isIncoming ? 'incoming' : 'outgoing'
  );
  const [timeLeft, setTimeLeft] = useState(30); // Auto-decline timer for incoming calls
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isOfferer = useRef(false);

  const callRoomId = `call-${exchangeId}`;
  const { socket, isConnected } = useSocket();
  const { user: currentUser } = useAuth();

  // Auto-decline timer for incoming calls
  useEffect(() => {
    if (!open || callState !== 'incoming') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleDeclineCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, callState]);

  const startPeerConnection = useCallback(async () => {
    if (peerConnectionRef.current) return;
    
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ]
    });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

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
      if (pc.connectionState === 'connected') {
        setCallState('connected');
      } else if (pc.connectionState === 'failed') {
        setCallState('ended');
      }
    };

    peerConnectionRef.current = pc;
  }, [callRoomId, socket]);

  const createOffer = useCallback(async () => {
    if (!peerConnectionRef.current) return;
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket?.emit('webrtc-offer', { sdp: offer, offererId: socket.id, roomId: callRoomId });
    } catch (error: unknown) {
      console.error('Error creating offer:', error);
      setCallState('ended');
    }
  }, [callRoomId, socket]);

  const handleAcceptCall = async () => {
    if (!socket || !currentUser) return;

    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: !audioOnly, 
        audio: true 
      });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      if (audioOnly) {
        stream.getVideoTracks().forEach(track => (track.enabled = false));
      }

      setCallState('connecting');
      
      // Join the call room and emit acceptance
      socket.emit('join-call-room', callRoomId);
      socket.emit('accept-call', { roomId: callRoomId, exchangeId });
      
      // Start peer connection
      await startPeerConnection();
      setCallState('connecting');
    } catch (error) {
      console.error('Error accepting call:', error);
      setCallState('ended');
    }
  };

  const handleDeclineCall = () => {
    if (socket) {
      socket.emit('reject-call', { roomId: callRoomId, exchangeId });
    }
    handleEndCall();
  };

  const handleEndCall = () => {
    if (socket) {
      socket.emit('end-call', { roomId: callRoomId, exchangeId });
    }
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
    setCallState('ended');
    onClose();
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

  // Initialize outgoing call
  useEffect(() => {
    if (!open || callState !== 'outgoing' || !socket || !isConnected || !currentUser) return;

    const initializeOutgoingCall = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: !audioOnly, 
          audio: true 
        });
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        if (audioOnly) {
          stream.getVideoTracks().forEach(track => (track.enabled = false));
        }

        // Join the call room
        socket.emit('join-call-room', callRoomId);
        socket.emit('call-presence', { roomId: callRoomId, userId: currentUser.id });
        
        setCallState('connecting');
      } catch (error) {
        console.error('Error initializing outgoing call:', error);
        setCallState('ended');
      }
    };

    initializeOutgoingCall();
  }, [open, callState, socket, isConnected, currentUser, callRoomId, audioOnly]);

  // Socket event listeners
  useEffect(() => {
    if (!open || !socket) return;

    const handleUserJoined = () => {
      if (callState === 'connecting') {
        setCallState('connecting');
        isOfferer.current = true;
        startPeerConnection().then(() => {
          createOffer();
        });
      }
    };

    const handleCallPresence = () => {
      if (callState === 'connecting') {
        setCallState('connecting');
        isOfferer.current = false;
        startPeerConnection();
      }
    };

    const handleWebRTCOffer = ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      if (callState === 'connecting' && !isOfferer.current) {
        startPeerConnection().then(() => {
          peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(sdp))
            .then(() => peerConnectionRef.current?.createAnswer())
            .then(answerSdp => {
              peerConnectionRef.current?.setLocalDescription(answerSdp);
              socket.emit('webrtc-answer', { sdp: answerSdp, answererId: socket.id, roomId: callRoomId });
              setCallState('connected');
            })
            .catch(() => setCallState('ended'));
        });
      }
    };

    const handleWebRTCAnswer = ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp))
          .then(() => setCallState('connected'))
          .catch(() => setCallState('ended'));
      }
    };

    const handleICECandidate = ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const handleCallRejected = () => {
      setCallState('ended');
      onClose();
    };

    const handleCallEnded = () => {
      setCallState('ended');
      onClose();
    };

    socket.on('user-joined', handleUserJoined);
    socket.on('call-presence', handleCallPresence);
    socket.on('webrtc-offer', handleWebRTCOffer);
    socket.on('webrtc-answer', handleWebRTCAnswer);
    socket.on('webrtc-ice-candidate', handleICECandidate);
    socket.on('call-rejected', handleCallRejected);
    socket.on('call-ended', handleCallEnded);

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('call-presence', handleCallPresence);
      socket.off('webrtc-offer', handleWebRTCOffer);
      socket.off('webrtc-answer', handleWebRTCAnswer);
      socket.off('webrtc-ice-candidate', handleICECandidate);
      socket.off('call-rejected', handleCallRejected);
      socket.off('call-ended', handleCallEnded);
    };
  }, [open, socket, callState, callRoomId, startPeerConnection, createOffer, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full max-w-2xl h-[70vh] bg-gray-900 rounded-xl shadow-lg flex flex-col">
        {/* Video Streams */}
        <div className="relative flex-1">
          {/* Remote Video */}
          <div className="absolute top-0 left-0 h-full w-full bg-black flex items-center justify-center">
            <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
            <div className="absolute text-gray-400 text-center">
              <p>
                {callState === 'incoming' && 'Incoming call...'}
                {callState === 'outgoing' && 'Calling...'}
                {callState === 'connecting' && 'Connecting...'}
                {callState === 'connected' && 'Connected'}
                {callState === 'ended' && 'Call ended'}
              </p>
            </div>
          </div>
          
          {/* Local Video */}
          {!audioOnly && callState !== 'incoming' && (
            <div className="absolute bottom-6 right-6 h-32 w-48 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg z-10">
              <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* Incoming Call UI */}
        {callState === 'incoming' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 text-center max-w-sm">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Incoming Video Call</h3>
              <p className="text-gray-600 mb-4">Exchange #{exchangeId.slice(-6)}</p>
              <p className="text-sm text-gray-500 mb-4">Auto-decline in {timeLeft}s</p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeclineCall}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptCall}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Control Bar */}
        {callState !== 'incoming' && (
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-800/50 backdrop-blur-sm z-10">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            {!audioOnly && (
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
            )}
            
            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors mx-4"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-800/80 rounded-full text-white hover:bg-gray-700 z-20"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default CallModal; 