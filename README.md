# EN

# DFA Simulator

Interactive Deterministic Finite Automaton simulator built in Elm.

## Requirements

- [Node.js](https://nodejs.org/) (v16 or newer)

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/florakanuch/dfa_simulator
cd dfa_simulator

# 2. Install dependencies
npm install

# 3. Build and run locally
npm run dev
```

The app will open automatically at **http://localhost:3000**

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Build and open in browser |
| `npm run build` | Compile Elm → main.js |
| `npm run build:optimize` | Compile with optimizations (smaller output) |
| `npm start` | Start server without rebuilding |

# SK

# DFA Simulator
 
Interaktívny webový simulátor deterministického konečného automatu implementovaný v jazyku Elm.
 
## Požiadavky
 
- [Node.js](https://nodejs.org/) (verzia 16 alebo novšia)
## Spustenie
 
```bash
# 1. Klonovanie repozitára
git clone https://github.com/florakanuch/dfa_simulator
cd dfa_simulator
 
# 2. Inštalácia závislostí
npm install
 
# 3. Zostavenie a spustenie
npm run dev
```
 
Aplikácia sa automaticky otvorí na adrese **http://localhost:3000**
 
## Príkazy
 
| Príkaz | Popis |
|---|---|
| `npm run dev` | Zostaví aplikáciu a otvorí prehliadač |
| `npm run build` | Skompiluje Elm → docs/main.js |
| `npm run build:optimize` | Skompiluje s optimalizáciami (menší výstup) |
| `npm start` | Spustí server bez rekompilácie |
 
## Štruktúra projektu
 
```
dfa_simulator/
│
├── src/                        ← zdrojové súbory Elm
│   ├── Main.elm                ← vstupný bod aplikácie; definuje porty, inicializáciu,
│   │                              subscriptions a prepojenie Model–View–Update
│   ├── Types.elm               ← definície všetkých typov: Model, Msg, DrawTool,
│   │                              HoverTarget, SavedDiagram, DiagramData a iné
│   ├── Update.elm              ← funkcia update; spracovanie všetkých správ Msg
│   │                              a zmeny stavu modelu
│   ├── View.elm                ← hlavná view funkcia; skladá celé používateľské
│   │                              rozhranie zo subkomponentov
│   ├── Lang.elm                ← lokalizácia; prekladové reťazce pre slovenčinu
│   │                              a angličtinu (typ Translations)
│   ├── Simulation.elm          ← logika simulácie DKA; funkcie stepOnce, stepBack,
│   │                              runToEnd a checkAcceptance
│   ├── CodeSync.elm            ← synchronizácia medzi kódovým panelom a diagramom;
│   │                              parsovanie a generovanie textovej definície automatu
│   ├── Helpers.elm             ← pomocné funkcie používané naprieč modulmi
│   │                              (napr. flt, listUnique, listLast)
│   └── View/
│       ├── Canvas.elm          ← vykresľovanie SVG diagramu; stavy, prechody,
│       │                          self-looopy, hover detekcia, drag & drop
│       ├── Panels.elm          ← bočné panely: Test String, kódový panel,
│       │                          zoznam stavov, modaly pre simuláciu
│       └── Widgets.elm         ← znovupoužiteľné UI komponenty: panel, toolBtn,
│                                  topBarBtn, toolGroup, collapsibleHeader a iné
│
├── docs/                       ← výstupný priečinok pre GitHub Pages
│   ├── index.html              ← hlavná HTML stránka; obsahuje CSS, port subscribery
│   │                              v JavaScripte a inicializáciu Elm aplikácie
│   └── main.js                 ← skompilovaný JavaScript generovaný príkazom elm make
│                                  (tento súbor sa negeneruje manuálne)
│
├── elm-stuff/                  ← cache Elm kompilátora (generované automaticky,
│                                  neupravovať manuálne)
│
├── elm.json                    ← konfigurácia Elm projektu; zoznam závislostí
│                                  a ich presné verzie
├── package.json                ← konfigurácia Node.js; skripty na build a spustenie
├── .gitignore                  ← zoznam súborov a priečinkov vylúčených z Gitu
├── LICENSE                     ← licencia projektu (MIT)
└── README.md                   ← tento súbor
```
 
## Živá ukážka
 
Aplikácia je dostupná online na: **https://florakanuch.github.io/dfa_simulator**