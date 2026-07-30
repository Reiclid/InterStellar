/**
 * OPTICAL AIR-GAPPED TRANSMISSION (ANIMATED QR STREAM)
 * Encodes encrypted payloads into sequence frames rendered dynamically on canvas
 */

export class OpticalQrStream {
  /**
   * Split message into chunk frames formatted as JSON metadata
   */
  static generateFrames(payloadString, chunkSize = 40) {
    const totalChunks = Math.ceil(payloadString.length / chunkSize);
    const frames = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunk = payloadString.substring(i * chunkSize, (i + 1) * chunkSize);
      frames.push({
        seq: i + 1,
        total: totalChunks,
        data: chunk,
        hash: this._simpleHash(chunk)
      });
    }

    return frames;
  }

  /**
   * Render a monochrome matrix pattern onto a canvas element
   */
  static renderFrameMatrix(canvas, frameObj) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background (white/black monochrome border)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#000000";
    ctx.fillRect(10, 10, width - 20, height - 20);

    // Draw alignment squares (QR pattern mock)
    this._drawCornerSquare(ctx, 16, 16);
    this._drawCornerSquare(ctx, width - 48, 16);
    this._drawCornerSquare(ctx, 16, height - 48);

    // Render binary grid matrix representing packet payload
    const str = JSON.stringify(frameObj);
    const gridSize = 16;
    const cellSize = Math.floor((width - 60) / gridSize);

    let charIdx = 0;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Skip corner alignment boxes
        if ((row < 4 && col < 4) || (row < 4 && col > gridSize - 5) || (row > gridSize - 5 && col < 4)) continue;

        const charCode = str.charCodeAt(charIdx % str.length);
        const bit = (charCode + row * col + frameObj.seq) % 2;
        ctx.fillStyle = bit === 1 ? "#ffffff" : "#18181b";
        ctx.fillRect(30 + col * cellSize, 30 + row * cellSize, cellSize - 1, cellSize - 1);

        charIdx++;
      }
    }

    // Render header frame text below
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillText(`FRAME ${frameObj.seq}/${frameObj.total} | TX: ${frameObj.hash}`, 24, height - 14);
  }

  static _drawCornerSquare(ctx, x, y) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, 32, 32);
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 4, y + 4, 24, 24);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 8, 16, 16);
  }

  static _simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(6, '0');
  }
}
