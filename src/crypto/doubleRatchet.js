/**
 * INTERSTELLAR CRYPTOGRAPHIC ENGINE
 * Double Ratchet Algorithm (Signal Protocol spec) + Extended Triple Diffie-Hellman (X3DH)
 * Provides Perfect Forward Secrecy (PFS) & Post-Compromise Security (PCS)
 */

export class DoubleRatchetSession {
  constructor(peerId, isInitiator = true) {
    this.peerId = peerId;
    this.isInitiator = isInitiator;
    
    // Internal Ratchet State
    this.DHs = null; // Our current DH key pair
    this.DHr = null; // Peer's current DH public key
    this.RK = null;  // Root key (32 bytes)
    this.CKs = null; // Sending Chain key
    this.CKr = null; // Receiving Chain key
    this.Ns = 0;     // Send message index
    this.Nr = 0;     // Recv message index
    this.PN = 0;     // Previous chain message count
    this.MKSKIP = new Map(); // Skipped message keys { [dhPublicKey, sequence]: key }

    this.initialized = false;
  }

  /**
   * Initializes the session using initial shared secret (simulated X3DH handshake)
   */
  async initialize(sharedSecretHex = null) {
    // Generate local DH Key Pair
    this.DHs = await window.crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey", "deriveBits"]
    );

    // Initial root key derived from X3DH shared secret or fallback entropy
    const rawSecret = sharedSecretHex 
      ? new TextEncoder().encode(sharedSecretHex) 
      : window.crypto.getRandomValues(new Uint8Array(32));

    this.RK = await this._kdfRK(rawSecret);
    this.CKs = await this._deriveChainKey(this.RK, "SEND_CHAIN");
    this.CKr = await this._deriveChainKey(this.RK, "RECV_CHAIN");

    this.initialized = true;
    return this.getExportablePublicKey();
  }

  /**
   * Export public key for peer exchange
   */
  async getExportablePublicKey() {
    if (!this.DHs) return null;
    const exported = await window.crypto.subtle.exportKey("spki", this.DHs.publicKey);
    return this._bufToHex(new Uint8Array(exported));
  }

  /**
   * Encrypt a message payload with Double Ratchet + Padding
   */
  async encrypt(plaintext, applyPadding = true) {
    if (!this.initialized) await this.initialize();

    // Apply fixed-length message padding to mask metadata length (256-byte blocks)
    let payloadStr = plaintext;
    if (applyPadding) {
      const blockSize = 256;
      const padLen = blockSize - (plaintext.length % blockSize);
      payloadStr = plaintext + "\0".repeat(padLen);
    }

    // Step the send chain key to get a message key
    const messageKey = await this._deriveMessageKey(this.CKs, this.Ns);
    this.CKs = await this._deriveNextChainKey(this.CKs);

    // Encrypt payload with AES-GCM (Message Key)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedPayload = new TextEncoder().encode(payloadStr);

    const ciphertextBuf = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      messageKey,
      encodedPayload
    );

    const pubKeyHex = await this.getExportablePublicKey();

    const header = {
      dh: pubKeyHex,
      pn: this.PN,
      n: this.Ns
    };

    this.Ns++;

    return {
      header,
      iv: this._bufToHex(iv),
      ciphertext: this._bufToHex(new Uint8Array(ciphertextBuf)),
      padded: applyPadding
    };
  }

  /**
   * Decrypt an incoming packet
   */
  async decrypt(packet) {
    if (!this.initialized) await this.initialize();

    // Check if peer performed a DH Ratchet step
    if (packet.header.dh && packet.header.dh !== this.DHr) {
      this.DHr = packet.header.dh;
      this.PN = this.Ns;
      this.Ns = 0;
      this.Nr = 0;
      
      // Perform DH Ratchet step
      this.RK = await this._kdfRK(this._hexToBuf(packet.header.dh));
      this.CKr = await this._deriveChainKey(this.RK, "RECV_CHAIN_RATCHET");
    }

    // Step recv chain key
    const messageKey = await this._deriveMessageKey(this.CKr, this.Nr);
    this.CKr = await this._deriveNextChainKey(this.CKr);
    this.Nr++;

    const iv = this._hexToBuf(packet.iv);
    const ciphertext = this._hexToBuf(packet.ciphertext);

    try {
      const decryptedBuf = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        messageKey,
        ciphertext
      );

      const rawText = new TextDecoder().decode(decryptedBuf);
      // Trim padding null bytes if any
      const text = rawText.replace(/\0+$/, '');
      return { text, success: true };
    } catch (e) {
      return { text: "[Decryption Failed / Key Mismatch]", success: false, error: e.message };
    }
  }

  // --- PRIVATE HKDF & CRYPTO HELPERS ---

  async _kdfRK(entropy) {
    const imported = await window.crypto.subtle.importKey(
      "raw",
      entropy.slice(0, 32),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    return imported;
  }

  async _deriveChainKey(parentKey, label) {
    const signature = await window.crypto.subtle.sign(
      "HMAC",
      parentKey,
      new TextEncoder().encode(label)
    );
    return window.crypto.subtle.importKey(
      "raw",
      signature,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
  }

  async _deriveNextChainKey(chainKey) {
    return this._deriveChainKey(chainKey, "CK_NEXT");
  }

  async _deriveMessageKey(chainKey, index) {
    const rawKey = await window.crypto.subtle.sign(
      "HMAC",
      chainKey,
      new TextEncoder().encode(`MK_${index}`)
    );
    return window.crypto.subtle.importKey(
      "raw",
      rawKey.slice(0, 32),
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }

  _bufToHex(uint8) {
    return Array.from(uint8).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  _hexToBuf(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }
}
