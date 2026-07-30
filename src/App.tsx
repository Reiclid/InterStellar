import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { MeshView } from './components/MeshView';
import { AiView } from './components/AiView';
import { SecurityView } from './components/SecurityView';
import { UpdaterView } from './components/UpdaterView';

import { AccountSetupModal } from './components/AccountSetupModal';
import { ShareProfileModal } from './components/ShareProfileModal';
import { AddContactModal } from './components/AddContactModal';

import { AccountManager } from './identity/accountManager';
import { MeshManager } from './mesh/meshManager';
import { StylometryAnalyzer } from './ai/stylometry';
import { SentimentClassifier } from './ai/sentiment';
import { BiometricTypingDefense } from './ai/biometricTyping';
import { AntiForensicsEngine } from './security/antiForensics';
import { UserAccount, PeerContact } from './types/account';
import { AiMetrics } from './types/ai';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [account, setAccount] = useState<UserAccount | null>(AccountManager.getAccount());
  const [showSetupModal, setShowSetupModal] = useState(!AccountManager.hasAccount());
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [isDecoy, setIsDecoy] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');

  // AI & Mesh Engines
  const meshManagerRef = useRef<MeshManager>(new MeshManager(account));
  const biometricRef = useRef<BiometricTypingDefense>(new BiometricTypingDefense());

  const [aiMetrics, setAiMetrics] = useState<AiMetrics>({
    stylometry: StylometryAnalyzer.analyzeText(''),
    sentiment: SentimentClassifier.analyze(''),
    wpm: 52
  });

  const [anomalyScore, setAnomalyScore] = useState(10);
  const [peersCount, setPeersCount] = useState(meshManagerRef.current.peerNodes.length);

  useEffect(() => {
    meshManagerRef.current.subscribePeersChanged((peers: any) => {
      setPeersCount(peers.length);
    });
  }, []);

  const handleAccountCreated = (newAccount: UserAccount) => {
    setAccount(newAccount);
    setShowSetupModal(false);
    meshManagerRef.current = new MeshManager(newAccount);
  };

  const handleKeystroke = (text: string) => {
    biometricRef.current.recordKeyDown();

    const stylometry = StylometryAnalyzer.analyzeText(text);
    const sentiment = SentimentClassifier.analyze(text);
    const score = biometricRef.current.anomalyScore;

    setAnomalyScore(score);
    setAiMetrics({
      stylometry,
      sentiment,
      wpm: Math.min(120, 45 + text.length % 30)
    });

    if (biometricRef.current.isLockTriggered()) {
      setIsLocked(true);
    }
  };

  const handlePanicTrigger = () => {
    AntiForensicsEngine.triggerPanicWipe();
    setIsDecoy(true);
    setIsLocked(true);
  };

  const handleUnlockPin = () => {
    const result = AntiForensicsEngine.evaluatePin(pinInput);
    if (result.status === 'SUCCESS') {
      setIsLocked(false);
      setIsDecoy(false);
      biometricRef.current.resetBaseline();
      setAnomalyScore(0);
      setPinInput('');
    } else if (result.status === 'DURESS_TRIGGERED') {
      setIsDecoy(true);
      setIsLocked(false);
      setPinInput('');
    } else {
      alert("INVALID CREDENTIALS / ACCESS DENIED");
      setPinInput('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPanicTrigger={handlePanicTrigger}
        isDecoy={isDecoy}
        account={account}
        onShareProfile={() => setShowShareModal(true)}
        onAddContact={() => setShowAddContactModal(true)}
        peersCount={peersCount}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-12">
        {activeTab === 'chat' && (
          <ChatView
            meshManager={meshManagerRef.current}
            onKeystroke={handleKeystroke}
            aiMetrics={aiMetrics}
            onShareProfile={() => setShowShareModal(true)}
            onAddContact={() => setShowAddContactModal(true)}
          />
        )}

        {activeTab === 'mesh' && (
          <MeshView meshManager={meshManagerRef.current} />
        )}

        {activeTab === 'ai' && (
          <AiView
            aiMetrics={aiMetrics}
            biometricDefense={{ anomalyScore }}
            onResetBiometric={() => {
              biometricRef.current.resetBaseline();
              setAnomalyScore(0);
            }}
          />
        )}

        {activeTab === 'security' && (
          <SecurityView onPanicTrigger={handlePanicTrigger} />
        )}

        {activeTab === 'updater' && (
          <UpdaterView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black/90 py-4 font-mono text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>INTERSTELLAR MESH // TAURI v2 + TSX + RECHARTS ANALYTICS</span>
          <span className="text-zinc-400">REPO: https://github.com/Reiclid/InterStellar</span>
        </div>
      </footer>

      {/* Account Setup Modal (First launch) */}
      {showSetupModal && (
        <AccountSetupModal onAccountCreated={handleAccountCreated} />
      )}

      {/* Share Profile Modal */}
      {showShareModal && account && (
        <ShareProfileModal account={account} onClose={() => setShowShareModal(false)} />
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <AddContactModal
          onClose={() => setShowAddContactModal(false)}
          onContactAdded={(contact: PeerContact) => {
            meshManagerRef.current._loadSavedContacts();
            setPeersCount(meshManagerRef.current.peerNodes.length);
          }}
        />
      )}

      {/* Intruder / Lock Modal */}
      {isLocked && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="mono-card max-w-md w-full p-6 space-y-4 text-center border-white">
            <div className="w-12 h-12 rounded-full bg-white text-black font-mono font-bold text-xl flex items-center justify-center mx-auto">
              🔒
            </div>
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              {isDecoy ? "DECOY MODE UNLOCKED" : "BIOMETRIC DEFENSE APP LOCK"}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {isDecoy
                ? "Panic wipe triggered. Decoy mode active. Enter master credentials to restore real vault."
                : "Typing cadence anomaly detected or manual lock engaged. Enter Master PIN to resume."}
            </p>

            <div className="space-y-3 font-mono text-xs pt-2">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit PIN (Real: 1234, Duress: 9999)..."
                className="mono-input text-center text-base tracking-widest"
              />
              <button onClick={handleUnlockPin} className="btn-primary w-full justify-center text-sm py-2">
                VERIFY CREDENTIALS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
