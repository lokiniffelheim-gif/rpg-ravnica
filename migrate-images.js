/**
 * migrate-images.js
 * Renombra fitxers d'imatge de nom-based a id-based ({id}.ext).
 *
 * Ús:
 *   node migrate-images.js img-export.json
 *
 * img-export.json: fitxer descarregat des del boto "Exportar per migrar"
 * del panell DM a l'app. Conté {chars:[...], handouts:[...], edificis:[...]}.
 * Despres d'executar, els fitxers originals NO s'esborren (fer-ho manualment).
 * Puja els canvis: git add docs/assets/img && git commit && git push
 */
const fs   = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'docs/assets/img');
const GH_BASE = 'assets/img/';

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
  "Emeritus Tobias Forge":"personajes/Emeritus Tobias Forge.jpg","Ministrant Tobias Forge":"personajes/Emeritus Tobias Forge.jpg",
  "Glenn Danzing, Sicario del Sindicato":"personajes/Glenn Danzing, Sicario del Sindicato.jpg",
  "Padre Messiah Marcolin":"personajes/Padre Messiah Marcolin.jpg","Niv-Mizzet, el Dracogenio":"personajes/Niv-Mizzet, el Dracogenio.jpg",
  "Sestri, Degana del Laboratorio de Tormentas y Electricidad":"personajes/Sestri, Degana del Laboratorio de Tormentas y Electricidad.jpg",
  "Coldie, Genio Inestable":"personajes/Coldie, Genio Inestable.png","Rotxar, Cultista Tatuador":"personajes/Rotxar, Cultista Tatuador.png",
  "Tai On, Justicar del Senado":"personajes/Tai On, Justicar del Senado.jpg","Randall, Comunero Pacifista":"personajes/Randall, Comunero Pacifista.jpg",
  "Khatnas, Juez de Asuntos Internos":"personajes/Khatnas, Juez de Asuntos Internos.jpg","Nebum Gerava, Arbites del Senado":"personajes/Nebum Gerava, Arbites del Senado.jpg",
  "Gasz, Matón de la Calle de Hojalata":"personajes/Gasz, Matón de la Calle de Hojalata.jpg",
  "Luda Manson, Productora y Cazatalentos":"personajes/Luda Manson, Productora y Cazatalentos.png",
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

const KEY_INFO = {
  chars:    { imgKey: 'avatar',       map: IMG_CHARS    },
  handouts: { imgKey: 'img',          map: IMG_HANDOUTS },
  edificis: { imgKey: 'avatarCustom', map: IMG_EDIFICIS },
};

function normStr(s){ return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim(); }

function findSrcPath(nom, map) {
  if (map[nom]) return map[nom];
  const n = normStr(nom);
  for (const [k,v] of Object.entries(map)) if (normStr(k)===n) return v;
  return null;
}

function migrateRecord(rec, imgKey, map) {
  const id = rec.id;
  if (!id) return { rec, changed: false, msg: 'sense id' };

  const storedRaw = rec[imgKey] || '';
  const storedRel = storedRaw.startsWith(GH_BASE) ? storedRaw.slice(GH_BASE.length) : storedRaw;
  const storedBase = path.basename(storedRel, path.extname(storedRel));
  if (storedBase === id) return { rec, changed: false, msg: 'ja migrat' };

  let srcRel = null;
  if (storedRel && fs.existsSync(path.join(IMG_DIR, storedRel))) {
    srcRel = storedRel;
  } else {
    srcRel = findSrcPath(rec.nom, map);
  }
  if (!srcRel) return { rec, changed: false, msg: 'sense imatge' };

  const srcAbs = path.join(IMG_DIR, srcRel);
  if (!fs.existsSync(srcAbs)) return { rec, changed: false, msg: `fitxer no trobat: ${srcRel}` };

  const ext = path.extname(srcRel) || '.jpg';
  const folder = path.dirname(srcRel);
  const dstRel = `${folder}/${id}${ext}`;
  const dstAbs = path.join(IMG_DIR, dstRel);

  fs.copyFileSync(srcAbs, dstAbs);
  return { rec: { ...rec, [imgKey]: GH_BASE + dstRel }, changed: true, msg: `${srcRel} -> ${dstRel}` };
}

function main() {
  const exportFile = process.argv[2];
  if (!exportFile) {
    console.error('Ús: node migrate-images.js <img-export.json>');
    console.error('Descarrega el fitxer des del boto "Exportar per migrar" del panell DM.');
    process.exit(1);
  }
  if (!fs.existsSync(exportFile)) {
    console.error(`Fitxer no trobat: ${exportFile}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
  console.log('=== Migració d\'imatges per ID ===\n');

  const result = {};
  let totalChanged = 0;

  for (const [key, { imgKey, map }] of Object.entries(KEY_INFO)) {
    const records = data[key] || [];
    console.log(`--- ${key.toUpperCase()} (${records.length} registres) ---`);
    let changed = 0;
    result[key] = records.map(rec => {
      const { rec: newRec, changed: didChange, msg } = migrateRecord(rec, imgKey, map);
      if (didChange) { changed++; console.log(`  ✓ ${rec.nom}: ${msg}`); }
      else if (msg !== 'sense imatge' && msg !== 'ja migrat') console.log(`  - ${rec.nom}: ${msg}`);
      return newRec;
    });
    console.log(`  ${changed} migrats\n`);
    totalChanged += changed;
  }

  // Desa el resultat per pujar manualment a Firebase (o per usar com a referència)
  const outFile = exportFile.replace('.json', '-migrated.json');
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');

  console.log(`=== Fet. ${totalChanged} fitxers copiats. ===`);
  console.log(`Resultat desat a: ${outFile}`);
  console.log('\nPassos següents:');
  console.log('1. git add docs/assets/img && git commit -m "chore: imatges migrades per ID" && git push');
  console.log('2. Al panell DM de l\'app, fes clic a "Importar migrats" i selecciona ' + outFile);
  console.log('3. Comprova que tot funciona i esborra els fitxers originals si vols');
}

main();
