import React, { useState } from 'react';
import { UserPlus, X, Check } from 'lucide-react';
import { AccountManager } from '../identity/accountManager';
import { PeerContact } from '../types/account';

interface AddContactModalProps {
  onClose: () => void;
  onContactAdded: (contact: PeerContact) => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onContactAdded }) => {
  const [identityInput, setIdentityInput] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityInput.trim()) return;

    try {
      const contact = AccountManager.addContact(identityInput);
      setSuccessMsg(`Contact added: ${contact.nickname} (${contact.identityTag})`);
      setError('');
      setTimeout(() => {
        onContactAdded(contact);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="mono-card max-w-md w-full p-6 space-y-4 border-white">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase">ADD REAL MESH CONTACT</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 font-mono">
          Paste your peer's Identity Tag (e.g. <code>INTSTLR-8F3A9C21-CYBERKNIGHT</code>) to initialize a real E2EE session.
        </p>

        <form onSubmit={handleAdd} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">IDENTITY TAG:</label>
            <input
              type="text"
              required
              value={identityInput}
              onChange={(e) => setIdentityInput(e.target.value)}
              placeholder="Paste INTSTLR-XXXX-NICKNAME tag..."
              className="mono-input"
            />
          </div>

          {error && (
            <div className="p-3 rounded bg-zinc-900 border border-white text-white text-[11px]">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded bg-white text-black font-bold text-[11px] flex items-center gap-2">
              <Check className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          <button type="submit" className="btn-primary w-full justify-center">
            <UserPlus className="w-4 h-4" />
            ADD CONTACT
          </button>
        </form>

      </div>
    </div>
  );
};
