/**
 * ACOUSTIC ULTRASONIC AUDIO MODEM
 * Transmits & receives data packets over ultrasonic audio frequencies (18kHz - 20kHz)
 * for RF-jammed / air-gapped emergency environments.
 */

export class AcousticModem {
  constructor() {
    this.audioCtx = null;
    this.isTransmitting = false;
    this.isListening = false;
    this.freq0 = 18500; // Binary 0 frequency (Hz)
    this.freq1 = 19500; // Binary 1 frequency (Hz)
    this.symbolDurationMs = 40; // Pulse duration (ms)
    this.listeners = [];
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Transmit binary payload as FSK ultrasonic audio pulses
   */
  async transmitPayload(payloadText, onProgress) {
    this.initAudio();
    this.isTransmitting = true;

    const binaryStr = payloadText.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    const totalBits = binaryStr.length;

    for (let i = 0; i < totalBits; i++) {
      if (!this.isTransmitting) break;
      const bit = binaryStr[i];
      const freq = bit === '1' ? this.freq1 : this.freq0;

      await this._playTone(freq, this.symbolDurationMs);
      if (onProgress) onProgress((i + 1) / totalBits * 100);
    }

    this.isTransmitting = false;
  }

  stopTransmit() {
    this.isTransmitting = false;
  }

  /**
   * Start listening via microphone FFT analysis for ultrasonic pulses
   */
  async startListen(onDetectedText) {
    this.initAudio();
    this.isListening = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioCtx.createMediaStreamSource(stream);
      const analyser = this.audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let receivedBits = "";
      let lastDetectedBit = null;
      let holdCount = 0;

      const processAudio = () => {
        if (!this.isListening) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        analyser.getByteFrequencyData(dataArray);

        // Calculate FFT bin indices for 18.5kHz and 19.5kHz
        const sampleRate = this.audioCtx.sampleRate;
        const bin0 = Math.round(this.freq0 / (sampleRate / 2) * bufferLength);
        const bin1 = Math.round(this.freq1 / (sampleRate / 2) * bufferLength);

        const amp0 = dataArray[bin0] || 0;
        const amp1 = dataArray[bin1] || 0;

        const threshold = 40;

        if (amp1 > threshold && amp1 > amp0 + 15) {
          if (lastDetectedBit !== '1' || holdCount > 2) {
            receivedBits += '1';
            lastDetectedBit = '1';
            holdCount = 0;
          } else {
            holdCount++;
          }
        } else if (amp0 > threshold && amp0 > amp1 + 15) {
          if (lastDetectedBit !== '0' || holdCount > 2) {
            receivedBits += '0';
            lastDetectedBit = '0';
            holdCount = 0;
          } else {
            holdCount++;
          }
        }

        if (receivedBits.length % 8 === 0 && receivedBits.length > 0) {
          const decoded = this._binaryToString(receivedBits);
          if (onDetectedText) onDetectedText(decoded, receivedBits.length);
        }

        requestAnimationFrame(processAudio);
      };

      processAudio();

    } catch (err) {
      console.warn("Acoustic microphone access denied/unavailable:", err);
      this.isListening = false;
    }
  }

  stopListen() {
    this.isListening = false;
  }

  _playTone(frequency, durationMs) {
    return new Promise(resolve => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + (durationMs / 1000));

      setTimeout(resolve, durationMs);
    });
  }

  _binaryToString(binary) {
    let str = "";
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substr(i, 8);
      if (byte.length === 8) {
        const charCode = parseInt(byte, 2);
        if (charCode >= 32 && charCode <= 126) {
          str += String.fromCharCode(charCode);
        }
      }
    }
    return str;
  }
}
