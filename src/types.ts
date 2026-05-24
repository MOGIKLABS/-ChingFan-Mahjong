/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'zh-HK';

export type TileSuit = 'characters' | 'dots' | 'bamboo' | 'winds' | 'dragons' | 'flowers' | 'seasons';

export interface MahjongTile {
  id: string;
  suit: TileSuit;
  value: string; // '1'..'9' for suits, or 'east'|'south'|'west'|'north'|'red'|'green'|'white'|'f1'..'f4'|'s1'..'s4'
  nameEn: string;
  nameZh: string;
}

export type MeldType = 'chow' | 'pung' | 'kong';

export interface Meld {
  id: string;
  type: MeldType;
  tiles: string[]; // List of tile IDs
  isConcealed: boolean;
}

export interface HandState {
  melds: Meld[];
  eye: string[] | null; // exactly 2 tile IDs matching
  flowers: string[]; // List of flower/season tile IDs
  concealedHand: boolean; // is entire hand concealed (門前清)
  selfDrawn: boolean; // was tile self-drawn (自摸)
  winningTile: string | null; // tile ID that won the hand
}

export interface Player {
  id: string;
  name: string;
  seatWind: 'east' | 'south' | 'west' | 'north';
  chips: number; // starts at 1000 or custom level
}

export interface GameRecord {
  id: string;
  timestamp: string;
  winnerId: string;
  loserId: string | 'self-drawn'; // who discarded (or self-drawn)
  fan: number;
  points: number;
  handNameZh: string;
  handNameEn: string;
  detailTranslations: {
    en: string;
    zh: string;
  };
  payments: {
    [playerId: string]: number; // point adjustments
  };
}

export interface MatchSession {
  id: string;
  title: string;
  date: string;
  prevailingWind: 'east' | 'south' | 'west' | 'north';
  dealerIndex: number; // 0..3 index of player
  consecutiveDealerWins: number; // 連莊數
  minFan: number; // default is 3
  players: Player[];
  ledger: GameRecord[];
}

export interface GlossaryHand {
  id: string;
  nameEn: string;
  nameZh: string;
  phonetic: string;
  fan: number;
  descriptionEn: string;
  descriptionZh: string;
  exampleTiles: string[]; // for visual guidance
}
