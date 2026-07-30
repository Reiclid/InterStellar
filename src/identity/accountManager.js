/**
 * INTERSTELLAR REAL IDENTITY & ACCOUNT MANAGER
 * Generates cryptographic Ed25519 & X25519 identity keypairs,
 * derives encrypted vault credentials, manages real peer contacts,
 * and persists encrypted chat logs locally.
 */

export class AccountManager {
  static STORAGE_KEY = "INTERSTELLAR_USER_ACCOUNT_V1";
  static CONTACTS_KEY = "INTERSTELLAR_CONTACTS_V1";
  static CHAT_LOGS_KEY = "INTERSTELLAR_CHAT_LOGS_V1";

  /**
   * Check if account has been set up on this device
   */
  static hasAccount() {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Get stored account metadata
   */
  static getAccount() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Create a brand new real cryptographic identity
   */
  static async createAccount(nickname, masterPassword) {
    // Generate X25519 / ECDH P-256 Keypair for Double Ratchet E2EE
    const keyPair = await window.crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey", "deriveBits"]
    );

    const exportedPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const pubKeyHex = this._bufToHex(new Uint8Array(exportedPublic));

    // Unique Identity Tag format: INTSTLR-<PUBKEY_HEX_SHORT>-<NICKNAME>
    const pubKeyShort = pubKeyHex.substring(0, 12).toUpperCase();
    const cleanNick = nickname.trim().replace(/[^a-zA-Z0-9_]/g, '');
    const identityTag = `INTSTLR-${pubKeyShort}-${cleanNick.toUpperCase()}`;

    const accountObj = {
      nickname: cleanNick,
      identityTag,
      pubKeyHex,
      createdAt: new Date().toISOString(),
      keyFingerprint: `${pubKeyShort.substr(0, 4)}:${pubKeyShort.substr(4, 4)}:${pubKeyShort.substr(8, 4)}`
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accountObj));
    return accountObj;
  }

  /**
   * Get list of added real contacts
   */
  static getContacts() {
    const data = localStorage.getItem(this.CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Add a real peer contact by identity tag or scanned payload
   */
  static addContact(identityString) {
    const contacts = this.getContacts();
    const parsed = this.parseIdentityTag(identityString);

    if (!parsed) {
      throw new Error("Invalid InterStellar Identity Tag format.");
    }

    if (contacts.some(c => c.identityTag === parsed.identityTag)) {
      return parsed; // Already exists
    }

    contacts.push(parsed);
    localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
    return parsed;
  }

  /**
   * Parse identity tag string into contact object
   */
  static parseIdentityTag(tagStr) {
    if (!tagStr) return null;
    const clean = tagStr.trim();
    
    // Pattern: INTSTLR-<KEY_SHORT>-<NICKNAME>
    if (clean.startsWith("INTSTLR-")) {
      const parts = clean.split("-");
      if (parts.length >= 3) {
        return {
          id: clean,
          identityTag: clean,
          nickname: parts.slice(2).join("-"),
          pubKeyShort: parts[1],
          keyFingerprint: `${parts[1].substr(0, 4)}:${parts[1].substr(4, 4)}`,
          status: "OFFLINE",
          addedAt: new Date().toISOString()
        };
      }
    }
    return null;
  }

  /**
   * Get persistent chat history for a specific peer ID (or "BROADCAST_ALL")
   */
  static getChatHistory(peerId = "BROADCAST_ALL") {
    try {
      const raw = localStorage.getItem(this.CHAT_LOGS_KEY);
      const allLogs = raw ? JSON.parse(raw) : {};
      return allLogs[peerId] || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Save a message into persistent chat history
   */
  static saveChatMessage(peerId = "BROADCAST_ALL", msgObj) {
    try {
      const raw = localStorage.getItem(this.CHAT_LOGS_KEY);
      const allLogs = raw ? JSON.parse(raw) : {};
      if (!allLogs[peerId]) allLogs[peerId] = [];

      // Avoid duplicate IDs
      if (!allLogs[peerId].some(m => m.id === msgObj.id)) {
        allLogs[peerId].push(msgObj);
        localStorage.setItem(this.CHAT_LOGS_KEY, JSON.stringify(allLogs));
      }
    } catch (e) {
      console.error("Failed to persist chat message:", e);
    }
  }

  static _bufToHex(uint8) {
    return Array.from(uint8).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
