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
  // Map tile ID to beautiful display elements
  const getTileDisplay = (id: string) => {
    const value = id.substring(0, 1);
    const suit = id.substring(1);

    switch (id) {
      case 'east':
        return { char: '東', color: 'text-zinc-100', bgChar: '東', label: 'East' };
      case 'south':
        return { char: '南', color: 'text-accent-red font-semibold', bgChar: '南', label: 'South' };
      case 'west':
        return { char: '西', color: 'text-zinc-100', bgChar: '西', label: 'West' };
      case 'north':
        return { char: '北', color: 'text-primary font-bold', bgChar: '北', label: 'North' };
      case 'red':
        return { char: '中', color: 'text-accent-red font-extrabold', bgChar: '中', label: 'Red' };
      case 'green':
        return { char: '發', color: 'text-primary font-extrabold', bgChar: '發', label: 'Green' };
      case 'white':
        return { char: '白', color: 'text-[#4169E1] font-extrabold border border-[#4169E1]/60 px-1 py-0.5 rounded-xs', bgChar: '白', label: 'White' };
      default:
        break;
    }

    // Flowers / Seasons
    if (id.startsWith('s')) {
      const names = ['春', '夏', '秋', '冬'];
      const index = parseInt(value, 10) - 1;
      return {
        char: names[index] || '季',
        color: 'text-gold-leaf font-bold',
        bgChar: value,
        label: `Season ${value}`,
        isSpecial: true,
      };
    }
    if (id.startsWith('f')) {
      const names = ['梅', '蘭', '竹', '菊'];
      const index = parseInt(value, 10) - 1;
      return {
        char: names[index] || '花',
        color: 'text-[#8B008B] font-bold',
        bgChar: value,
        label: `Flower ${value}`,
        isSpecial: true,
      };
    }

    // Numeric Suits: Characters
    if (suit === 'w') {
      const numbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      const numChar = numbers[parseInt(value, 10)] || value;
      return {
        char: `${numChar}\n萬`,
        color: 'text-accent-red font-medium leading-none whitespace-pre-line',
        bgChar: numChar,
        label: `${value} Wan`,
      };
    }

    // Dots
    if (suit === 'd') {
      const dotsSymbols = ['', '●', '●●', '●●●', '::', '::●', ':::', ':::●', '::::', ':::::'];
      return {
        char: value,
        symbol: '筒',
        color: 'text-[#4169E1] font-bold',
        bgChar: '●',
        label: `${value} Dot`,
      };
    }

    // Bamboo
    if (suit === 'b') {
      return {
        char: value === '1' ? '🦚' : value, // traditional 1 Bamboo is a sparrow/peacock
        symbol: value === '1' ? '' : '索',
        color: 'text-primary font-bold',
        bgChar: '索',
        label: `${value} Bamboo`,
      };
    }

    return { char: id.toUpperCase(), color: 'text-zinc-600', bgChar: '', label: id };
  };

  const display = getTileDisplay(tileId);

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-10 h-14 text-sm',
    md: 'w-14 h-20 text-lg',
    lg: 'w-18 h-26 text-2xl',
  };

  const basePaddingClass = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

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
            ? 'opacity-60 cursor-not-allowed border-[#1E211E]/40 bg-[#1E211E]/80 text-zinc-500'
            : active
              ? 'border-gold-leaf bg-[#FFFFF0] shadow-[0_4px_16px_rgba(197,160,33,0.3)] scale-102 z-10'
              : 'border-[#E6E6FA] bg-ivory text-surface hover:translate-y-[-2px] hover:shadow-md'
        }
        after:absolute after:bottom-[-6px] after:right-[-4px] after:-z-10
        after:w-[calc(100%+4px)] after:h-[12%] after:rounded-b-lg after:bg-primary
      `}
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Small corner index */}
      <span className="absolute top-0.5 left-1 text-[9px] font-mono opacity-50 tracking-tighter" style={{ fontSize: size === 'sm' ? '7px' : '9px' }}>
        {tileId.toUpperCase()}
      </span>

      {/* Main tile content face */}
      <div className={`flex flex-col items-center justify-center w-full h-full ${basePaddingClass[size]} mt-2`}>
        {display.char.includes('\n') ? (
          <div className="text-center text-xs sm:text-sm font-semibold tracking-tighter leading-tight font-serif whitespace-pre">
            <span className="text-zinc-700 text-[10px] block font-sans" style={{ fontSize: size === 'sm' ? '8px' : '9px' }}>{display.bgChar}</span>
            <span className={`${display.color}`}>{display.char.split('\n')[1]}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {display.char === '🦚' ? (
              <span className="text-xl sm:text-2xl leading-none">🦚</span>
            ) : (
              <span className={`${display.color} font-serif ${size === 'sm' ? 'text-xs' : 'text-base sm:text-lg'} font-bold`}>
                {display.char}
              </span>
            )}
            {display.symbol && (
              <span className="text-[10px] sm:text-xs text-zinc-500 font-serif leading-none mt-0.5">
                {display.symbol}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Subtle border indicator for authentic depth */}
      <div className="absolute inset-0.5 border border-zinc-200/50 rounded-xs pointer-events-none" />
    </Component>
  );
}
