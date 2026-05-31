/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MahjongTile, HandState, GlossaryHand, Meld } from '../types';

export const ALL_TILES: MahjongTile[] = [
  // Characters (萬子)
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `${i + 1}w`,
    suit: 'characters' as const,
    value: `${i + 1}`,
    nameEn: `${i + 1} Character`,
    nameZh: `${i + 1}萬`,
  })),
  // Dots (筒子)
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `${i + 1}d`,
    suit: 'dots' as const,
    value: `${i + 1}`,
    nameEn: `${i + 1} Dot`,
    nameZh: `${i + 1}筒`,
  })),
  // Bamboo (索子)
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `${i + 1}b`,
    suit: 'bamboo' as const,
    value: `${i + 1}`,
    nameEn: `${i + 1} Bamboo`,
    nameZh: `${i + 1}索`,
  })),
  // Winds (風牌)
  { id: 'east', suit: 'winds' as const, value: 'east', nameEn: 'East Wind', nameZh: '東風' },
  { id: 'south', suit: 'winds' as const, value: 'south', nameEn: 'South Wind', nameZh: '南風' },
  { id: 'west', suit: 'winds' as const, value: 'west', nameEn: 'West Wind', nameZh: '西風' },
  { id: 'north', suit: 'winds' as const, value: 'north', nameEn: 'North Wind', nameZh: '北風' },
  // Dragons (三元牌)
  { id: 'red', suit: 'dragons' as const, value: 'red', nameEn: 'Red Dragon', nameZh: '紅中' },
  { id: 'green', suit: 'dragons' as const, value: 'green', nameEn: 'Green Dragon', nameZh: '青發' },
  { id: 'white', suit: 'dragons' as const, value: 'white', nameEn: 'White Dragon', nameZh: '白板' },
  // Seasons (四季)
  { id: 's1', suit: 'seasons' as const, value: 's1', nameEn: 'Spring (1)', nameZh: '春 (1)' },
  { id: 's2', suit: 'seasons' as const, value: 's2', nameEn: 'Summer (2)', nameZh: '夏 (2)' },
  { id: 's3', suit: 'seasons' as const, value: 's3', nameEn: 'Autumn (3)', nameZh: '秋 (3)' },
  { id: 's4', suit: 'seasons' as const, value: 's4', nameEn: 'Winter (4)', nameZh: '冬 (4)' },
  // Flowers (四君子)
  { id: 'f1', suit: 'flowers' as const, value: 'f1', nameEn: 'Plum (1)', nameZh: '梅 (1)' },
  { id: 'f2', suit: 'flowers' as const, value: 'f2', nameEn: 'Orchid (2)', nameZh: '蘭 (2)' },
  { id: 'f3', suit: 'flowers' as const, value: 'f3', nameEn: 'Bamboo (3)', nameZh: '竹 (3)' },
  { id: 'f4', suit: 'flowers' as const, value: 'f4', nameEn: 'Chrysanthemum (4)', nameZh: '菊 (4)' },
];

export const GLOSSARY_HANDS: GlossaryHand[] = [
  {
    id: 'common',
    nameEn: 'Common Hand',
    nameZh: '平胡',
    phonetic: 'Ping Wu',
    fan: 1,
    descriptionEn: 'The hand consists entirely of Chows (sequences of 3 numbers of the same suit) and a non-dragon Eye pair.',
    descriptionZh: '全手牌均由順子（同門順序三張牌）及一對非番子對子（眼）組成。',
    exampleTiles: ['1w', '2w', '3w', '4d', '5d', '6d', '7b', '8b', '9b', '2w', '3w', '4w', '5b', '5b'],
  },
  {
    id: 'all_pungs',
    nameEn: 'All Pungs',
    nameZh: '對對胡',
    phonetic: 'Dui Dui Wu',
    fan: 3,
    descriptionEn: 'The hand consists entirely of Pungs or Kongs (three/four of a kind) and one Eye pair.',
    descriptionZh: '全手牌均由刻子（三張相同）或槓子及一對對子組成。',
    exampleTiles: ['3w', '3w', '3w', '6d', '6d', '6d', '8b', '8b', '8b', 'red', 'red', 'red', 'white', 'white'],
  },
  {
    id: 'mixed_one_suit',
    nameEn: 'Mixed One Suit',
    nameZh: '混一色',
    phonetic: 'Wan Jat Sik',
    fan: 3,
    descriptionEn: 'The hand consists of tiles from only one suited suit (Bamboo, Dots, or Characters) plus Honor tiles (Winds and Dragons).',
    descriptionZh: '整副牌由單一門類（萬、筒或索）以及字牌（風牌或箭牌）組成。',
    exampleTiles: ['1w', '2w', '3w', '5w', '6w', '7w', '9w', '9w', '9w', 'east', 'east', 'east', 'red', 'red'],
  },
  {
    id: 'all_one_suit',
    nameEn: 'All One Suit',
    nameZh: '清一色',
    phonetic: 'Cing Jat Sik',
    fan: 7,
    descriptionEn: 'The hand consists entirely of tiles from only one suited suit (Bamboo, Dots, or Characters), with no Honor tiles whatsoever.',
    descriptionZh: '整副牌完全由同一門類（萬、筒或索）組成，沒有任何字牌。',
    exampleTiles: ['1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '2d', '2d', '2d', '5d', '5d'],
  },
  {
    id: 'small_three_dragons',
    nameEn: 'Small Three Dragons',
    nameZh: '小三元',
    phonetic: 'Siu Saam Jun',
    fan: 5,
    descriptionEn: 'The hand contains two Pungs/Kongs of dragons (from Red, Green, and White) and an Eye pair of the remaining dragon.',
    descriptionZh: '牌局內集齊兩組箭牌刻子（中、發、白），及餘下的一組箭牌對子（眼）。',
    exampleTiles: ['red', 'red', 'red', 'green', 'green', 'green', 'white', 'white', '2b', '3b', '4b', '8d', '8d', '8d'],
  },
  {
    id: 'great_three_dragons',
    nameEn: 'Great Three Dragons',
    nameZh: '大三元',
    phonetic: 'Daai Saam Jun',
    fan: 8,
    descriptionEn: 'The hand contains Pungs or Kongs of all three dragon tiles (Red, Green, and White). Each individual pung also gives extra dragon pung fan!',
    descriptionZh: '牌局內集齊紅中、青發、白板三組箭牌的刻子（或槓子）。',
    exampleTiles: ['red', 'red', 'red', 'green', 'green', 'green', 'white', 'white', 'white', '1w', '2w', '3w', '9d', '9d'],
  },
  {
    id: 'mixed_terminals',
    nameEn: 'Mixed Terminals',
    nameZh: '混老頭',
    phonetic: 'Wan Lou Tau',
    fan: 6,
    descriptionEn: 'The hand consists of only terminal suited tiles (1s and 9s) and Honor tiles. Automatically meets "All Pungs" as well.',
    descriptionZh: '整副牌完全由一、九數目牌及字牌（風牌或箭牌）的刻子與眼組成。',
    exampleTiles: ['1w', '1w', '1w', '9d', '9d', '9d', '1b', '1b', '1b', 'east', 'east', 'east', 'red', 'red'],
  },
  {
    id: 'small_four_winds',
    nameEn: 'Small Four Winds',
    nameZh: '小四喜',
    phonetic: 'Siu Sei Hei',
    fan: 10,
    descriptionEn: 'The hand contains Pungs or Kongs of three winds (East, South, West, North) and an Eye pair of the fourth wind.',
    descriptionZh: '牌局內集齊三組風牌刻子（東、南、西、北）及餘下一組風牌對子（眼）。',
    exampleTiles: ['east', 'east', 'east', 'south', 'south', 'south', 'west', 'west', 'west', 'north', 'north', '9w', '9w', '9w'],
  },
  {
    id: 'great_four_winds',
    nameEn: 'Great Four Winds',
    nameZh: '大四喜',
    phonetic: 'Daai Sei Hei',
    fan: 13,
    descriptionEn: 'The hand contains Pungs or Kongs of all four wind tiles (East, South, West, North). Max house limit (爆棚).',
    descriptionZh: '整副牌集齊東、南、西、北四組風牌刻子，為廣東/香港麻雀最高滿貫番數之一。',
    exampleTiles: ['east', 'east', 'east', 'south', 'south', 'south', 'west', 'west', 'west', 'north', 'north', 'north', '5d', '5d'],
  },
  {
    id: 'all_honors',
    nameEn: 'All Honors',
    nameZh: '字一色',
    phonetic: 'Zi Jat Sik',
    fan: 13,
    descriptionEn: 'The hand consists entirely of Wind and Dragon tiles. Max house limit (爆棚).',
    descriptionZh: '整副牌完全由字牌（風牌及箭牌）組成，沒有任何數目牌。',
    exampleTiles: ['east', 'east', 'east', 'south', 'south', 'south', 'west', 'west', 'west', 'red', 'red', 'red', 'white', 'white'],
  },
  {
    id: 'all_terminals',
    nameEn: 'All Terminals',
    nameZh: '清老頭',
    phonetic: 'Cing Lou Tau',
    fan: 13,
    descriptionEn: 'The hand consists entirely of 1s and 9s terminal tiles from suited blocks. Max house limit (爆棚).',
    descriptionZh: '整副牌完全由一、九數目牌（萬、筒、索）的刻子與眼組成，沒有字牌。',
    exampleTiles: ['1w', '1w', '1w', '9w', '9w', '9w', '1d', '1d', '1d', '9d', '9d', '9d', '1b', '1b'],
  },
  {
    id: 'thirteen_orphans',
    nameEn: 'Thirteen Orphans',
    nameZh: '十三幺',
    phonetic: 'Sap Saam Jiu',
    fan: 13,
    descriptionEn: 'The unique hand containing exactly one of each terminal tile (1 & 9 of Character, Dot, Bamboo) and one of each Honor (East, South, West, North, Red, Green, White), plus any duplicate of these 13.',
    descriptionZh: '由一筒、九筒、一索、九索、一萬、九萬，東、南、西、北，中、發、白十三張各一張，加其中任意一張作眼組成。',
    exampleTiles: ['1w', '9w', '1d', '9d', '1b', '9b', 'east', 'south', 'west', 'north', 'red', 'green', 'white', 'white'],
  }
];

export interface CalculationResult {
  isValid: boolean;
  errorMsg: string;
  totalFan: number;
  points: number;
  breakdown: Array<{
    nameZh: string;
    nameEn: string;
    fan: number;
  }>;
  handNameZh: string;
  handNameEn: string;
}

export function calculateScore(
  hand: HandState,
  seatWind: 'east' | 'south' | 'west' | 'north',
  prevailingWind: 'east' | 'south' | 'west' | 'north',
  minFan: number = 3
): CalculationResult {
  const breakdown: Array<{ nameZh: string; nameEn: string; fan: number }> = [];

  // Check validity
  // To calculate properly:
  // A standard hand is 4 melds + 1 eye = 14 tiles.
  // Thirteeen Orphans doesn't fit standard 4-melds setup, we handle it as a special checking if total tiles represent 13 orphans.
  // Let's first count total tiles to ensure it fits:
  let totalHandTilesCount = 0;
  const tileCounts: Record<string, number> = {};

  const addTilesToCount = (tileList: string[]) => {
    for (const t of tileList) {
      tileCounts[t] = (tileCounts[t] || 0) + 1;
      totalHandTilesCount++;
    }
  };

  // Populate counts from melds and eye
  for (const m of hand.melds) {
    addTilesToCount(m.tiles);
  }
  if (hand.eye) {
    addTilesToCount(hand.eye);
  }

  // 1. Check Thirteen Orphans (十三幺)
  // Let's write a parser that detects 13 Orphans:
  const orphanIds = ['1w', '9w', '1d', '9d', '1b', '9b', 'east', 'south', 'west', 'north', 'red', 'green', 'white'];
  let isOrphan = false;
  if (totalHandTilesCount === 14) {
    let matchesAll13 = true;
    for (const op of orphanIds) {
      if (!tileCounts[op] || tileCounts[op] < 1) {
        matchesAll13 = false;
        break;
      }
    }
    if (matchesAll13) {
      isOrphan = true;
    }
  }

  if (isOrphan) {
    breakdown.push({
      nameZh: '十三幺',
      nameEn: 'Thirteen Orphans',
      fan: 13,
    });

    // Count flowers
    calculateFlowers(hand, seatWind, breakdown);

    const totalFan = Math.min(13, breakdown.reduce((acc, b) => acc + b.fan, 0));
    return {
      isValid: true,
      errorMsg: '',
      totalFan,
      points: calculatePoints(totalFan, minFan),
      breakdown,
      handNameZh: '十三幺',
      handNameEn: 'Thirteen Orphans'
    };
  }

  // Basic validation for standard hands
  if (hand.melds.length !== 4) {
    return {
      isValid: false,
      errorMsg: 'A completed hand must contain exactly 4 Melds (Chow/Pung/Kong). 整副牌必須有 4 組食糊組合 (順/刻/槓)。',
      totalFan: 0,
      points: 0,
      breakdown: [],
      handNameZh: '未成胡',
      handNameEn: 'Incomplete Hand'
    };
  }
  if (!hand.eye || hand.eye.length !== 2 || hand.eye[0] !== hand.eye[1]) {
    return {
      isValid: false,
      errorMsg: 'A completed hand must contain exactly 1 Eye (Pair of identical tiles). 必須有一對牌作「眼」。',
      totalFan: 0,
      points: 0,
      breakdown: [],
      handNameZh: '未成胡',
      handNameEn: 'Incomplete Hand'
    };
  }

  // Double check if tiles exceed legal counts (max 4 per tile)
  for (const [key, count] of Object.entries(tileCounts)) {
    if (count > 4) {
      return {
        isValid: false,
        errorMsg: `Illegal hand: tile ${key} appears ${count} times (maximum is 4). 牌面不合法：${key} 重複出現了 ${count} 次。`,
        totalFan: 0,
        points: 0,
        breakdown: [],
        handNameZh: '牌面不合法',
        handNameEn: 'Invalid Hand Build'
      };
    }
  }

  // Let's run calculations for standard HK mahjong hands
  const isChow = (m: Meld) => m.type === 'chow';
  const isPungOrKong = (m: Meld) => m.type === 'pung' || m.type === 'kong';

  const chowsCount = hand.melds.filter(isChow).length;
  const pungsCount = hand.melds.filter(isPungOrKong).length;

  const getTileSuit = (tileId: string): string => {
    if (tileId.endsWith('w')) return 'characters';
    if (tileId.endsWith('d')) return 'dots';
    if (tileId.endsWith('b')) return 'bamboo';
    if (['east', 'south', 'west', 'north'].includes(tileId)) return 'winds';
    if (['red', 'green', 'white'].includes(tileId)) return 'dragons';
    return '';
  };

  // List of all suit strings in hand
  const allTileIds: string[] = [];
  for (const m of hand.melds) {
    allTileIds.push(...m.tiles);
  }
  if (hand.eye) {
    allTileIds.push(...hand.eye);
  }

  const suitsInHand = Array.from(new Set(allTileIds.map(getTileSuit)));
  const uniqueSuitsOnlyNumeric = suitsInHand.filter(s => ['characters', 'dots', 'bamboo'].includes(s));
  const hasHonors = suitsInHand.includes('winds') || suitsInHand.includes('dragons');

  // Let's check All Honors (字一色)
  const isAllHonors = suitsInHand.every(s => s === 'winds' || s === 'dragons');

  // Let's check All Terminals (清老頭)
  const isTerminal = (tileId: string) => {
    const val = tileId.substring(0, 1);
    return val === '1' || val === '9';
  };
  const isNumeric = (tileId: string) => {
    return tileId.endsWith('w') || tileId.endsWith('d') || tileId.endsWith('b');
  };
  const isAllTerminals = allTileIds.every(id => isNumeric(id) && isTerminal(id)) && pungsCount === 4;

  // Let's check Mixed Terminals (混老頭)
  const isTerminalOrHonor = (tileId: string) => {
    return !isNumeric(tileId) || isTerminal(tileId);
  };
  const isMixedTerminals = allTileIds.every(isTerminalOrHonor) && pungsCount === 4 && !isAllHonors && !isAllTerminals;

  // Let's check All One Suit (清一色)
  const isAllOneSuit = uniqueSuitsOnlyNumeric.length === 1 && !hasHonors;

  // Let's check Mixed One Suit (混一色)
  const isMixedOneSuit = uniqueSuitsOnlyNumeric.length === 1 && hasHonors && !isAllHonors;

  // Dragón variables
  let redPungs = 0;
  let greenPungs = 0;
  let whitePungs = 0;
  let redEye = false;
  let greenEye = false;
  let whiteEye = false;

  for (const m of hand.melds) {
    if (isPungOrKong(m)) {
      if (m.tiles[0] === 'red') redPungs++;
      if (m.tiles[0] === 'green') greenPungs++;
      if (m.tiles[0] === 'white') whitePungs++;
    }
  }
  if (hand.eye) {
    if (hand.eye[0] === 'red') redEye = true;
    if (hand.eye[0] === 'green') greenEye = true;
    if (hand.eye[0] === 'white') whiteEye = true;
  }

  // Great Three Dragons (大三元)
  const isGreatThreeDragons = redPungs > 0 && greenPungs > 0 && whitePungs > 0;
  // Small Three Dragons (小三元)
  const isSmallThreeDragons =
    !isGreatThreeDragons &&
    ((redPungs > 0 && greenPungs > 0 && whiteEye) ||
      (redPungs > 0 && whitePungs > 0 && greenEye) ||
      (greenPungs > 0 && whitePungs > 0 && redEye));

  // Winds variables
  let eastPungs = 0;
  let southPungs = 0;
  let westPungs = 0;
  let northPungs = 0;
  let eastEye = false;
  let southEye = false;
  let westEye = false;
  let northEye = false;

  for (const m of hand.melds) {
    if (isPungOrKong(m)) {
      if (m.tiles[0] === 'east') eastPungs++;
      if (m.tiles[0] === 'south') southPungs++;
      if (m.tiles[0] === 'west') westPungs++;
      if (m.tiles[0] === 'north') northPungs++;
    }
  }
  if (hand.eye) {
    if (hand.eye[0] === 'east') eastEye = true;
    if (hand.eye[0] === 'south') southEye = true;
    if (hand.eye[0] === 'west') westEye = true;
    if (hand.eye[0] === 'north') northEye = true;
  }

  const windPungsCount = eastPungs + southPungs + westPungs + northPungs;
  const windEyesCount = (eastEye ? 1 : 0) + (southEye ? 1 : 0) + (westEye ? 1 : 0) + (northEye ? 1 : 0);

  // Great Four Winds (大四喜)
  const isGreatFourWinds = windPungsCount === 4;
  // Small Four Winds (小四喜)
  const isSmallFourWinds = windPungsCount === 3 && windEyesCount === 1;

  // Dragon/Wind Individual Fan
  // Note: Great Three Dragons overrides individual dragon pung scores. In standard HK mahjong, normally, 
  // Great Three Dragons gives 8 Fan flat (or some count 8 Fan + individual, but 8 is already a Limit/Half-Limit value 
  // depending on play style. To make it standard: Great Three Dragons is 8 Fan flat, Small three dragons is 5 Fan flat).
  // Same for Winds: Small Four Winds = 10 Fan, Great Four Winds = 13 Fan.
  
  if (isGreatFourWinds) {
    breakdown.push({ nameZh: '大四喜', nameEn: 'Great Four Winds', fan: 13 });
  } else if (isSmallFourWinds) {
    breakdown.push({ nameZh: '小四喜', nameEn: 'Small Four Winds', fan: 10 });
  } else {
    // Individual wind pungs
    if (eastPungs > 0) {
      if (seatWind === 'east') breakdown.push({ nameZh: '東風刻（門風）', nameEn: 'Pung of East (Seat Wind)', fan: 1 });
      if (prevailingWind === 'east') breakdown.push({ nameZh: '東風刻（圈風）', nameEn: 'Pung of East (Prevailing Wind)', fan: 1 });
      if (seatWind !== 'east' && prevailingWind !== 'east') {
        // Just a regular pung of winds, doesn't give wind-specific fan, but is part of other patterns
      }
    }
    if (southPungs > 0) {
      if (seatWind === 'south') breakdown.push({ nameZh: '南風刻（門風）', nameEn: 'Pung of South (Seat Wind)', fan: 1 });
      if (prevailingWind === 'south') breakdown.push({ nameZh: '南風刻（圈風）', nameEn: 'Pung of South (Prevailing Wind)', fan: 1 });
    }
    if (westPungs > 0) {
      if (seatWind === 'west') breakdown.push({ nameZh: '西風刻（門風）', nameEn: 'Pung of West (Seat Wind)', fan: 1 });
      if (prevailingWind === 'west') breakdown.push({ nameZh: '西風刻（圈風）', nameEn: 'Pung of West (Prevailing Wind)', fan: 1 });
    }
    if (northPungs > 0) {
      if (seatWind === 'north') breakdown.push({ nameZh: '北風刻（門風）', nameEn: 'Pung of North (Seat Wind)', fan: 1 });
      if (prevailingWind === 'north') breakdown.push({ nameZh: '北風刻（圈風）', nameEn: 'Pung of North (Prevailing Wind)', fan: 1 });
    }
  }

  if (isGreatThreeDragons) {
    breakdown.push({ nameZh: '大三元', nameEn: 'Great Three Dragons', fan: 8 });
  } else if (isSmallThreeDragons) {
    breakdown.push({ nameZh: '小三元', nameEn: 'Small Three Dragons', fan: 5 });
  } else {
    // Individual dragon pungs
    if (redPungs > 0) breakdown.push({ nameZh: '中牌刻（箭牌）', nameEn: 'Pung of Red Dragon', fan: 1 });
    if (greenPungs > 0) breakdown.push({ nameZh: '發牌刻（箭牌）', nameEn: 'Pung of Green Dragon', fan: 1 });
    if (whitePungs > 0) breakdown.push({ nameZh: '白牌刻（箭牌）', nameEn: 'Pung of White Dragon', fan: 1 });
  }

  // Hand Style / Suit calculations
  if (isAllHonors) {
    breakdown.push({ nameZh: '字一色', nameEn: 'All Honors', fan: 13 });
  } else if (isAllTerminals) {
    breakdown.push({ nameZh: '清老頭', nameEn: 'All Terminals', fan: 13 });
  } else if (isMixedTerminals) {
    breakdown.push({ nameZh: '混老頭', nameEn: 'Mixed Terminals', fan: 6 });
  } else if (isAllOneSuit) {
    breakdown.push({ nameZh: '清一色', nameEn: 'All One Suit', fan: 7 });
  } else if (isMixedOneSuit) {
    breakdown.push({ nameZh: '混一色', nameEn: 'Mixed One Suit', fan: 3 });
  }

  // Playstyle / Meld composition
  if (!isAllHonors && !isAllTerminals && !isMixedTerminals) {
    if (pungsCount === 4) {
      breakdown.push({ nameZh: '對對胡', nameEn: 'All Pungs', fan: 3 });
    } else if (chowsCount === 4) {
      // Check if Eye has honors - Ping Wu (Common Hand) forbids Honor eyes in strict rules, but in general HK mahjong, 
      // the eye must be plain tiles (Bamboo, Dots, Characters). Let's verify this:
      const eyeTileId = hand.eye[0];
      const eyeSuit = getTileSuit(eyeTileId);
      if (['characters', 'dots', 'bamboo'].includes(eyeSuit)) {
        breakdown.push({ nameZh: '平胡', nameEn: 'Common Hand', fan: 1 });
      }
    }
  }

  // Concealed Hand & Zimo (門前清 & 自摸)
  if (hand.concealedHand) {
    breakdown.push({ nameZh: '門前清', nameEn: 'Concealed Hand', fan: 1 });
  }

  if (hand.selfDrawn) {
    breakdown.push({ nameZh: '自摸', nameEn: 'Self-Drawn', fan: 1 });
  }

  // Flower logic
  calculateFlowers(hand, seatWind, breakdown);

  // Summarize overall calculations
  let totalFan = breakdown.reduce((acc, b) => acc + b.fan, 0);

  // Max cap in standard HK house rule is normally 10 or 13 Fan (爆棚)
  const maxLimit = 13;
  if (totalFan > maxLimit) {
    totalFan = maxLimit;
  }

  // Determine dominant hand names
  let handNameZh = '爛牌 / 雞胡';
  let handNameEn = 'Chicken Hand';

  // Sort breakdown in descending order of value to pull the best name
  const sortedB = [...breakdown].sort((a, b) => b.fan - a.fan);
  if (sortedB.length > 0) {
    const top = sortedB[0];
    if (top.fan >= 3) {
      handNameZh = top.nameZh;
      handNameEn = top.nameEn;
    } else {
      // Check if we reach 3 fan through multiple smaller items
      if (totalFan >= 3) {
        handNameZh = '正花小牌 / 雜胡';
        handNameEn = 'Mixed Scoring Hand';
      }
    }
  }

  const finalHandNameZh = handNameZhCounted(totalFan, handNameZh);

  return {
    isValid: true,
    errorMsg: '',
    totalFan,
    points: calculatePoints(totalFan, minFan),
    breakdown,
    handNameZh: finalHandNameZh,
    handNameEn,
  };
}

function handNameZhCounted(fan: number, dominant: string) {
  if (fan === 0) return '無番 (雞胡)';
  return `${dominant} (${fan}番)`;
}

export function calculatePoints(fan: number, minFan: number = 3): number {
  if (fan < minFan) return 0;
  // standard formula specified: 2^(n-1) where n is Fan
  // Let's implement that exactly:
  // 3 Fan: 2^(3-1) = 2^2 = 4 points
  // 4 Fan: 2^(4-1) = 2^3 = 8 points
  // 5 Fan: 16 points
  // 6 Fan: 32 points
  // 7 Fan: 64 points
  // 8 Fan: 128 points
  // 9 Fan: 256 points
  // 10+ Fan: 512 points
  // 13 Fan: 4096 points (爆棚 limit)
  const points = Math.pow(2, fan - 1);
  return Math.min(4096, points); // 13-fan cap (爆棚): 2^12 = 4096
}

function calculateFlowers(
  hand: HandState,
  seatWind: 'east' | 'south' | 'west' | 'north',
  breakdown: Array<{ nameZh: string; nameEn: string; fan: number }>
) {
  if (hand.flowers.length === 0) return;

  const windToNum = { east: '1', south: '2', west: '3', north: '4' };
  const targetNum = windToNum[seatWind];

  let matchingCount = 0;
  let seasonCount = 0;
  let plantCount = 0;

  for (const fId of hand.flowers) {
    const num = fId.substring(1); // '1'..'4'
    if (num === targetNum) {
      matchingCount++;
      const isSeason = fId.startsWith('s');
      breakdown.push({
        nameZh: isSeason ? `正字四季花 (${fId.toUpperCase()})` : `正字四君子花 (${fId.toUpperCase()})`,
        nameEn: isSeason ? `Matching Season Tile (${fId.toUpperCase()})` : `Matching Flower Tile (${fId.toUpperCase()})`,
        fan: 1,
      });
    }

    if (fId.startsWith('s')) seasonCount++;
    if (fId.startsWith('f')) plantCount++;
  }

  // Full suit of Flowers or Seasons gives a bonus 2 Fan
  if (seasonCount === 4) {
    breakdown.push({
      nameZh: '一台花 (春夏秋冬四季齊)',
      nameEn: 'Full Season Suite (Spring-Winter Complete)',
      fan: 2,
    });
  }

  if (plantCount === 4) {
    breakdown.push({
      nameZh: '一台花 (梅蘭竹菊君子齊)',
      nameEn: 'Full Flower Suite (Plum-Chrysanthemum Complete)',
      fan: 2,
    });
  }

  // 7 flowers = 13 Fan
  // 8 flowers = 13 Fan
  const totalF = hand.flowers.length;
  if (totalF === 7) {
    breakdown.push({
      nameZh: '七台花 (集齊七現花)',
      nameEn: 'Seven Flowers Special',
      fan: 13,
    });
  } else if (totalF === 8) {
    breakdown.push({
      nameZh: '八花齊 (極致八現花)',
      nameEn: 'Eight Flowers (Total Collection)',
      fan: 13,
    });
  }
}
