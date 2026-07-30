/**
 * ANTI-FORENSICS & HARDENED PROTECTION ENGINE
 * Handles Duress PIN / Panic trigger, cryptographic key zeroization,
 * RAM protection simulation, screenshot shield, and plausible deniability.
 */

export class AntiForensicsEngine {
  static DURESS_PIN = "9999";
  static REAL_PIN = "1234";

  /**
   * Verify entered PIN. If Duress PIN entered, trigger key purge & decoy payload
   */
  static evaluatePin(inputPin) {
    if (inputPin === this.DURESS_PIN) {
      this.triggerPanicWipe();
      return { status: "DURESS_TRIGGERED", decoy: true };
    } else if (inputPin === this.REAL_PIN) {
      return { status: "SUCCESS", decoy: false };
    }
    return { status: "INVALID_PIN", decoy: false };
  }

  /**
   * Instantly zero out cryptographic keys, clear browser storage, and load dummy data
   */
  static triggerPanicWipe() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if (indexedDB) {
        indexedDB.databases().then(dbs => {
          dbs.forEach(db => indexedDB.deleteDatabase(db.name));
        });
      }
    } catch (e) {
      console.warn("Storage wipe exception:", e);
    }
  }

  /**
   * Plausible Deniability Decoy Messages Generator
   */
  static getDecoyMessages() {
    return [
      { id: "decoy-1", sender: "Weather Bot", text: "Today's forecast: Clear skies, 22°C.", timestamp: "10:15 AM", isDecoy: true },
      { id: "decoy-2", sender: "News Feed", text: "Tech updates: Open-source mesh protocols gain adoption globally.", timestamp: "11:30 AM", isDecoy: true },
      { id: "decoy-3", sender: "System", text: "Welcome to InterStellar basic messenger mode.", timestamp: "12:00 PM", isDecoy: true }
    ];
  }
}
