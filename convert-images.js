const fs    = require('fs');
const path  = require('path');
const {execSync} = require('child_process');

const globalRoot = execSync('npm root -g').toString().trim();
const sharp = require(path.join(globalRoot, 'sharp'));

const DIRS = [
  'docs/assets/img/personajes',
  'docs/assets/img/mapa/lugares',
  'docs/assets/img/mapa',
  'docs/assets/img/objetos',
  'docs/assets/img/noticias',
  'docs/assets/img/misc',
];
const EXTS = new Set(['.jpg', '.jpeg', '.png']);
const QUALITY = 85;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function tryUnlink(p, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try { fs.unlinkSync(p); return true; } catch (e) {
      if (i < retries - 1) await sleep(600);
    }
  }
  console.warn("  WARN: no s'ha pogut eliminar " + path.basename(p));
  return false;
}

async function convertDir(dir) {
  const fullDir = path.join(__dirname, dir);
  if (!fs.existsSync(fullDir)) return;
  for (const f of fs.readdirSync(fullDir)) {
    const ext = path.extname(f).toLowerCase();
    if (!EXTS.has(ext)) continue;
    const src  = path.join(fullDir, f);
    const dest = path.join(fullDir, f.replace(/\.[^.]+$/, '.webp'));
    if (fs.existsSync(dest)) { await tryUnlink(src); continue; }
    const before = fs.statSync(src).size;
    try {
      await sharp(src).webp({ quality: QUALITY }).toFile(dest);
    } catch (e) {
      console.warn('  ERROR convertint ' + f + ': ' + e.message);
      continue;
    }
    const after = fs.statSync(dest).size;
    const pct = Math.round((1 - after / before) * 100);
    console.log(pct + '%  ' + (before/1024).toFixed(0) + 'KB -> ' + (after/1024).toFixed(0) + 'KB  ' + f);
    await tryUnlink(src);
  }
}

(async () => {
  for (const dir of DIRS) await convertDir(dir);

  let totalAfter = 0;
  const remaining = [];
  for (const dir of DIRS) {
    const fullDir = path.join(__dirname, dir);
    if (!fs.existsSync(fullDir)) continue;
    for (const f of fs.readdirSync(fullDir)) {
      const ext = path.extname(f).toLowerCase();
      if (ext === '.webp') totalAfter += fs.statSync(path.join(fullDir, f)).size;
      if (EXTS.has(ext)) remaining.push(f);
    }
  }
  console.log('\nWebP total: ' + (totalAfter/1024/1024).toFixed(1) + 'MB');
  if (remaining.length) console.log('Originals NO eliminats: ' + remaining.join(', '));
  else console.log('Tots els originals eliminats correctament.');
})();