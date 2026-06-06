// Genera docs/favicon.ico encapsulant icon.png en format ICO Vista (PNG embedded)
const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, 'docs/assets/img/icon.png');
const icoPath = path.join(__dirname, 'docs/favicon.ico');

const pngData = fs.readFileSync(pngPath);

// Capçalera ICO (6 bytes)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);  // Reserved
header.writeUInt16LE(1, 2);  // Type: 1 = ICO
header.writeUInt16LE(1, 4);  // Count: 1 imatge

// Entrada de directori (16 bytes)
// Width/Height = 0 significa 256; per imatges >256 els navegadors llegeixen el header PNG
const entry = Buffer.alloc(16);
entry.writeUInt8(0, 0);                      // Width (0 = 256+)
entry.writeUInt8(0, 1);                      // Height (0 = 256+)
entry.writeUInt8(0, 2);                      // ColorCount
entry.writeUInt8(0, 3);                      // Reserved
entry.writeUInt16LE(1, 4);                   // Planes
entry.writeUInt16LE(32, 6);                  // BitCount
entry.writeUInt32LE(pngData.length, 8);      // BytesInRes
entry.writeUInt32LE(22, 12);                 // ImageOffset (6 + 16 = 22)

const ico = Buffer.concat([header, entry, pngData]);
fs.writeFileSync(icoPath, ico);
console.log(`favicon.ico generat: ${ico.length} bytes → ${icoPath}`);
