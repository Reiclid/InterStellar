import React, { useState, useEffect, useRef } from 'react';
import { Send, Lock, ShieldCheck, QrCode, Volume2, ShieldAlert, Cpu, EyeOff } from 'lucide-react';
import { DoubleRatchetSession } from '../crypto/doubleRatchet';
import { OpticalQrStream } from '../mesh/opticalQr';

export function ChatView({ meshManager, onKeystroke, aiMetrics, isDecoy }) {
  const [activePeer, setActivePeer] = useState('NODE-ALPHA-82');
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'NODE-ALPHA-82',
      text: 'Encrypted Double Ratchet channel initialized over local LAN.',
      timestamp: '20:01:05',
      padded: true,
      ratchetSeq: 1,
      fingerprint: '8F:3A:9C:21'
    },
    {
      id: 'm-2',
      sender: 'ME',
      text: 'Acknowledged. Mesh gossip protocol store-and-forward active.',
      timestamp: '20:01:42',
      padded: true,
      ratchetSeq: 2,
      fingerprint: '12:E4:B0:99'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [applyPadding, setApplyPadding] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrFrames, setQrFrames] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isAudioTransmitting, setIsAudioTransmitting] = useState(false);

  const ratchetSessionRef = useRef(new DoubleRatchetSession('NODE-ALPHA-82'));
  const qrCanvasRef = useRef(null);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    ratchetSessionRef.current.initialize();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // QR Stream Animation Timer
  useEffect(() => {
    let interval;
    if (showQrModal && qrFrames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % qrFrames.length);
      }, 350);
    }
    return () => clearInterval(interval);
  }, [showQrModal, qrFrames]);

  useEffect(() => {
    if (showQrModal && qrCanvasRef.current && qrFrames[currentFrameIdx]) {
      OpticalQrStream.renderFrameMatrix(qrCanvasRef.current, qrFrames[currentFrameIdx]);
    }
  }, [showQrModal, currentFrameIdx, qrFrames]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (onKeystroke) onKeystroke(e.target.value);
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const encryptedPacket = await ratchetSessionRef.current.encrypt(inputMessage, applyPadding);
    
    // Transmit via Mesh Manager DTN Router
    meshManager.broadcastPacket(activePeer, encryptedPacket.ciphertext);

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'ME',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      padded: applyPadding,
      ratchetSeq: encryptedPacket.header.n,
      fingerprint: encryptedPacket.header.dh.substring(0, 10)
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const triggerOpticalQr = async () => {
    const textToEncode = inputMessage || "INTERSTELLAR_OPTICAL_AIRGAP_PAYLOAD";
    const encryptedPacket = await ratchetSessionRef.current.encrypt(textToEncode, applyPadding);
    const frames = OpticalQrStream.generateFrames(JSON.stringify(encryptedPacket), 45);
    setQrFrames(frames);
    setCurrentFrameIdx(0);
    setShowQrModal(true);
  };

  const triggerAcousticPulse = async () => {
    setIsAudioTransmitting(true);
    const textToEncode = inputMessage || "ACOUSTIC_PULSE_PAYLOAD";
    await meshManager.acousticModem.transmitPayload(textToEncode);
    setIsAudioTransmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Sidebar: Peer Selection & Security State */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Peer Selection List */}
        <div className="mono-card p-4">
          <h2 className="text-xs font-mono text-zinc-400 mb-3 tracking-wider uppercase">ACTIVE MESH PEERS</h2>
          <div className="space-y-2">
            {meshManager.peerNodes.map((peer) => (
              <button
                key={peer.id}
                onClick={() => setActivePeer(peer.id)}
                className={`w-full p-3 rounded text-left transition flex items-center justify-between border ${
                  activePeer === peer.id 
                    ? 'bg-zinc-900 border-white text-white' 
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="font-mono text-xs font-semibold">{peer.id}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {peer.transport} • FP: {peer.keyFingerprint}
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              </button>
            ))}
          </div>
        </div>

        {/* E2EE Double Ratchet Status */}
        <div className="mono-card p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs text-zinc-400 uppercase">SIGNAL PROTOCOL</span>
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>ALGORITHM:</span>
              <span className="text-white">DOUBLE RATCHET</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>KEY EXCHANGE:</span>
              <span className="text-white">X3DH Curve25519</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>CIPHER SUITE:</span>
              <span className="text-white">ChaCha20-Poly1305</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>FORWARD SECRECY:</span>
              <span className="text-white font-semibold">PFS / PCS ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Padding Control */}
        <div className="mono-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-white font-semibold">METADATA PADDING</div>
            <div className="text-[10px] text-zinc-500 font-mono">Mask exact byte size</div>
          </div>
          <button
            onClick={() => setApplyPadding(!applyPadding)}
            className={`px-3 py-1 text-xs font-mono rounded transition border ${
              applyPadding ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            {applyPadding ? '256-BYTE BLOCKS' : 'RAW SIZE'}
          </button>
        </div>

      </div>

      {/* Main Chat Conversation View */}
      <div className="lg:col-span-3 mono-card flex flex-col h-[700px]">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            <div>
              <h3 className="font-mono text-sm text-white font-bold">{activePeer}</h3>
              <p className="text-[10px] text-zinc-500 font-mono">CHANNEL: END-TO-END ENCRYPTED // ZERO METADATA LOGGING</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerOpticalQr}
              className="btn-secondary text-xs px-2.5 py-1"
              title="Generate Animated QR Stream for 100% Air-Gapped Optical Transfer"
            >
              <QrCode className="w-3.5 h-3.5" />
              OPTICAL QR
            </button>

            <button
              onClick={triggerAcousticPulse}
              disabled={isAudioTransmitting}
              className="btn-secondary text-xs px-2.5 py-1"
              title="Transmit Ultrasonic Audio Pulse (18.5kHz)"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isAudioTransmitting ? 'animate-bounce' : ''}`} />
              {isAudioTransmitting ? 'TRANSMITTING...' : 'ACOUSTIC PULSE'}
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/30">
          {messages.map((msg) => {
            const isMe = msg.sender === 'ME';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-lg p-3 rounded.lg border ${
                    isMe
                      ? 'bg-zinc-900 border-zinc-700 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-1.5 mb-2 font-mono text-[10px] text-zinc-500">
                    <span className="font-semibold text-zinc-400">{msg.sender}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-sm font-sans leading-relaxed">{msg.text}</p>

                  <div className="mt-2.5 pt-1.5 border-t border-zinc-800/50 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-zinc-400" />
                      RATCHET #{msg.ratchetSeq}
                    </span>
                    {msg.padded && <span className="text-zinc-400">PADDED 256B</span>}
                    <span>FP: {msg.fingerprint}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time AI Behavioral Overlay Bar */}
        {aiMetrics && (
          <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-white" />
              <span>STYLOMETRY: TTR {aiMetrics.stylometry.ttr} | CAPS {aiMetrics.stylometry.capsRatio}% | WPM {aiMetrics.wpm || 48}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>TOXICITY: {aiMetrics.sentiment.toxicityScore}% ({aiMetrics.sentiment.level})</span>
              <span className={`w-2 h-2 rounded-full ${aiMetrics.sentiment.toxicityScore > 50 ? 'bg-white animate-ping' : 'bg-zinc-600'}`}></span>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type encrypted message (Signal Double Ratchet active)..."
            className="mono-input flex-1"
          />
          <button onClick={handleSend} className="btn-primary">
            <Send className="w-4 h-4" />
            SEND
          </button>
        </div>

      </div>

      {/* Optical Animated QR Stream Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="mono-card max-w-md w-full p-6 text-center space-y-4">
            <h3 className="font-mono text-sm text-white font-bold tracking-wider">OPTICAL AIR-GAP QR STREAM</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Scan this visual frame stream with another InterStellar camera scanner to transfer payload 100% offline.
            </p>

            <div className="flex justify-center my-4">
              <canvas ref={qrCanvasRef} width={280} height={280} className="border border-white/20 rounded bg-white" />
            </div>

            <div className="font-mono text-xs text-zinc-400">
              FRAME {currentFrameIdx + 1} OF {qrFrames.length}
            </div>

            <button onClick={() => setShowQrModal(false)} className="btn-secondary w-full justify-center">
              CLOSE SCANNER STREAM
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
