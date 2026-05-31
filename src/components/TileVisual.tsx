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

  const getTile = (id: string) => {
    // Winds
    switch (id) {
      case 'east':  return { top: '東', tc: '#1047b0' };
      case 'south': return { top: '南', tc: '#1047b0' };
      case 'west':  return { top: '西', tc: '#1047b0' };
      case 'north': return { top: '北', tc: '#1047b0' };
      case 'red':   return { top: '中', tc: '#cc0000' };
      case 'green': return { top: '發', tc: '#006630' };
      case 'white': return { isWhite: true };
      default: break;
    }

    // Seasons: IDs are s1, s2, s3, s4
    if (id.startsWith('s')) {
      const idx = parseInt(id.substring(1), 10) - 1;
      const names = ['春', '夏', '秋', '冬'];
      const cols  = ['#cc0000', '#1047b0', '#006630', '#8B4513'];
      return { top: names[idx] || '季', tc: cols[idx] || '#333' };
    }

    // Flowers: IDs are f1, f2, f3, f4
    if (id.startsWith('f')) {
      const idx = parseInt(id.substring(1), 10) - 1;
      const names = ['梅', '蘭', '竹', '菊'];
      const cols  = ['#cc0000', '#1047b0', '#006630', '#cc6600'];
      return { top: names[idx] || '花', tc: cols[idx] || '#333' };
    }

    const val = id.substring(0, 1);
    const suit = id.substring(1);

    // Characters (萬)
    if (suit === 'w') {
      const nums = ['', '一', '二', '三', '四', '伍', '六', '七', '八', '九'];
      const n = parseInt(val, 10);
      const odd = n % 2 !== 0;
      return {
        top: nums[n], tc: odd ? '#1047b0' : '#cc0000',
        bot: '萬',    bc: odd ? '#cc0000' : '#1047b0',
      };
    }

    // Dots (筒)
    if (suit === 'd') {
      return { top: val, tc: '#1047b0', bot: '筒', bc: '#006630' };
    }

    // Bamboo (索)
    if (suit === 'b') {
      if (val === '1') return { top: '鳥', tc: '#006630' };
      return { top: val, tc: '#006630', bot: '索', bc: '#006630' };
    }

    return { top: id, tc: '#999' };
  };

  const t = getTile(tileId);

  const sz = {
    sm:  { w: 48, h: 64,  top: 20, bot: 13, shadow: 1 },
    md:  { w: 64, h: 88,  top: 30, bot: 18, shadow: 1.5 },
    lg:  { w: 80, h: 112, top: 38, bot: 22, shadow: 2 },
  }[size];

  const Component: 'div' | 'button' = as || (onClick ? 'button' : 'div');
  const componentProps = Component === 'button'
    ? { disabled, onClick, type: 'button' as const }
    : { onClick };

  // Embossing shadow to simulate carved tile depth
  const emboss = (color: string, s: number) =>
    `1px ${s}px ${s}px ${color}44, -0.5px -0.5px 0px ${color}22`;

  return (
    <Component
      id={`tile-${tileId}`}
      {...componentProps}
      style={{
        width: sz.w,
        height: sz.h,
        background: disabled
          ? '#e8e8e8'
          : active
            ? 'linear-gradient(180deg, #ffffff 0%, #f5f0e0 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f0ece0 100%)',
        borderRadius: 6,
        border: active ? '2px solid #C5A021' : '1px solid #c0b8a0',
        boxShadow: active
          ? '0 0 12px rgba(197,160,33,0.4), 0 4px 8px rgba(0,0,0,0.15)'
          : disabled
            ? 'none'
            : '0 2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        display: 'inline-flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.45 : 1,
        transform: active ? 'scale(1.05)' : 'none',
        transition: 'all 0.15s ease',
        position: 'relative' as const,
        userSelect: 'none' as const,
        fontFamily: '"Noto Serif SC", "Source Han Serif SC", "SimSun", "PMingLiU", serif',
        gap: 0,
      }}
    >
      {'isWhite' in t && t.isWhite ? (
        <div style={{
          width: sz.top * 0.85,
          height: sz.top * 1.15,
          border: `${Math.max(2, sz.shadow + 1)}px solid #1047b0`,
          borderRadius: 2,
        }} />
      ) : 'bot' in t ? (
        <>
          <span style={{
            color: t.tc,
            fontSize: sz.top,
            fontWeight: 900,
            lineHeight: 1.05,
            textShadow: emboss(t.tc, sz.shadow),
          }}>
            {t.top}
          </span>
          <span style={{
            color: t.bc,
            fontSize: sz.bot,
            fontWeight: 900,
            lineHeight: 1.05,
            textShadow: emboss(t.bc!, sz.shadow),
          }}>
            {t.bot}
          </span>
        </>
      ) : (
        <span style={{
          color: t.tc,
          fontSize: sz.top,
          fontWeight: 900,
          lineHeight: 1,
          textShadow: emboss(t.tc!, sz.shadow),
        }}>
          {t.top}
        </span>
      )}
    </Component>
  );
}
