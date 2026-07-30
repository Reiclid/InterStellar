import React from 'react';
import { Shield, Radio, Cpu, Lock, RefreshCw, MessageSquare, AlertOctagon } from 'lucide-react';

export function Header({ activeTab, setActiveTab, onPanicTrigger, isLocked, isDecoy }) {
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
              {isDecoy ? (
                <span className="mono-badge text-xs bg-zinc-800 text-zinc-400">DECOY MODE</span>
              ) : (
                <span className="mono-badge mono-badge-active text-[10px]">E2EE DOUBLE RATCHET</span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">DECENTRALIZED MESH // ON-DEVICE AI DEFENSE</p>
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
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-zinc-300">4 PEERS ONLINE</span>
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

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden overflow-x-auto border-t border-zinc-800 p-2 gap-1 bg-zinc-950">
        <button onClick={() => setActiveTab('chat')} className={`px-2.5 py-1 text-xs font-mono rounded ${activeTab === 'chat' ? 'bg-white text-black' : 'text-zinc-400'}`}>Chat</button>
        <button onClick={() => setActiveTab('mesh')} className={`px-2.5 py-1 text-xs font-mono rounded ${activeTab === 'mesh' ? 'bg-white text-black' : 'text-zinc-400'}`}>Mesh</button>
        <button onClick={() => setActiveTab('ai')} className={`px-2.5 py-1 text-xs font-mono rounded ${activeTab === 'ai' ? 'bg-white text-black' : 'text-zinc-400'}`}>AI</button>
        <button onClick={() => setActiveTab('security')} className={`px-2.5 py-1 text-xs font-mono rounded ${activeTab === 'security' ? 'bg-white text-black' : 'text-zinc-400'}`}>Vault</button>
        <button onClick={() => setActiveTab('updater')} className={`px-2.5 py-1 text-xs font-mono rounded ${activeTab === 'updater' ? 'bg-white text-black' : 'text-zinc-400'}`}>Updates</button>
      </div>
    </header>
  );
}
