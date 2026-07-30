import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { OpticalQrStream } from '../mesh/opticalQr';
import { UserAccount } from '../types/account';

interface ShareProfileModalProps {
  account: UserAccount;
  onClose: () => void;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({ account, onClose }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && account) {
      OpticalQrStream.renderFrameMatrix(canvasRef.current, {
        seq: 1,
        total: 1,
        data: account.identityTag,
        hash: account.keyFingerprint
      });
    }
  }, [account]);

  const copyTag = () => {
    navigator.clipboard.writeText(account.identityTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="mono-card max-w-md w-full p-6 space-y-4 border-white text-center">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase">SHARE REAL IDENTITY TAG</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 font-mono">
          Give this Identity Tag or QR Code to a peer so they can add you and start a real E2EE Double Ratchet chat.
        </p>

        {/* QR Code */}
        <div className="flex justify-center my-3">
          <canvas ref={canvasRef} width={240} height={240} className="border border-white/20 rounded bg-white" />
        </div>

        {/* Identity Tag Box */}
        <div className="p-3 rounded bg-zinc-950 border border-zinc-800 text-left font-mono text-xs space-y-1">
          <span className="text-zinc-500 text-[10px] block">YOUR PUBLIC IDENTITY TAG:</span>
          <div className="text-white font-bold break-all select-all">{account.identityTag}</div>
        </div>

        <button onClick={copyTag} className="btn-primary w-full justify-center">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "COPIED TO CLIPBOARD" : "COPY IDENTITY TAG"}
        </button>

      </div>
    </div>
  );
};
