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

interface TileDisplay {
  char: string;
  symbol?: string;
  charColor: string;
  symbolColor?: string;
  bgChar: string;
  label: string;
  isSpecial?: boolean;
}

export default function TileVisual({
  tileId,
  size = 'md',
  active = false,
  onClick,
  disabled = false,
  as,
}: TileVisualProps) {

  const getTileDisplay = (id: string): TileDisplay => {
    const value = id.substring(0, 1);
    const suit = id.substring(1);

    // Winds (東南西北) - all blue, matching physical HK tiles
    switch (id) {
      case 'east':
        return { char: '東', charColor: 'text-[#1a56db]', bgChar: '東', label: 'East' };
      case 'south':
        return { char: '南', charColor: 'text-[#1a56db]', bgChar: '南', label: 'South' };
      case 'west':
        return { char: '西', charColor: 'text-[#1a56db]', bgChar: '西', label: 'West' };
      case 'north':
        return { char: '北', charColor: 'text-[#1a56db]', bgChar: '北', label: 'North' };
      // Dragons
      case 'red':
        return { char: '中', charColor: 'text-[#cc0000]', bgChar: '中', label: 'Red' };
      case 'green':
        return { char: '發', charColor: 'text-[#006630]', bgChar: '發', label: 'Green' };
      case 'white':
        return { char: '白', charColor: 'text-[#1a56db]', bgChar: '白', label: 'White' };
      default:
        break;
    }

    // Seasons (春夏秋冬)
    if (id.startsWith('s')) {
      const names = ['春', '夏', '秋', '冬'];
      const index = parseInt(value, 10) - 1;
      return {
        char: names[index] || '季',
        charColor: 'text-[#1a56db]',
        bgChar: value,
        label: `Season ${value}`,
        isSpecial: true,
      };
    }

    // Flowers (梅蘭竹菊)
    if (id.startsWith('f')) {
      const names = ['梅', '蘭', '竹', '菊'];
      const colors = ['text-[#cc0000]', 'text-[#1a56db]', 'text-[#006630]', 'text-[#cc6600]'];
      const index = parseInt(value, 10) - 1;
      return {
        char: names[index] || '花',
        charColor: colors[index] || 'text-[#cc6600]',
        bgChar: value,
        label: `Flower ${value}`,
        isSpecial: true,
      };
    }

    // Characters (萬子) - odd: blue number/red 萬, even: red number/blue 萬
    if (suit === 'w') {
      const numbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      const num = parseInt(value, 10);
      const numChar = numbers[num] || value;
      const isOdd = num % 2 !== 0;
      return {
        char: numChar,
        symbol: '萬',
        charColor: isOdd ? 'text-[#1a56db]' : 'text-[#cc0000]',
        symbolColor: isOdd ? 'text-[#cc0000]' : 'text-[#1a56db]',
        bgChar: numChar,
        label: `${value} Wan`,
      };
    }

    // Dots (筒子) - blue with multi-colour accents
    if (suit === 'd') {
      return {
        char: value,
        symbol: '筒',
        charColor: 'text-[#1a56db]',
        symbolColor: 'text-[#006630]',
        bgChar: '●',
        label: `${value} Dot`,
      };
    }

    // Bamboo (索子) - green, 1-Bamboo is the bird
    if (suit === 'b') {
      if (value === '1') {
        return {
          char: '鳥',
          charColor: 'text-[#006630]',
          bgChar: '索',
          label: '1 Bamboo',
        };
      }
      return {
        char: value,
        symbol: '索',
        charColor: 'text-[#006630]',
        symbolColor: 'text-[#006630]',
        bgChar: '索',
        label: `${value} Bamboo`,
      };
    }

    return { char: id.toUpperCase(), charColor: 'text-zinc-600', bgChar: '', label: id };
  };

  const display = getTileDisplay(tileId);

  // Bigger sizes for 55+ demographic accessibility
  const sizeClasses = {
    sm: 'w-11 h-16 text-sm',
    md: 'w-16 h-22 text-lg',
    lg: 'w-20 h-28 text-2xl',
  };

  const basePaddingClass = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  // White Dragon (白板) gets a special inner rendering
  const isWhiteDragon = tileId === 'white';

  const Component: 'div' | 'button' = as || (onClick ? 'button' : 'div');
  const componentProps = Component === 'button'
    ? { disabled, onClick, type: 'button' as const }
    : { onClick };

  return (
    <Component
      id={`tile-${tileId}`}
      {...componentProps}
      className={`
        relative inline-flex flex-col items-center justify-between
        ${sizeClasses[size]} rounded-lg transition-all duration-150 select-none
        border-t-2 border-l border-r-4 border-b-6
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-zinc-300 bg-white text-zinc-400'
            : active
              ? 'border-gold-leaf bg-white shadow-[0_4px_16px_rgba(197,160,33,0.3)] scale-102 z-10'
              : 'border-[#d4d4d8] bg-white text-surface hover:translate-y-[-2px] hover:shadow-md'
        }
        after:absolute after:bottom-[-6px] after:right-[-4px] after:-z-10
        after:w-[calc(100%+4px)] after:h-[12%] after:rounded-b-lg after:bg-zinc-400/60
      `}
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Small corner index */}
      <span className="absolute top-0.5 left-1 font-mono opacity-40 tracking-tighter" style={{ fontSize: size === 'sm' ? '7px' : '8px' }}>
        {tileId.toUpperCase()}
      </span>

      {/* Main tile content */}
      <div className={`flex flex-col items-center justify-center w-full h-full ${basePaddingClass[size]} mt-2`}>
        {isWhiteDragon ? (
          /* White Dragon: blue bordered rectangle matching physical tile */
          <div
            className="border-2 border-[#1a56db] rounded-sm"
            style={{
              width: size === 'sm' ? '16px' : size === 'md' ? '22px' : '28px',
              height: size === 'sm' ? '22px' : size === 'md' ? '30px' : '38px',
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span
              className={`${display.charColor} font-serif font-extrabold leading-tight`}
              style={{ fontSize: size === 'sm' ? '14px' : size === 'md' ? '20px' : '28px' }}
            >
              {display.char}
            </span>
            {display.symbol && (
              <span
                className={`${display.symbolColor || 'text-zinc-500'} font-serif font-bold leading-none mt-0.5`}
                style={{ fontSize: size === 'sm' ? '10px' : size === 'md' ? '13px' : '16px' }}
              >
                {display.symbol}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Authentic depth border */}
      <div className="absolute inset-0.5 border border-zinc-200/50 rounded-xs pointer-events-none" />
    </Component>
  );
}
