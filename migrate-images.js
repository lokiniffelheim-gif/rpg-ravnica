/**
 * migrate-images.js
 * One-time migration: renombra els fitxers d'imatge de nom-based a id-based,
 * i actualitza Firebase amb els nous paths.
 *
 * Ús: node migrate-images.js
 */
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const API_KEY  = 'AIzaSyAXqDBZ0HDgFpfsO-2F9VOnmtf8RzL3UiI';
const PROJECT  = 'app-ravnica';
const FS_BASE  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/ravnica`;
const IMG_DIR  = path.join(__dirname, 'docs/assets/img');
const GH_BASE  = 'assets/img/';

// Maps nom -> path relatiu (sense GH_BASE)
const IMG_CHARS = {
  "Ezzio Salvatore":"personajes/Ezzio Salvatore.jpg","Wundyr Somo":"personajes/Wundyr Somo.jpg","Wundyr Somo (Torito)":"personajes/Wundyr Somo.jpg","Yarog (HorseLuis)":"personajes/Yarog (HorseLuis).jpg",
  "Manjatan":"personajes/Manjatan.jpg","Svikull Rusl":"personajes/Svikull Rusl.jpg","Marchena":"personajes/Marchena.jpg","Kasz":"personajes/Kasz.jpg",
  "El Vocero":"personajes/El Vocero.jpg","Pesha la Tabernera":"personajes/Pesha la Tabernera.jpg","Kotyali la Cazadora":"personajes/Kotyali la Cazadora.jpg",
  "Shazel Bara, Chaman del clan":"personajes/Shazel Bara, Chaman del clan.jpg","Obez el Prestamista":"personajes/Obez el Prestamista.jpg",
  "Iván el Cocinero":"personajes/Iván el Cocinero.jpg","Grukurg el Tintador":"personajes/Grukurg el Tintador.jpg","Ten el Pescadero":"personajes/Ten el Pescadero.jpg",
  "Morai la Capataz":"personajes/Morai la Capataz.jpg","Cresh el Vendedor de Comida Ambulante":"personajes/Cresh el Vendedor de Comida Ambulante.jpg",
  "Elon Tusk el Mercader de grano":"personajes/Elon Tusk el Mercader de grano.jpg","Dhalya Macav la Comerciante":"personajes/Dhalya Macav la Comerciante.jpg",
  "Maeve la Carterista":"personajes/Maeve la Carterista.jpg","Sila, Tribuno de la Legión":"personajes/Sila, Tribuno de la Legión.jpg",
  "Arkady el Alborotador":"personajes/Arkady el Alborotador.jpg","Ikram la Contrabandista":"personajes/Ikram la Contrabandista.png",
  "Bookworm el Consigliere":"personajes/Bookworm el Consigliere.jpg","Kakí Skýla, Lugarteniente del Enjambre Ochran":"personajes/Kakí Skýla, Lugarteniente del Enjambre Ochran.png",
  "Tajic, Espada de la Legión":"personajes/Tajic, Espada de la Legión.jpg","Sargento Instructor Gough":"personajes/Sargento Instructor Gough.jpg",
  "Informante Secreto":"personajes/Informante Secreto.jpg","Mecenas misterioso":"personajes/Mecenas misterioso.jpg",
  "Emeritus Tobias Forge":"personajes/Emeritus Tobias Forge.jpg","Ministrant Tobias Forge":"personajes/Emeritus Tobias Forge.jpg","Glenn Danzing, Sicario del Sindicato":"personajes/Glenn Danzing, Sicario del Sindicato.jpg",
  "Padre Messiah Marcolin":"personajes/Padre Messiah Marcolin.jpg","Niv-Mizzet, el Dracogenio":"personajes/Niv-Mizzet, el Dracogenio.jpg",
  "Sestri, Degana del Laboratorio de Tormentas y Electricidad":"personajes/Sestri, Degana del Laboratorio de Tormentas y Electricidad.jpg",
  "Coldie, Genio Inestable":"personajes/Coldie, Genio Inestable.png","Rotxar, Cultista Tatuador":"personajes/Rotxar, Cultista Tatuador.png",
  "Tai On, Justicar del Senado":"personajes/Tai On, Justicar del Senado.jpg","Randall, Comunero Pacifista":"personajes/Randall, Comunero Pacifista.jpg",
  "Khatnas, Juez de Asuntos Internos":"personajes/Khatnas, Juez de Asuntos Internos.jpg","Nebum Gerava, Arbites del Senado":"personajes/Nebum Gerava, Arbites del Senado.jpg",
  "Gasz, Matón de la Calle de Hojalata":"personajes/Gasz, Matón de la Calle de Hojalata.jpg","Luda Manson, Productora y Cazatalentos":"personajes/Luda Manson, Productora y Cazatalentos.png",
  "Drekk, revolucionario desencantado":"personajes/Drekk, revolucionario desencantado.png","Mira, la de correos":"personajes/Mira, la de correos.png",
  "Ylldiane, Intendente Mayor":"personajes/Ylldiane, Intendente Mayor.jpg","Ayudantes de laboratorio Izzet":"personajes/Ayudantes de laboratorio Izzet.jpg",
  "Reclutas Azorius":"personajes/Reclutas Azorius.png","Giagia, Ama de llaves del Hogar Ancestral Dalverjar":"personajes/Giagia, Ama de llaves del Hogar Ancestral Dalverjar.jpg",
  "Escuadrón Boros":"personajes/Escuadrón Boros.jpg","Anarquistas Gruul":"personajes/Anarquistas Gruul.jpg",
  "Troupe Rakdos":"personajes/Troupe Rakdos.jpg","André el Herrero":"personajes/André el Herrero.jpg",
  "Alysa la Sastre":"personajes/Alysa la Sastre.jpg","Albert Camus de la Oficina del Banco":"personajes/Albert Camus de la Oficina del Banco.jpg",
  "Aiker Bosset":"personajes/Aiker Bosset.png","Los fieles seguidores del Maestro, el Evolucionador de hombres":"personajes/Los fieles seguidores del Maestro, el Evolucionador de hombres.jpg",
  "Trisz, Legionario Caido (Fallecido)":"personajes/Trisz, Legionario Caido (Fallecido).jpg","Pandora, Espíritu Servicial":"personajes/Pandora, Espíritu Servicial.webp",
  "Goblin Moñeco":"personajes/Goblin Moñeco.jpg","Lyzaxa":"personajes/Lyzaxa.jpg","Sinrostro":"personajes/Sinrostro.jpg",
  "Rezana, Médico Azorius":"personajes/Rezana, Médico Azorius.jpg","Aurelio, Líder del Clan":"personajes/Aurelio, Líder del Clan.jpg",
  "Nullan, Xofer de Ezzio":"personajes/Nullan, Xofer de Ezzio.png",
};
const IMG_EDIFICIS = {
  "Oficina Capilla Azorius":"Aventino/Oficina Capilla Azorius.jpg","Médico Azorius":"Aventino/Médico Azorius.jpg",
  "Recaudador de Impuestos Azorius":"Aventino/Recaudador de Impuestos Azorius.jpg","Ayuntamiento Azorius":"Aventino/Ayuntamiento Azorius.jpg",
  "Comisaría Boros":"Aventino/Comisaría Boros.jpg","Forja Boros":"Aventino/Forja Boros.jpg","Barracones Boros":"Aventino/Barracones Boros.jpg",
  "Calabozos Boros":"Aventino/Calabozos Boros.jpg","Callejuelas":"Aventino/Callejuelas.jpg",
  "Sastrería":"Aventino/Sastrería.jpg","Sastre":"Aventino/Sastrería.jpg",
  "Campamento Gruul":"Aventino/Campamento Gruul.jpg","Cloacas Golgari":"Aventino/Cloacas Golgari.jpg","Alcantarillado subterráneo Golgari":"Aventino/Cloacas Golgari.jpg",
  "Herbolario":"Aventino/Herbolario.jpg","Casa Solar":"Aventino/Casa Solar.jpg","Yermos Rojos":"Aventino/Yermos Rojos.jpg",
  "Casa del prestamista Ozhov":"Aventino/Casa del prestamista Ozhov.jpg","Nivix, el Nido del Mente ígnea":"Aventino/Nivix, el Nido del Mente ígnea.jpg",
  "Taberna el Cuerno de oro":"Aventino/Taberna el Cuerno de oro.jpg","Tienda del shamán Gruul":"Aventino/Tienda del shamán Gruul.jpg",
  "Oficina de correo":"Aventino/Oficina de correo.jpg",
  "Sede Sindical Orzhov del Cuarto Precinto":"Aventino/Sede Sindical Orzhov del Cuarto Precinto.png",
  "Orfanato de Santa Alisande":"Aventino/Orfanato de Santa Alisande.png",
  "Misión de la Armonía Compartida":"Aventino/Misión de la Armonía Compartida.png","Misión de la Armonía Compartida Selesnya":"Aventino/Misión de la Armonía Compartida.png",
};
const IMG_HANDOUTS = {
  "3x Poción de Heroísmo (+3)":"misc/3x Poción de Heroísmo (+3).jpg",
  "Amuleto contra Detección y Localización":"misc/Amuleto contra Detección y Localización.jpg",
  "Aparato de Mizzium":"misc/Aparato de Mizzium.jpg","Bandera Trofeo del Basilisco":"misc/Bandera Trofeo del Basilisco.jpg",
  "Baraja de Ilusiones":"misc/Baraja de Ilusiones.jpg","Bolsa de Contención":"misc/Bolsa de Contención.jpeg",
  "Correo Misterioso":"misc/Correo Misterioso.jpeg","Deposito común en el Santísimo Banco Sindical Orzhov":"misc/Deposito común en el Santísimo Banco Sindical Orzhov.jpg",
  "Escudo Centinela":"misc/Escudo Centinela.jpg","Espada de la Venganza":"misc/Espada de la Venganza.png",
  "Gema de Resplandor":"misc/Gema de Resplandor.jpg","Guantelete de Fuerza de Ogro":"misc/Guantelete de Fuerza de Ogro.jpg",
  "Par de Pistolas Ballesta Crueles":"misc/Par de Pistolas Ballesta Crueles.jpg",
  "Pergamino Mágico - Nube de Dagas":"misc/Pergamino Mágico - Nube de Dagas.jpg",
};

// Determina el subfolder per a cada key de Firebase
const KEY_INFO = {
  chars:    { imgKey: 'avatar',       map: IMG_CHARS,    folder: 'personajes' },
  handouts: { imgKey: 'img',          map: IMG_HANDOUTS, folder: 'misc' },
  edificis: { imgKey: 'avatarCustom', map: IMG_EDIFICIS, folder: null }, // folder depen del map
};

function normStr(s){ return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim(); }

function findSrcPath(nom, map) {
  // Cerca exacta primer
  const rel = map[nom];
  if (rel) return rel;
  // Cerca normalitzada
  const normNom = normStr(nom);
  for (const [k, v] of Object.entries(map)) {
    if (normStr(k) === normNom) return v;
  }
  return null;
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function httpsPatch(url, body) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body, 'utf8');
    const opts = new URL(url);
    const req = https.request({
      hostname: opts.hostname, path: opts.pathname + opts.search,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Content-Length': buf.length }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

async function fetchCollection(key) {
  const url = `${FS_BASE}/${key}?key=${API_KEY}`;
  const raw = await httpsGet(url);
  const doc = JSON.parse(raw);
  if (!doc.fields || !doc.fields.data) throw new Error(`No data field for ${key}. Raw: ${raw.slice(0,200)}`);
  return JSON.parse(doc.fields.data.stringValue);
}

async function saveCollection(key, records) {
  const url = `${FS_BASE}/${key}?key=${API_KEY}&updateMask.fieldPaths=data`;
  const body = JSON.stringify({ fields: { data: { stringValue: JSON.stringify(records) } } });
  const res = await httpsPatch(url, body);
  const parsed = JSON.parse(res);
  if (parsed.error) throw new Error(JSON.stringify(parsed.error));
  return parsed;
}

function getExt(relPath) { return path.extname(relPath) || '.jpg'; }

function migrateRecord(rec, imgKey, map) {
  const id = rec.id;
  if (!id) return { rec, changed: false, msg: 'no id' };

  // Determina el path d'origen
  const storedRaw = rec[imgKey] || '';
  // Treu el GH_BASE si hi és
  const storedRel = storedRaw.startsWith(GH_BASE) ? storedRaw.slice(GH_BASE.length) : storedRaw;

  // Si ja és per ID (nom del fitxer = id), no fer res
  const storedBasename = path.basename(storedRel, path.extname(storedRel));
  if (storedBasename === id) return { rec, changed: false, msg: 'ja migrat' };

  // Troba el fitxer font
  let srcRel = null;
  if (storedRel && fs.existsSync(path.join(IMG_DIR, storedRel))) {
    srcRel = storedRel;
  } else {
    srcRel = findSrcPath(rec.nom, map);
  }

  if (!srcRel) return { rec, changed: false, msg: 'sense imatge' };

  const srcAbs = path.join(IMG_DIR, srcRel);
  if (!fs.existsSync(srcAbs)) return { rec, changed: false, msg: `fitxer no trobat: ${srcRel}` };

  // Calcula la destinació
  const ext = getExt(srcRel);
  const folder = path.dirname(srcRel); // personajes / Aventino / misc
  const dstRel = `${folder}/${id}${ext}`;
  const dstAbs = path.join(IMG_DIR, dstRel);

  // Copia (no esborra l'original per seguretat)
  fs.copyFileSync(srcAbs, dstAbs);

  const newRec = { ...rec, [imgKey]: GH_BASE + dstRel };
  return { rec: newRec, changed: true, msg: `${srcRel} -> ${dstRel}` };
}

async function main() {
  console.log('=== Migració d\'imatges per ID ===\n');
  let totalChanged = 0;

  for (const [key, { imgKey, map }] of Object.entries(KEY_INFO)) {
    console.log(`\n--- ${key.toUpperCase()} (${imgKey}) ---`);
    let records;
    try {
      records = await fetchCollection(key);
    } catch(e) {
      console.error(`  ERROR llegint ${key}:`, e.message);
      continue;
    }
    console.log(`  ${records.length} registres llegits`);

    let changed = 0;
    const updated = records.map(rec => {
      const { rec: newRec, changed: didChange, msg } = migrateRecord(rec, imgKey, map);
      if (didChange) { changed++; console.log(`  ✓ ${rec.nom}: ${msg}`); }
      else if (msg !== 'sense imatge' && msg !== 'ja migrat') { console.log(`  - ${rec.nom}: ${msg}`); }
      return newRec;
    });

    if (changed > 0) {
      console.log(`  Desant ${changed} canvis a Firebase...`);
      try {
        await saveCollection(key, updated);
        console.log(`  ✓ Firebase actualitzat`);
        totalChanged += changed;
      } catch(e) {
        console.error(`  ERROR desant ${key}:`, e.message);
      }
    } else {
      console.log(`  Res a canviar`);
    }
  }

  console.log(`\n=== Fet. ${totalChanged} fitxers migrats. ===`);
  console.log('Els fitxers originals NO s\'han esborrat (fes-ho manualment si tot va bé).');
}

main().catch(e => { console.error('Error fatal:', e); process.exit(1); });
