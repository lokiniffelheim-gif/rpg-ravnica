/**
 * Build script: split src/index.html en dos blocs:
 *   1. <script> plain JS (utils, constants) — no processa Babel
 *   2. <script type="text/babel"> JSX components — Babel processa ~50% menys codi
 *
 * Ús: node build.js [--watch]
 */
const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, 'src/index.html');
const DEST = path.join(__dirname, 'docs/index.html');

// Punt de tall: primer component React que usa JSX
const SPLIT_MARKER = '\nfunction PersonajesTagSel(';

function build() {
  const src = fs.readFileSync(SRC, 'utf8');

  const babelOpen  = '<script type="text/babel" charset="UTF-8">';
  const babelClose = '</script>';
  const startTag   = src.indexOf(babelOpen);
  if (startTag < 0) { console.error('No s\'ha trobat el bloc type="text/babel"'); return; }
  const codeStart  = startTag + babelOpen.length;
  const codeEnd    = src.indexOf(babelClose, codeStart);

  const babelCode  = src.slice(codeStart, codeEnd);
  const splitIdx   = babelCode.indexOf(SPLIT_MARKER);
  if (splitIdx < 0) { console.error('No s\'ha trobat el marcador de tall:', SPLIT_MARKER); return; }

  const plainPart  = babelCode.slice(0, splitIdx);
  const jsxPart    = babelCode.slice(splitIdx);

  const newBlock = `<script>${plainPart}</script>\n${babelOpen}${jsxPart}`;
  const out = src.slice(0, startTag) + newBlock + src.slice(codeEnd);

  fs.writeFileSync(DEST, out, 'utf8');

  const srcKB   = (Buffer.byteLength(src,  'utf8') / 1024).toFixed(1);
  const plainKB = (Buffer.byteLength(plainPart, 'utf8') / 1024).toFixed(1);
  const jsxKB   = (Buffer.byteLength(jsxPart,   'utf8') / 1024).toFixed(1);
  console.log(`Build OK  src=${srcKB}KB  plain=${plainKB}KB  babel=${jsxKB}KB  (${Math.round((1-jsxPart.length/babelCode.length)*100)}% menys Babel)`);
}

function buildManifest() {
  const sesDir = path.join(__dirname, 'docs/assets/data/sesiones');
  if (!fs.existsSync(sesDir)) return;
  const acts = fs.readdirSync(sesDir)
    .filter(d => fs.statSync(path.join(sesDir, d)).isDirectory())
    .sort()
    .map(nom => {
      const infoPath = path.join(sesDir, nom, 'info.md');
      let gremi = 'Guildless';
      if (fs.existsSync(infoPath)) {
        const m = fs.readFileSync(infoPath, 'utf8').match(/^---\s*[\r\n]+gremi:\s*(.+?)[\r\n]+---/);
        if (m) gremi = m[1].trim();
      }
      const IGNORE = /^(desktop\.ini|\.DS_Store|thumbs\.db|\.gitkeep)$/i;
      const fitxers = fs.readdirSync(path.join(sesDir, nom))
        .filter(f => !fs.statSync(path.join(sesDir, nom, f)).isDirectory() && !IGNORE.test(f))
        .sort();
      return { nom, gremi, fitxers };
    });
  fs.writeFileSync(path.join(sesDir, 'manifest.json'), JSON.stringify(acts, null, 2), 'utf8');
  console.log(`Manifest: ${acts.length} actes`);
}

build();
buildManifest();

if (process.argv.includes('--watch')) {
  console.log('Watching', SRC, '...');
  fs.watchFile(SRC, { interval: 500 }, () => { console.log('Canvi detectat, reconstruint...'); build(); });
}
