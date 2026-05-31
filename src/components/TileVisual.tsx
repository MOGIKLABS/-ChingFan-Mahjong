/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface TileVisualProps {
  tileId: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  as?: 'div' | 'button';
  key?: any;
}

export default function TileVisual({
  tileId,
  size = 'md',
  active = false,
  onClick,
  disabled = false,
  as,
}: TileVisualProps) {

  const getTileContent = (id: string) => {
    const value = id.substring(0, 1);
    const suit = id.substring(1);

    // Winds - bold blue calligraphy, single character filling the tile
    switch (id) {
      case 'east':  return { top: '東', topColor: '#1a4ecf', label: 'East' };
      case 'south': return { top: '南', topColor: '#1a4ecf', label: 'South' };
      case 'west':  return { top: '西', topColor: '#1a4ecf', label: 'West' };
      case 'north': return { top: '北', topColor: '#1a4ecf', label: 'North' };
      // Dragons
      case 'red':   return { top: '中', topColor: '#cc0000', label: 'Red Dragon' };
      case 'green': return { top: '發', topColor: '#006630', label: 'Green Dragon' };
      case 'white': return { isWhiteDragon: true, label: 'White Dragon' };
      default: break;
    }

    // Seasons
    if (id.startsWith('s')) {
      const names = ['春', '夏', '秋', '冬'];
      const colors = ['#cc0000', '#1a4ecf', '#006630', '#8B4513'];
      const idx = parseInt(value, 10) - 1;
      return { top: names[idx], topColor: colors[idx], label: `Season ${value}`, isSpecial: true };
    }

    // Flowers
    if (id.startsWith('f')) {
      const names = ['梅', '蘭', '竹', '菊'];
      const colors = ['#cc0000', '#1a4ecf', '#006630', '#cc6600'];
      const idx = parseInt(value, 10) - 1;
      return { top: names[idx], topColor: colors[idx], label: `Flower ${value}`, isSpecial: true };
    }

    // Characters (萬) - number on top, 萬 on bottom, two-tone colour
    if (suit === 'w') {
      const numbers = ['', '一', '二', '三', '四', '伍', '六', '七', '八', '九'];
      const num = parseInt(value, 10);
      const isOdd = num % 2 !== 0;
      return {
        top: numbers[num],
        topColor: isOdd ? '#1a4ecf' : '#cc0000',
        bottom: '萬',
        bottomColor: isOdd ? '#cc0000' : '#1a4ecf',
        label: `${value} Wan`,
      };
    }

    // Dots (筒) - number on top, 筒 on bottom
    if (suit === 'd') {
      return {
        top: value,
        topColor: '#1a4ecf',
        bottom: '筒',
        bottomColor: '#006630',
        label: `${value} Dot`,
      };
    }

    // Bamboo (索) - 1-Bamboo is the bird
    if (suit === 'b') {
      if (value === '1') {
        return { top: '鳥', topColor: '#006630', label: '1 Bamboo' };
      }
      return {
        top: value,
        topColor: '#006630',
        bottom: '索',
        bottomColor: '#006630',
        label: `${value} Bamboo`,
      };
    }

    return { top: id.toUpperCase(), topColor: '#666', label: id };
  };

  const tile = getTileContent(tileId);

  // Generous sizes - 55+ accessibility
  const dims = {
    sm: { w: 'w-12', h: 'h-16', topFont: '18px', bottomFont: '12px' },
    md: { w: 'w-16', h: 'h-22', topFont: '26px', bottomFont: '16px' },
    lg: { w: 'w-20', h: 'h-28', topFont: '34px', bottomFont: '20px' },
  }[size];

  const Component: 'div' | 'button' = as || (onClick ? 'button' : 'div');
  const componentProps = Component === 'button'
    ? { disabled, onClick, type: 'button' as const }
    : { onClick };

  return (
    <Component
      id={`tile-${tileId}`}
      {...componentProps}
      className={`
        relative inline-flex items-center justify-center
        ${dims.w} ${dims.h} rounded-md select-none
        border border-zinc-300
        ${disabled
          ? 'opacity-40 cursor-not-allowed bg-zinc-100'
          : active
            ? 'bg-white shadow-[0_0_12px_rgba(197,160,33,0.5)] ring-2 ring-gold-leaf scale-105 z-10'
            : 'bg-white shadow-sm hover:shadow-md hover:translate-y-[-1px]'
        }
        transition-all duration-150
      `}
    >
      {'isWhiteDragon' in tile && tile.isWhiteDragon ? (
        /* White Dragon: blue bordered rectangle */
        <div
          className="border-[3px] border-[#1a4ecf] rounded-sm"
          style={{
            width: size === 'sm' ? '20px' : size === 'md' ? '28px' : '36px',
            height: size === 'sm' ? '26px' : size === 'md' ? '36px' : '46px',
          }}
        />
      ) : 'bottom' in tile ? (
        /* Two-character tiles: number + suit character stacked */
        <div className="flex flex-col items-center justify-center leading-none gap-0">
          <span
            className="font-serif font-black"
            style={{ color: tile.topColor, fontSize: dims.topFont, lineHeight: 1.1 }}
          >
            {tile.top}
          </span>
          <span
            className="font-serif font-black"
            style={{ color: tile.bottomColor, fontSize: dims.bottomFont, lineHeight: 1.1 }}
          >
            {tile.bottom}
          </span>
        </div>
      ) : (
        /* Single character tiles: winds, dragons, flowers, seasons, 1-bam */
        <span
          className="font-serif font-black"
          style={{ color: tile.topColor, fontSize: dims.topFont, lineHeight: 1 }}
        >
          {tile.top}
        </span>
      )}
    </Component>
  );
}
