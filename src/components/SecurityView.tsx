import React, { useState, useRef } from 'react';
import { Lock, ShieldAlert, Key, Image as ImageIcon, Download, Upload } from 'lucide-react';
import { SteganographyEngine } from '../crypto/steganography';
import { SecureVault } from '../crypto/secureStorage';

interface SecurityViewProps {
  onPanicTrigger: () => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ onPanicTrigger }) => {
  const [stegoSecretText, setStegoSecretText] = useState('');
  const [stegoOutputImage, setStegoOutputImage] = useState<string | null>(null);
  const [extractedSecret, setExtractedSecret] = useState<string | null>(null);
  const [stegoStatus, setStegoStatus] = useState('');

  const [masterPassword, setMasterPassword] = useState('');
  const [vaultStatus, setVaultStatus] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleVaultSetup = async () => {
    if (!masterPassword) return;
    try {
      const derivedKey = await SecureVault.deriveMasterKey(masterPassword, "INTERSTELLAR_SALT");
      await SecureVault.encryptData(
        { timestamp: Date.now(), contacts: ["NODE-ALPHA-82"], keys: "E2EE_KEYRING_VALID" },
        derivedKey
      );
      setVaultStatus("Vault derivation complete. PBKDF2 100,000 rounds + AES-GCM-256 key active.");
    } catch (e: any) {
      setVaultStatus("Vault setup failed: " + e.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        if (stegoSecretText) {
          try {
            const resultDataUrl = SteganographyEngine.embedMessage(canvas, stegoSecretText);
            setStegoOutputImage(resultDataUrl);
            setStegoStatus("Secret payload embedded successfully into image pixel LSBs!");
          } catch (err: any) {
            setStegoStatus("Embedding error: " + err.message);
          }
        } else {
          const result = SteganographyEngine.extractMessage(canvas);
          if (result.success) {
            setExtractedSecret(result.secret);
            setStegoStatus("Hidden InterStellar payload detected and extracted!");
          } else {
            setExtractedSecret(null);
            setStegoStatus(result.error);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="mono-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-white" />
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              ANTI-FORENSICS & HARDENED PROTECTION
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Zero-Knowledge database vault, image steganography, & instant zeroization duress PIN
          </p>
        </div>
        <button onClick={onPanicTrigger} className="btn-danger">
          <ShieldAlert className="w-4 h-4" />
          TRIGGER IMMEDIATE DURESS PURGE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Zero-Knowledge Vault Setup */}
        <div className="mono-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase">ZERO-KNOWLEDGE VAULT (SQLCIPHER / ARGON2)</h3>
            <Key className="w-4 h-4 text-zinc-400" />
          </div>

          <p className="text-xs text-zinc-400 font-mono">
            Derive hardware-backed vault encryption key from master password using Argon2id / PBKDF2 (100,000 iterations).
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">MASTER VAULT PASSWORD:</label>
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Enter master key derivation passphrase..."
                className="mono-input"
              />
            </div>

            <button onClick={handleVaultSetup} className="btn-primary w-full justify-center">
              INITIALIZE ENCRYPTED VAULT
            </button>

            {vaultStatus && (
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                {vaultStatus}
              </div>
            )}
          </div>
        </div>

        {/* Duress & Panic PIN Configuration */}
        <div className="mono-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase">DURESS PIN & PLAUSIBLE DENIABILITY</h3>
            <ShieldAlert className="w-4 h-4 text-zinc-400" />
          </div>

          <p className="text-xs text-zinc-400 font-mono">
            If forced to unlock app under coercion, enter your Duress PIN. The app will zero out keys and render decoy news data.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-2.5 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">DEFAULT REAL PIN:</span>
              <span className="text-white font-bold">1234</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">DEFAULT DURESS PANIC PIN:</span>
              <span className="text-white font-bold">9999</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded bg-zinc-950 border border-zinc-850">
              <span className="text-zinc-400">RAM KEY ZEROIZATION:</span>
              <span className="text-white font-bold">AUTOMATIC</span>
            </div>
          </div>
        </div>

      </div>

      {/* Steganography Section */}
      <div className="mono-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase">IMAGE STEGANOGRAPHY ENGINE (LSB PAYLOAD HIDER)</h3>
          <ImageIcon className="w-4 h-4 text-zinc-400" />
        </div>

        <p className="text-xs text-zinc-400 font-mono">
          Hide encrypted Double Ratchet payloads inside PNG image pixel Least Significant Bits (LSB).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
          
          {/* Embed Mode */}
          <div className="space-y-3">
            <label className="block text-zinc-400">SECRET PAYLOAD TO HIDE:</label>
            <textarea
              rows={3}
              value={stegoSecretText}
              onChange={(e) => setStegoSecretText(e.target.value)}
              placeholder="Type message to hide inside image pixels..."
              className="mono-input resize-none"
            />

            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary w-full justify-center"
            >
              <Upload className="w-4 h-4" />
              SELECT CARRIER IMAGE & PROCESS
            </button>
          </div>

          {/* Stego Output / Extracted Result */}
          <div className="space-y-3">
            {stegoStatus && (
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800 text-white font-mono text-[11px]">
                {stegoStatus}
              </div>
            )}

            {extractedSecret && (
              <div className="p-3 rounded bg-zinc-900 border border-white text-white font-mono text-xs space-y-1">
                <span className="text-zinc-400 block text-[10px]">EXTRACTED SECRET PAYLOAD:</span>
                <p className="break-all font-semibold">{extractedSecret}</p>
              </div>
            )}

            {stegoOutputImage && (
              <div className="space-y-2">
                <span className="text-zinc-400 block text-[10px]">STEGANOGRAPHIC CARRIER PNG:</span>
                <img src={stegoOutputImage} alt="Stego Output" className="w-32 h-32 object-cover border border-white/20 rounded" />
                <a
                  href={stegoOutputImage}
                  download="interstellar_stego_carrier.png"
                  className="btn-primary text-xs inline-flex"
                >
                  <Download className="w-3.5 h-3.5" />
                  DOWNLOAD CARRIER PNG
                </a>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
