import zlib
import struct
import binascii
import os

def create_rgba_png(width, height):
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk: color_type=6 (RGBA), bit_depth=8
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = binascii.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT data: RGBA bytes per pixel
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter type 0
        for x in range(width):
            if (width // 4 <= x <= 3 * width // 4) and (height // 4 <= y <= 3 * height // 4):
                raw_data.extend([255, 255, 255, 255]) # Solid White RGBA
            else:
                raw_data.extend([10, 10, 12, 255]) # Dark zinc RGBA
                
    compressed_data = zlib.compress(raw_data)
    idat_crc = binascii.crc32(b'IDAT' + compressed_data)
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = binascii.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_signature + ihdr_chunk + idat_chunk + iend_chunk

icons_dir = os.path.abspath('src-tauri/icons')
os.makedirs(icons_dir, exist_ok=True)

png_32 = create_rgba_png(32, 32)
png_128 = create_rgba_png(128, 128)
png_512 = create_rgba_png(512, 512)

with open(os.path.join(icons_dir, '32x32.png'), 'wb') as f:
    f.write(png_32)
with open(os.path.join(icons_dir, '128x128.png'), 'wb') as f:
    f.write(png_128)
with open(os.path.join(icons_dir, '128x128@2x.png'), 'wb') as f:
    f.write(png_512)
with open(os.path.join(icons_dir, 'icon.png'), 'wb') as f:
    f.write(png_512)
with open(os.path.join(icons_dir, 'icon.icns'), 'wb') as f:
    f.write(png_512)

# ICO header wrapping RGBA PNG
ico_header = struct.pack('<HHH', 0, 1, 1)
ico_entry = struct.pack('<BBBBHHII', 32, 32, 0, 0, 1, 32, len(png_32), 6 + 16)
ico_file = ico_header + ico_entry + png_32

with open(os.path.join(icons_dir, 'icon.ico'), 'wb') as f:
    f.write(ico_file)

print("100% Compliant RGBA PNG and ICO icons created successfully!")
