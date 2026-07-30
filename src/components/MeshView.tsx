import React, { useState } from 'react';
import { Radio, Wifi, Bluetooth, Volume2, QrCode, HardDrive } from 'lucide-react';
import { MeshManager } from '../mesh/meshManager';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface MeshViewProps {
  meshManager: MeshManager;
}

export const MeshView: React.FC<MeshViewProps> = ({ meshManager }) => {
  const [channels, setChannels] = useState(meshManager.channels);
  const [routingLog] = useState(meshManager.dtnRouter.routingLog);

  const toggleChannel = (key: string) => {
    meshManager.toggleTransport(key);
    setChannels({ ...meshManager.channels });
  };

  const dtnQueue = meshManager.dtnRouter.exportGossipBundle();

  // Recharts throughput mock timeline data
  const throughputData = [
    { time: '20:00', packets: 4, kbps: 12 },
    { time: '20:05', packets: 8, kbps: 24 },
    { time: '20:10', packets: 15, kbps: 45 },
    { time: '20:15', packets: 9, kbps: 28 },
    { time: '20:20', packets: 22, kbps: 68 },
    { time: '20:25', packets: dtnQueue.length + 5, kbps: (dtnQueue.length + 5) * 3 }
  ];

  // Recharts channel latency data
  const channelLatencyData = Object.keys(channels).map((key) => ({
    name: key.toUpperCase(),
    latency: channels[key].latencyMs || 10,
    active: channels[key].active
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="mono-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              MULTI-TRANSPORT MESH TOPOLOGY & TSX ANALYTICS
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Dynamic P2P transport fallback with Delay-Tolerant Network (DTN) Epidemic Gossip Routing
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            NODE ID: <span className="text-white font-bold">{meshManager.nodeId}</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-white text-black font-semibold">
            GOSSIP QUEUE: {dtnQueue.length} PKTS
          </div>
        </div>
      </div>

      {/* Network Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AreaChart: Packet Throughput */}
        <div className="mono-card p-5 space-y-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase">DTN PACKET THROUGHPUT (KB/S)</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#71717a" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0c', borderColor: '#27272a', borderRadius: '4px', fontSize: '11px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="kbps" stroke="#ffffff" fill="#ffffff" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BarChart: Channel Latency */}
        <div className="mono-card p-5 space-y-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase">TRANSPORT LATENCY MATRIX (MS)</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelLatencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 9 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0c', borderColor: '#27272a', borderRadius: '4px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
                  {channelLatencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.active ? '#ffffff' : '#3f3f46'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Transport Channel Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* LAN Channel */}
        <div className="mono-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-bold text-white">LOCAL LAN (mDNS / UDP)</span>
            </div>
            <button
              onClick={() => toggleChannel('lan')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                channels.lan.active ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {channels.lan.status}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">Auto-discovery over local Ethernet / Wi-Fi subnet.</p>
          <div className="flex justify-between font-mono text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
            <span>PEERS: {channels.lan.peersCount}</span>
            <span>LATENCY: {channels.lan.latencyMs}ms</span>
          </div>
        </div>

        {/* BLE Channel */}
        <div className="mono-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bluetooth className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-bold text-white">BLE 5.3 (ADVERTISE)</span>
            </div>
            <button
              onClick={() => toggleChannel('ble')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                channels.ble.active ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {channels.ble.status}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">Background discovery & direct encrypted packet transfer.</p>
          <div className="flex justify-between font-mono text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
            <span>PEERS: {channels.ble.peersCount}</span>
            <span>LATENCY: {channels.ble.latencyMs}ms</span>
          </div>
        </div>

        {/* Wi-Fi Direct */}
        <div className="mono-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-bold text-white">WI-FI DIRECT (NAN P2P)</span>
            </div>
            <button
              onClick={() => toggleChannel('wifiDirect')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                channels.wifiDirect.active ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {channels.wifiDirect.status}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">High-speed voice & file transfer without routers.</p>
          <div className="flex justify-between font-mono text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
            <span>PEERS: {channels.wifiDirect.peersCount}</span>
            <span>LATENCY: {channels.wifiDirect.latencyMs}ms</span>
          </div>
        </div>

        {/* Acoustic Audio */}
        <div className="mono-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-bold text-white">ACOUSTIC AUDIO MODEM</span>
            </div>
            <button
              onClick={() => toggleChannel('acoustic')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                channels.acoustic.active ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {channels.acoustic.status}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">18-20kHz ultrasonic modem for RF-jammed environments.</p>
          <div className="flex justify-between font-mono text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
            <span>PEERS: {channels.acoustic.peersCount}</span>
            <span>FREQ: 18.5k / 19.5k Hz</span>
          </div>
        </div>

        {/* Optical Animated QR */}
        <div className="mono-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-bold text-white">OPTICAL ANIMATED QR</span>
            </div>
            <button
              onClick={() => toggleChannel('opticalQr')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                channels.opticalQr.active ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {channels.opticalQr.status}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">100% air-gapped data transfer via camera frame stream.</p>
          <div className="flex justify-between font-mono text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
            <span>PEERS: {channels.opticalQr.peersCount}</span>
            <span>FPS: 3.5 FPS</span>
          </div>
        </div>

        {/* External LoRa Radio */}
        <div className="mono-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-bold text-white">LORA SERIAL (MESHTASTIC)</span>
            </div>
            <button
              onClick={() => toggleChannel('loraRadio')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                channels.loraRadio.active ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {channels.loraRadio.status}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">Long-range radio sub-GHz hardware interface.</p>
          <div className="flex justify-between font-mono text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
            <span>FREQ: 915 MHz</span>
            <span>BANDWIDTH: 125 kHz</span>
          </div>
        </div>

      </div>

      {/* DTN Gossip Protocol Routing Log Console */}
      <div className="mono-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase">DTN EPIDEMIC GOSSIP ROUTER LOG</h3>
          <span className="text-xs text-zinc-500 font-mono">STORE-AND-FORWARD ACTIVE</span>
        </div>

        <div className="bg-black p-4 rounded border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5 h-60 overflow-y-auto">
          {routingLog.length === 0 ? (
            <div className="text-zinc-600 italic">No packet gossip routing events logged yet.</div>
          ) : (
            routingLog.map((log: string, idx: number) => (
              <div key={idx} className="leading-relaxed hover:text-white">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
