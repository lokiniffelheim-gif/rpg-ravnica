# CLAUDE.md — Instruccions de sessió per a l'app Ravnica

> Aquest fitxer es carrega automàticament a cada sessió. Rellegeix-lo íntegrament abans de respondre.

---

## Projecte

App de gestió de campanya RPG (Pathfinder 2e, ambientació Ravnica/MtG). SPA React + Babel (CDN) + Firebase Firestore + GitHub Pages.

- **Font editable:** `src/index.html` (JSX inline) — **MAI editar `docs/index.html` directament**
- **Build:** `node build.js` → genera `docs/index.html`
- **Deploy:** `git push` → GitHub Pages actualitza automàticament
- **Versió actual:** consultar `git log --oneline -1` o `const VERSION` a `src/index.html` línia ~65

---

## 1. Workflow de versions i commits (OBLIGATORI)

Cada canvi de codi segueix aquest ordre **sempre**, sense excepcions:

1. Editar `src/index.html`
2. Actualitzar `const VERSION="X.Y.Z"` a `src/index.html` (línia ~65) — **no oblidar mai aquest pas**
3. `node build.js`
4. `git add src/index.html docs/`
5. `git commit -m "tipus(vX.Y.Z): descripció"`
6. `git push`

### Versioning semàntic
| Tipus de canvi | Bump |
|---|---|
| `feat` — nova funcionalitat | **minor** x.**Y**.0 |
| `fix` / `perf` / `chore` — correcció | **patch** x.y.**Z** |
| Reimplementació major / trencador | **major** **X**.0.0 |

**Important:** La versió al header NO s'actualitza sola. Si s'oblida el pas 2, fer un commit `fix` addicional.

---

## 2. Workflow d'imatges de landing

Les imatges **no depenen de Firebase**. L'app les carrega per ID des de `docs/assets/data/img-index.json`, generat automàticament per `build.js`.

### Com funciona
- `build.js` escaneja `personajes/`, `Aventino/`, `objetos/` i genera `img-index.json`: `{id → path}`
- L'app consulta `IMG_INDEX.chars[item.id]`, `IMG_INDEX.edificis[item.id]`, etc.
- Si no hi ha imatge per aquell ID → no mostra res (sense fallback complex)

### Workflow quan hi ha imatges noves a `docs/assets/img/landing/`

**Pas 1 — Identificar a quin element pertany**
- Pel nom del fitxer (sense extensió), buscar a `docs/assets/data/chars.json` el personatge, edifici o handout corresponent
- Si no hi ha match: preguntar a l'usuari

**Pas 2 — Obtenir l'ID del registre**
- Buscar el camp `id` del registre a `chars.json`
- Si no en té: generar-ne un amb `Date.now().toString(36) + Math.random().toString(36).slice(2,8)` i afegir-lo al JSON

**Pas 3 — Copiar la imatge amb nom = ID**
- chars → `docs/assets/img/personajes/{id}.{ext}`
- edificis → `docs/assets/img/Aventino/{id}.{ext}`
- handouts → `docs/assets/img/objetos/{id}.{ext}`
- Eliminar de `landing/`

**Pas 4 — Build i commit**
```
node build.js   ← regenera img-index.json automàticament
git add docs/assets/img/ docs/assets/data/ src/index.html
git commit -m "feat: imatge {Nom}"
git push
```

**Regla clau:** Els camps `avatar`/`avatarCustom`/`img` de Firebase/JSON s'ignoren per a imatges. L'únic que importa és que el fitxer existeixi amb el nom correcte (`{id}.ext`) a la carpeta correcta.

---

## 3. Arquitectura de l'app

### Fitxers clau
| Fitxer | Rol |
|---|---|
| `src/index.html` | Font JSX — editar sempre aquí |
| `docs/index.html` | Build compilat — generat per `node build.js` |
| `docs/assets/data/chars.json` | Dades de personatges (backup local) |
| `docs/assets/data/edificis.json` | Dades d'edificis (backup local) |
| `docs/assets/img/personajes/` | Avatars de personatges (nom = ID del registre) |
| `docs/assets/img/Aventino/` | Imatges d'edificis (nom = ID del registre) |
| `docs/assets/img/landing/` | Zona d'entrada imatges noves |

### Pestanyes de l'app
- **Aventino** — edificis/locacions del districte, filtrats per gremi
- **Personajes** — 60+ NPCs + PJs, visibilitat per jugador, tags gremi, avatar
- **Objetos** — handouts (objectes màgics, documents, recursos)
- **Gremios** — fitxes .md per cada gremi
- **Sesiones** — només DM, sessions per acte

### IDs dels registres
L'app genera IDs via `genId()` = `Date.now().toString(36) + Math.random().toString(36).slice(2,8)`.
Les imatges han d'anomenar-se amb l'ID del registre corresponent.

---

## 4. Sistema de temes (light/dark)

L'app té dos temes: *Pergamí Maleït* (light) i *Cripta Profunda* (dark).

- Toggle al header (botó ☽/☀)
- Preferència guardada a `localStorage("rv-theme")`
- Colors definits a `applyTheme()` — actualitzen tant les CSS vars de `:root` (per portals/modals fora de `.rv`) com les JS constants (`BG`, `BG2`, `BG3`, `GOLD`, `BORDER`)
- CSS vars a `.rv.dark` sobreescriuen `:root` per als elements dins `.rv`

**Important:** Sempre usar `var(--text)`, `var(--bg)`, etc. per a colors temàtics. Evitar colors hexadecimals hardcodejats excepte els semàntics (`#c43030` error, `#5a9a3a` èxit).

---

## 5. Preferències de codi

- **Llengua:** comentaris i missatges de commit en català
- **Commits:** sempre en format `tipus(vX.Y.Z): descripció` en català
- **Colors semàntics hardcodejats permesos:** `#c43030` (error/perill), `#5a9a3a` (èxit), `#e8dcc8`/`#000000bb` (text clar sobre imatge fosca)
- **Fonts:** `'Metamorphous'` per a títols/noms, `'IM Fell English'` per a text corrent
- **Mides:** base 18px, títols d'ítem 22px, tags gremi 16px, tags secundaris 13px
- **No afegir comentaris al codi** excepte quan el WHY no és evident
- **No crear fitxers `.md` de documentació** excepte si l'usuari ho demana explícitament

---

## 6. Rols i visibilitat

- **DM** (`user.rol === "dm"`): accés total — tots els panells, botons d'edició, dades sensibles (Dimir, info DM, notes)
- **Jugadors**: accés limitat — sense pestanya Sesiones, sense botons d'administració, sense gremi Dimir si no el tenen, sense totals al header
- **Preview** (`previewAs`): el DM simula la vista d'un jugador concret

---

## 7. Gestió d'imatges a l'app

- Les imatges dels personatges s'emmagatzemen a `docs/assets/img/personajes/{id}.{ext}`
- Les imatges dels edificis a `docs/assets/img/Aventino/{id}.{ext}`
- Els camps al JSON: `avatar` (chars), `avatarCustom` (edificis), `img` (handouts)
- El marc de quadre fantàstic (`.rv-frame`) s'aplica automàticament a totes les imatges de detall
- La zona d'imatge del detall té un degradat de color del gremi (esquerra) i conflicte (dreta)
