/**
 * ZERO-KNOWLEDGE ENCRYPTED LOCAL STORAGE (SQLCipher / Vault abstraction)
 * Key derivation via PBKDF2 (100,000 iterations) + AES-GCM-256
 */

export class SecureVault {
  static async deriveMasterKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode(salt || "INTERSTELLAR_SALT_VAL"),
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  static async encryptData(dataObject, masterKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(dataObject));

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      masterKey,
      encoded
    );

    return {
      iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
      vaultData: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('')
    };
  }

  static async decryptData(encryptedPayload, masterKey) {
    const iv = new Uint8Array(encryptedPayload.iv.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const data = new Uint8Array(encryptedPayload.vaultData.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    const decryptedBuf = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      masterKey,
      data
    );

    return JSON.parse(new TextDecoder().decode(decryptedBuf));
  }
}
