export interface DtnPacket {
  id: string;
  sender: string;
  recipient: string;
  hopsRemaining: number;
  timestamp: number;
  payload: string;
  hopPath: string[];
}

export interface TransportChannel {
  active: boolean;
  name: string;
  status: string;
  peersCount: number;
  latencyMs: number;
}
