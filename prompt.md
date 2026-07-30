\# SYSTEM SPECIFICATION & MASTER PROMPT: SECURE MESH MESSENGER WITH ON-DEVICE AI PROFILING

\#\# 1\. PROJECT OVERVIEW & CORE ARCHITECTURE  
Design and implement a cross-platform (Android, iOS, Windows, Linux, macOS) decentralized, ultra-secure mesh messenger with an integrated, sandboxed on-device AI behavioral profiling engine and an automated cryptographically verified update mechanism.

\---

\#\# 2\. USER INTERFACE & DESIGN STACK (TAURI \+ HTML \+ TAILWIND CSS)  
\- \*\*Frontend Framework:\*\* Implementation of HTML5 markup styled with Tailwind CSS utility classes.  
\- \*\*Application Shell:\*\* Utilization of Tauri v2 for cross-platform desktop and mobile distribution.  
\---  
\#\# 2\. CRYPTOGRAPHY & SECURITY ARCHITECTURE  
\- \*\*End-to-End Encryption (E2EE):\*\* Implement the Double Ratchet Algorithm (Signal Protocol) combined with Extended Triple Diffie-Hellman (X3DH) key exchange on Curve25519.  
\- \*\*Symmetric Encryption:\*\* ChaCha20-Poly1305 / AES-256-GCM ensuring Perfect Forward Secrecy (PFS) and Post-Compromise Security.  
\- \*\*Encrypted Local Storage:\*\* Zero-Knowledge architecture using SQLCipher for local databases. Encryption keys must be derived via Argon2id from user master passwords or hardware-backed enclaves (Android KeyStore, iOS Keychain, TPM).  
\- \*\*Metadata Protection:\*\* Fixed-size message padding, anonymous packet headers, and zero central user/contact logging.

\---

\#\# 3\. MULTI-TRANSPORT MESH NETWORKING & OFFLINE COMMUNICATION  
The application must dynamically switch between available communication channels based on connectivity:  
\- \*\*Bluetooth Low Energy (BLE) & Classic:\*\* Background peer discovery via BLE advertisements and direct encrypted packet transmission.  
\- \*\*Wi-Fi Direct & Wi-Fi Aware (NAN):\*\* High-speed peer-to-peer data and voice transmission without routers or internet access.  
\- \*\*Local LAN (mDNS & Multicast UDP):\*\* Auto-discovery and local network transmission over local Wi-Fi or Ethernet networks.  
\- \*\*Acoustic Data Transfer:\*\* Ultrasonic audio modem utilizing microphone and speaker for data transmission in RF-jammed environments.  
\- \*\*Optical Transmission (Animated QR):\*\* Dynamic QR code series and camera scanning for 100% air-gapped data transfer.  
\- \*\*LoRa Radio Support:\*\* Serial/Bluetooth interface for external LoRa radio modules (e.g., Meshtastic) for long-range offline communication.  
\- \*\*Delay-Tolerant Networking (DTN):\*\* Store-and-Forward Gossip Protocol / Epidemic Routing through untrusted intermediate nodes without exposing headers or payload contents.

\---

\#\# 4\. ON-DEVICE AI BEHAVIORAL PROFILING ENGINE  
\- \*\*100% Offline Processing:\*\* The AI module runs in an isolated worker sandbox with zero network permissions (\`Network Permission: Denied\`).  
\- \*\*Linguistic & Behavioral Metrics:\*\*  
  \- \*\*Aggressiveness & Toxicity:\*\* Real-time sentiment, threat level, and emotional tone analysis.  
  \- \*\*Profanity & Obscenity:\*\* Detection of explicit/implicit profanity, obfuscated slang, and masked speech.  
  \- \*\*Stylometry & "Text Calligraphy":\*\* Sentence length, punctuation density, capitalization usage (ALL CAPS), typo frequency, vocabulary richness (Type-Token Ratio TTR).  
  \- \*\*Communication Dynamics:\*\* Response latency, message length distribution, and tone shifting.  
\- \*\*AI Runtime & Quantized Models:\*\* Execution via ONNX Runtime / llama.cpp / ExecuTorch utilizing INT4/INT8 quantized models (e.g., MiniLM, DeBERTa, Qwen2.5-0.5B).  
\- \*\*Biometric Behavioral Defense:\*\* Real-time style matching. If typing patterns drastically change (indicating device theft), automatically lock the app and demand master credentials.

\---

\#\# 5\. ANTI-FORENSICS & HARDENED PROTECTION  
\- \*\*Duress PIN / Panic Button:\*\* Entering a emergency PIN instantly wipes encryption keys and real databases, displaying a clean dummy interface.  
\- \*\*Plausible Deniability & Steganography:\*\* Option to hide encrypted storage containers inside ordinary media files.  
\- \*\*RAM Protection:\*\* Memory zeroing after cryptographic operations, screenshot blocking, and anti-debugging / anti-hooking mechanisms.

\---

\#\# 6\. AUTOMATED SECURE UPDATE MECHANISM (GITHUB INTEGRATION)  
\- \*\*Background Release Monitoring:\*\* Periodically poll the GitHub Releases API for new version tags and commit hashes.  
\- \*\*Cryptographic Verification:\*\* Downloaded update binaries or delta patches MUST be cryptographically verified using Ed25519 public key signatures before execution or prompting the user.  
\- \*\*User Notification:\*\* Display transparent change logs and offer one-click seamless update installation.

\---

\#\# 7\. RECOMMENDED TECH STACK  
\- \*\*Core Engine & Cryptography:\*\* Rust or Go (compiled to native binaries for desktop and mobile).  
\- \*\*User Interface:\*\* Tauri v2 with HTML5 and Tailwind CSS (cross-platform single codebase).  
\- \*\*AI Runtime:\*\* ONNX Runtime / llama.cpp C++ bindings.  
