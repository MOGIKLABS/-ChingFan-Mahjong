# 「清番」ChingFan Mahjong

**A Hong Kong-style mahjong fan/point scoring calculator built to settle family arguments at the table.**

🀄 Live demo: [ching-fan-mahjong.vercel.app](https://ching-fan-mahjong.vercel.app/)

Built by [Mogik Labs](https://mogiklabs.com) (無極實驗室) for the **UCWS Singapore Hackathon 2026**, competing in the Application track as a solo entry.

---

## The Problem

Every round of Hong Kong mahjong ends the same way: four people arguing over fan counts and payout maths. Who had the seat wind? Does that pung of Red Dragon stack with Mixed One Suit? Did the dealer multiplier apply? Was that three fan or four?

There is no dominant digital scoring tool for traditional mahjong. The game has over 400 million active players worldwide, yet families and social groups still resolve scoring disputes through memory, napkin maths, and volume.

## The Origin Story

My father is a post-stroke survivor who uses physical mahjong tiles as cognitive rehabilitation. Our family plays Hong Kong-style for small stakes (3-fan minimum, escalating to god hands). The game is part of his recovery, but every round still ends in the same chaos: arguments over fan counting and chip payouts.

ChingFan resolves that friction instantly. You build the winning hand, the calculator validates the fan breakdown, and the ledger records who pays whom. No arguments. No napkin maths. Just play the next round.

The parallel to Demis Hassabis and Go is intentional: traditional games are cognitive infrastructure, not nostalgia. ChingFan treats them that way.

## What It Does

ChingFan is a pure client-side TypeScript application with five core modules:

**Parlour** (雅座): Set up your table. Name the four players, assign the prevailing wind, set the dealer, configure the minimum fan threshold. The felt-map visualisation shows seat positions and chip balances at a glance.

**Builder** (算分器): Construct the winning hand tile by tile. Select the winner, choose self-drawn or discard feed, build four melds plus one eye pair, toggle flowers and seasons. The calculator runs in real time, validating the hand and breaking down every fan-bearing pattern.

**Inspector** (掃描器): Upload a photo of a laid-out mahjong hand. Gemini AI detects the tiles and maps them into the Builder format automatically. Includes sample preset hands for testing without physical tiles.

**Glossary** (番種指南): A bilingual reference guide to Hong Kong mahjong hand patterns, from Common Hand (平胡, 1 fan) through to Thirteen Orphans (十三幺, 13 fan). Each entry includes Cantonese phonetics, descriptions in both languages, and tile layout examples.

**Ledger** (結算簿): Full transaction history for the session. Every recorded win logs the fan count, point value, payment adjustments per player, and whether the dealer multiplier applied. Chip balances update automatically and persist across browser sessions.

## Scoring Engine

The calculator implements standard Hong Kong mahjong scoring rules:

- **Points formula**: 2^(n-1) where n = total fan count
- **Minimum fan threshold**: Configurable (default 3 fan)
- **Fan cap**: 13 fan maximum (爆棚)
- **Dealer multiplier**: Automatic 2x for games involving the dealer (莊家), applied to both self-drawn and discard wins
- **Flower/season matching**: Seat-wind-matched flowers score 1 fan each; complete sets of four seasons or four flowers score a 2-fan bonus; seven or eight flowers trigger the 13-fan limit

Supported hand patterns include: Common Hand (平胡), All Pungs (對對胡), Mixed One Suit (混一色), All One Suit (清一色), Small/Great Three Dragons (小三元/大三元), Mixed Terminals (混老頭), Small/Great Four Winds (小四喜/大四喜), All Honors (字一色), All Terminals (清老頭), and Thirteen Orphans (十三幺).

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite 6
- **AI Integration**: Google Gemini 3.5 Flash via @google/genai SDK (structured JSON output with schema validation)
- **Icons**: Lucide React
- **Typography**: Inter (UI), Playfair Display (heritage headings), JetBrains Mono (data)
- **Deployment**: Vercel (static build)
- **Built with**: Google AI Studio

## Project Structure

```
src/
├── App.tsx                        # Root layout, tab navigation, session state
├── main.tsx                       # React entry point
├── index.css                      # Tailwind theme config, brand palette
├── types.ts                       # TypeScript interfaces for tiles, melds, sessions
├── components/
│   ├── ParlourView.tsx            # Table setup, player config, seat map
│   ├── BuilderView.tsx            # Hand construction and scoring UI
│   ├── InspectorView.tsx          # Photo upload and Gemini tile detection
│   ├── GlossaryView.tsx           # Bilingual hand pattern reference
│   ├── LedgerView.tsx             # Transaction history and audit logs
│   ├── TileVisual.tsx             # Individual tile rendering component
│   └── TopAppBar.tsx              # Header bar with language toggle
└── utils/
    └── mahjongCalculator.ts       # Scoring engine, hand validation, glossary data
server.ts                          # Express server with Gemini API proxy
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key (required only for the Inspector photo scanning feature)

### Setup

```bash
git clone https://github.com/MOGIKLABS/-ChingFan-Mahjong.git
cd -ChingFan-Mahjong
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Add your Gemini API key to `.env`:

```
GEMINI_API_KEY=your_key_here
```

### Run locally

```bash
npm run dev
```

The app runs at `http://localhost:3000`. The Builder, Glossary, Parlour, and Ledger tabs all work without an API key. The Inspector tab requires a valid Gemini API key for photo scanning, but includes sample preset hands for testing without one.

### Build for production

```bash
npm run build
npm start
```

## Global Scalability

Mahjong is played by over 400 million people across East and Southeast Asia, with significant diaspora communities worldwide. The game has deep regional variation:

- **Hong Kong style** (廣東麻雀): the ruleset ChingFan currently supports
- **Riichi** (Japanese): different yaku system, riichi declaration mechanic
- **Taiwanese 16-tile**: larger hand size, unique scoring
- **Sichuan Bloody**: stripped tile set, multiple winners per round

Each regional variant represents an expansion path. The scoring engine is modular: the `calculateScore` function can be extended with alternative rule sets while the UI, session management, and ledger infrastructure remain shared.

Beyond home games, potential deployment contexts include community centres, social clubs, diaspora cultural organisations, mahjong tournament organisers, and educational settings where the game is used for cognitive training and rehabilitation.

## Bilingual Support

ChingFan runs fully bilingual in Traditional Chinese (繁體中文) and English, toggled via the language button in the header. All UI labels, error messages, hand pattern names, scoring breakdowns, and ledger entries render in both languages. Cantonese phonetic romanisation is included in the Glossary for pronunciation reference.

## Licence

Apache-2.0. See [LICENSE](LICENSE) for details.

---

Built with 🀄 by [PT Cheung](https://github.com/MOGIKLABS) at [Mogik Labs](https://mogiklabs.com)
