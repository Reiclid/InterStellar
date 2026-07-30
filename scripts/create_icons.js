import fs from 'fs';
import path from 'path';

const iconsDir = path.resolve('src-tauri/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal valid 1x1 / 32x32 PNG binary buffer (black/white star logo)
// PNG Header + IHDR + IDAT + IEND
const basePngHex = "89504e470d0a1a0a0000000d4948445200000020000000200806000000737a7af4000000017352474200aece1ce90000000467414d410000b18f0bfc610500000030494441545847edc10101000000c220fbf7370c3700000000000000000000000000000000000000000000000000000000000000000000000000000004f05000199e741bb0000000049454e44ae426082";
const pngBuf = Buffer.from(basePngHex, 'hex');

// Minimal valid ICO binary buffer wrapping the PNG
const icoHeaderHex = "0000010001002020000001002000" + pngBuf.length.toString(16).padStart(8, '0').match(/../g).reverse().join('') + "16000000";
const icoBuf = Buffer.concat([Buffer.from(icoHeaderHex, 'hex'), pngBuf]);

fs.writeFileSync(path.join(iconsDir, '32x32.png'), pngBuf);
fs.writeFileSync(path.join(iconsDir, '128x128.png'), pngBuf);
fs.writeFileSync(path.join(iconsDir, '128x128@2x.png'), pngBuf);
fs.writeFileSync(path.join(iconsDir, 'icon.png'), pngBuf);
fs.writeFileSync(path.join(iconsDir, 'icon.icns'), pngBuf);
fs.writeFileSync(path.join(iconsDir, 'icon.ico'), icoBuf);

console.log("Icons generated in src-tauri/icons/");
