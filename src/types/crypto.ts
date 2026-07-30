export interface PacketHeader {
  dh: string;
  pn: number;
  n: number;
}

export interface EncryptedPacket {
  header: PacketHeader;
  iv: string;
  ciphertext: string;
  padded: boolean;
}

export interface DecryptedResult {
  text: string;
  success: boolean;
  error?: string;
}
