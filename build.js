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

function getGitHash() {
  try { return require('child_process').execSync('git rev-parse --short HEAD').toString().trim(); } catch(e) { return ''; }
}

function build() {
  let src = fs.readFileSync(SRC, 'utf8');

  // Injecta el git hash a la constant BUILD_HASH
  const hash = getGitHash();
  src = src.replace(/const BUILD_HASH="[^"]*"/, `const BUILD_HASH="${hash}"`);

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

function romanToInt(s) {
  const vals = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  return [...s.toUpperCase()].reduce((acc,c,i,a)=>{
    const v=vals[c]||0, next=vals[a[i+1]]||0;
    return acc + (v < next ? -v : v);
  }, 0);
}
function actOrder(nom) {
  const m = nom.match(/^Acto\s+([IVXLCDM]+)\s*-/i);
  return m ? romanToInt(m[1]) : 999;
}

function buildManifest() {
  const sesDir = path.join(__dirname, 'docs/assets/data/sesiones');
  if (!fs.existsSync(sesDir)) return;
  const IGNORE = /^(desktop\.ini|\.DS_Store|thumbs\.db|\.gitkeep|info\.md)$/i;
  const acts = fs.readdirSync(sesDir)
    .filter(d => fs.statSync(path.join(sesDir, d)).isDirectory())
    .sort((a, b) => actOrder(a) - actOrder(b))
    .map(nom => {
      const infoPath = path.join(sesDir, nom, 'info.md');
      let gremi = 'Guildless';
      if (fs.existsSync(infoPath)) {
        const m = fs.readFileSync(infoPath, 'utf8').match(/^---\s*[\r\n]+gremi:\s*(.+?)[\r\n]+---/);
        if (m) gremi = m[1].trim();
      }
      const fitxers = fs.readdirSync(path.join(sesDir, nom))
        .filter(f => !fs.statSync(path.join(sesDir, nom, f)).isDirectory() && !IGNORE.test(f))
        .sort();
      return { nom, gremi, fitxers };
    });
  fs.writeFileSync(path.join(sesDir, 'manifest.json'), JSON.stringify(acts, null, 2), 'utf8');
  console.log(`Manifest: ${acts.length} actes`);
}

function buildImgIndex() {
  const DIRS = {
    chars:    path.join(__dirname, 'docs/assets/img/personajes'),
    edificis: path.join(__dirname, 'docs/assets/img/mapa/lugares'),
    handouts: path.join(__dirname, 'docs/assets/img/objetos'),
  };
  const PREFIXES = {
    chars:    'assets/img/personajes/',
    edificis: 'assets/img/mapa/lugares/',
    handouts: 'assets/img/objetos/',
  };
  const IGNORE = /^(desktop\.ini|\.DS_Store|thumbs\.db|\.gitkeep)$/i;

  const index = {};
  for (const [key, dir] of Object.entries(DIRS)) {
    index[key] = {};
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (IGNORE.test(f)) continue;
      const key2 = f.replace(/\.[^.]+$/, '');
      index[key][key2] = PREFIXES[key] + f;
    }
  }

  // Carousel Aventino Times: aventino-times_{acto}.{sessio}.ext — ordena numèricament
  const aventinoDir = path.join(__dirname, 'docs/assets/img/noticias');
  const aventinoPrefix = 'assets/img/noticias/';
  index.aventino = [];
  if (fs.existsSync(aventinoDir)) {
    const aventinoFiles = fs.readdirSync(aventinoDir)
      .filter(f => !IGNORE.test(f))
      .map(f => {
        const m = f.match(/^aventino-times_(\d+)\.(\d+)\.[^.]+$/);
        if (!m) return null;
        return { file: f, acto: parseInt(m[1],10), sessio: parseInt(m[2],10), path: aventinoPrefix + f };
      })
      .filter(Boolean)
      .sort((a,b) => a.acto !== b.acto ? a.acto - b.acto : a.sessio - b.sessio);
    index.aventino = aventinoFiles.map(x => ({ acto: x.acto, sessio: x.sessio, path: x.path }));
  }

  const dest = path.join(__dirname, 'docs/assets/data/img-index.json');
  fs.writeFileSync(dest, JSON.stringify(index), 'utf8');
  const total = Object.values(index).reduce((s,o)=>s+(Array.isArray(o)?o.length:Object.keys(o).length), 0);
  console.log(`Img index: ${total} imatges (chars:${Object.keys(index.chars).length} edificis:${Object.keys(index.edificis).length} handouts:${Object.keys(index.handouts).length} aventino:${index.aventino.length})`);
}

build();
buildManifest();
buildImgIndex();

if (process.argv.includes('--watch')) {
  console.log('Watching', SRC, '...');
  fs.watchFile(SRC, { interval: 500 }, () => { console.log('Canvi detectat, reconstruint...'); build(); });
}
