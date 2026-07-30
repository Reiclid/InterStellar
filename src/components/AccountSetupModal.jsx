import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Key } from 'lucide-react';
import { AccountManager } from '../identity/accountManager';

export function AccountSetupModal({ onAccountCreated }) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("Please enter a nickname.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }
    if (password !== confirmPass) {
      setError("Passphrases do not match.");
      return;
    }

    setLoading(true);
    try {
      const account = await AccountManager.createAccount(nickname, password);
      onAccountCreated(account);
    } catch (err) {
      setError("Account creation error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="mono-card max-w-md w-full p-6 space-y-6 border-white">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-white text-black font-mono font-bold text-xl flex items-center justify-center mx-auto">
            ✦
          </div>
          <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
            CREATE REAL INTERSTELLAR IDENTITY
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Zero central servers. Generates real Ed25519 / X25519 identity keypairs stored locally on your device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          
          <div>
            <label className="block text-zinc-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-white" />
              NICKNAME:
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. CyberKnight"
              className="mono-input"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-white" />
              MASTER VAULT PASSPHRASE:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter master password..."
              className="mono-input"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-white" />
              CONFIRM PASSPHRASE:
            </label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm master password..."
              className="mono-input"
            />
          </div>

          {error && (
            <div className="p-3 rounded bg-zinc-900 border border-white text-white text-[11px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-sm py-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? "GENERATING KEYPAIR..." : "GENERATE IDENTITY & LAUNCH"}
          </button>

        </form>

      </div>
    </div>
  );
}
