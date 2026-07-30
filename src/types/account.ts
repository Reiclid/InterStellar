export interface UserAccount {
  nickname: string;
  identityTag: string;
  pubKeyHex: string;
  createdAt: string;
  keyFingerprint: string;
}

export interface PeerContact {
  id: string;
  identityTag: string;
  nickname: string;
  pubKeyShort?: string;
  keyFingerprint: string;
  status: "ONLINE" | "OFFLINE" | "SAVED" | "STANDBY";
  transport?: string;
  lastSeen?: string;
}
