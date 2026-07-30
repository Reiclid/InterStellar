/**
 * STEGANOGRAPHY ENGINE
 * Hides/Extracts encrypted binary messages inside image pixel LSBs
 */

export class SteganographyEngine {
  /**
   * Embed secret message text into Canvas ImageData
   */
  static embedMessage(canvas, secretText) {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Header prefix for detection
    const fullMessage = `[INTSTLR]${secretText}[/INTSTLR]`;
    const binary = this._stringToBinary(fullMessage);

    if (binary.length > data.length / 4) {
      throw new Error(`Message too large for image size. Max bits: ${data.length / 4}, required: ${binary.length}`);
    }

    // Embed each bit into the LSB of the Red channel
    for (let i = 0; i < binary.length; i++) {
      const pixelIndex = i * 4; // Red channel
      const bit = parseInt(binary[i], 10);
      data[pixelIndex] = (data[pixelIndex] & 0xFE) | bit;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL("image/png");
  }

  /**
   * Extract secret message text from Canvas ImageData
   */
  static extractMessage(canvas) {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let binary = "";
    for (let i = 0; i < data.length; i += 4) {
      const bit = data[i] & 1;
      binary += bit;
    }

    const rawText = this._binaryToString(binary);
    const match = rawText.match(/\[INTSTLR\]([\s\S]*?)\[\/INTSTLR\]/);
    
    if (match && match[1]) {
      return { success: true, secret: match[1] };
    }
    return { success: false, error: "No hidden InterStellar payload detected in image." };
  }

  static _stringToBinary(str) {
    return str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
  }

  static _binaryToString(binary) {
    let str = "";
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substr(i, 8);
      if (byte.length === 8) {
        str += String.fromCharCode(parseInt(byte, 2));
      }
    }
    return str;
  }
}
