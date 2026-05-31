# MTG Mana Colors & Ravnica Guilds

> Colors de referència extrets del paquet `mtggplot` (comunitat MTG).
> WotC no publica hex oficials — aquests són els valors més estesos en eines digitals.

---

## 5 Colors de Mana + Incolor

| Codi | Color    | Símbol | Hex       |
|------|----------|--------|-----------|
| W    | Blanc    | ☀      | `#F9FAF4` |
| U    | Blau     | 💧     | `#0E68AB` |
| B    | Negre    | 💀     | `#150B00` |
| R    | Vermell  | 🔥     | `#D3202A` |
| G    | Verd     | 🌿     | `#00733E` |
| C    | Incolor  | ◇      | `#C6C5C5` |

---

## Gremis de Ravnica — Colors de Mana

| Gremi       | Colors          | Hex 1     | Hex 2     |
|-------------|-----------------|-----------|-----------|
| Azorius     | W + U (Blanc+Blau)     | `#F9FAF4` | `#0E68AB` |
| Dimir       | U + B (Blau+Negre)     | `#0E68AB` | `#150B00` |
| Rakdos      | B + R (Negre+Vermell)  | `#150B00` | `#D3202A` |
| Gruul       | R + G (Vermell+Verd)   | `#D3202A` | `#00733E` |
| Selesnya    | G + W (Verd+Blanc)     | `#00733E` | `#F9FAF4` |
| Orzhov      | W + B (Blanc+Negre)    | `#F9FAF4` | `#150B00` |
| Izzet       | U + R (Blau+Vermell)   | `#0E68AB` | `#D3202A` |
| Golgari     | B + G (Negre+Verd)     | `#150B00` | `#00733E` |
| Boros       | R + W (Vermell+Blanc)  | `#D3202A` | `#F9FAF4` |
| Simic       | G + U (Verd+Blau)      | `#00733E` | `#0E68AB` |
| Guildless   | Incolor                | `#C6C5C5` | —         |

---

## Per ús en codi (JS/TS)

```js
const MANA_COLORS = {
  W: "#F9FAF4", // Blanc
  U: "#0E68AB", // Blau
  B: "#150B00", // Negre
  R: "#D3202A", // Vermell
  G: "#00733E", // Verd
  C: "#C6C5C5", // Incolor
};

const GUILD_COLORS = {
  Azorius:   { mana: ["W","U"], hex: ["#F9FAF4","#0E68AB"] },
  Dimir:     { mana: ["U","B"], hex: ["#0E68AB","#150B00"] },
  Rakdos:    { mana: ["B","R"], hex: ["#150B00","#D3202A"] },
  Gruul:     { mana: ["R","G"], hex: ["#D3202A","#00733E"] },
  Selesnya:  { mana: ["G","W"], hex: ["#00733E","#F9FAF4"] },
  Orzhov:    { mana: ["W","B"], hex: ["#F9FAF4","#150B00"] },
  Izzet:     { mana: ["U","R"], hex: ["#0E68AB","#D3202A"] },
  Golgari:   { mana: ["B","G"], hex: ["#150B00","#00733E"] },
  Boros:     { mana: ["R","W"], hex: ["#D3202A","#F9FAF4"] },
  Simic:     { mana: ["G","U"], hex: ["#00733E","#0E68AB"] },
  Guildless: { mana: ["C"],    hex: ["#C6C5C5"]           },
};
```

---

## Notes

- Els 5 **aliats** (Azorius → Selesnya) son parelles adjacents en el color pie WUBRG.
- Els 5 **enemics** (Orzhov → Simic) salten un color en el color pie.
- Ordre canònic MTG: **WUBRG** (White → Blue → Black → Red → Green).
- `Negre (#150B00)` és quasi negre però amb to marronós càlid, no negre pur.
- `Blanc (#F9FAF4)` és crema/marfil, no blanc pur, reflectint el to del símbol de mana.
