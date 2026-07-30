import React from 'react';
import { Shield, Radio, Cpu, Lock, RefreshCw, MessageSquare, AlertOctagon, Share2, UserPlus, User } from 'lucide-react';

export function Header({ activeTab, setActiveTab, onPanicTrigger, isDecoy, account, onShareProfile, onAddContact, peersCount }) {
  return (
    <header className="border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white text-black font-mono font-bold flex items-center justify-center text-lg tracking-tighter">
            ✦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm font-bold tracking-widest text-white uppercase">INTERSTELLAR</h1>
              {account && (
                <span className="mono-badge mono-badge-active text-[10px] uppercase">
                  {account.nickname}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              {account ? account.identityTag : "DECENTRALIZED MESH // ON-DEVICE AI DEFENSE"}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-md border border-zinc-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition ${
              activeTab === 'chat' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            MESSENGER
          </button>

          <button
            onClick={() => setActiveTab('mesh')}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition ${
              activeTab === 'mesh' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            MESH MATRIX
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition ${
              activeTab === 'ai' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            AI PROFILER
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition ${
              activeTab === 'security' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            SECURITY VAULT
          </button>

          <button
            onClick={() => setActiveTab('updater')}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition ${
              activeTab === 'updater' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            GITHUB UPDATER
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onShareProfile}
            className="btn-secondary text-xs px-2.5 py-1.5"
            title="Share your Identity Tag & QR Code"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>MY ID</span>
          </button>

          <button
            onClick={onAddContact}
            className="btn-secondary text-xs px-2.5 py-1.5"
            title="Add contact by Identity Tag"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>ADD PEER</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono text-[11px]">
            <span className={`w-2 h-2 rounded-full ${peersCount > 0 ? 'bg-white animate-pulse' : 'bg-zinc-600'}`}></span>
            <span className="text-zinc-300">{peersCount} PEERS</span>
          </div>

          <button
            onClick={onPanicTrigger}
            title="DURESS PANIC BUTTON: Instant key zeroization & storage purge"
            className="btn-danger flex items-center gap-1.5"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>PANIC</span>
          </button>
        </div>

      </div>
    </header>
  );
}
