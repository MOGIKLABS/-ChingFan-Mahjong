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

    if (id.startsWith('s')) {
      const idx = parseInt(id.substring(1), 10) - 1;
      const names = ['春', '夏', '秋', '冬'];
      const cols  = ['#cc0000', '#1047b0', '#006630', '#8B4513'];
      return { top: names[idx] || '季', tc: cols[idx] || '#333' };
    }

    if (id.startsWith('f')) {
      const idx = parseInt(id.substring(1), 10) - 1;
      const names = ['梅', '蘭', '竹', '菊'];
      const cols  = ['#cc0000', '#1047b0', '#006630', '#cc6600'];
      return { top: names[idx] || '花', tc: cols[idx] || '#333' };
    }

    const val = id.substring(0, 1);
    const suit = id.substring(1);

    if (suit === 'w') {
      const nums = ['', '一', '二', '三', '四', '伍', '六', '七', '八', '九'];
      const n = parseInt(val, 10);
      const odd = n % 2 !== 0;
      return {
        top: nums[n], tc: odd ? '#1047b0' : '#cc0000',
        bot: '萬',    bc: odd ? '#cc0000' : '#1047b0',
      };
    }

    if (suit === 'd') {
      return { top: val, tc: '#1047b0', bot: '筒', bc: '#006630' };
    }

    if (suit === 'b') {
      if (val === '1') return { top: '鳥', tc: '#006630' };
      return { top: val, tc: '#006630', bot: '索', bc: '#006630' };
    }

    return { top: id, tc: '#999' };
  };

  const t = getTile(tileId);

  // All sizes bumped for 55+ accessibility
  const sz = {
    sm:  { w: 60, h: 82,  top: 28, bot: 17, shadow: 1.5, whiteOuter: [32, 44], whiteInner: [22, 34] },
    md:  { w: 74, h: 100, top: 36, bot: 22, shadow: 2,   whiteOuter: [40, 54], whiteInner: [28, 42] },
    lg:  { w: 90, h: 120, top: 44, bot: 26, shadow: 2.5, whiteOuter: [48, 66], whiteInner: [36, 54] },
  }[size];

  const Component: 'div' | 'button' = as || (onClick ? 'button' : 'div');
  const componentProps = Component === 'button'
    ? { disabled, onClick, type: 'button' as const }
    : { onClick };

  const emboss = (color: string, s: number) =>
    `1px ${s}px ${s + 0.5}px ${color}55, -0.5px -0.5px 0px ${color}22, 0 0 ${s}px ${color}18`;

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
            ? 'linear-gradient(175deg, #ffffff 0%, #f5eed8 100%)'
            : 'linear-gradient(175deg, #ffffff 0%, #f2ecda 100%)',
        borderRadius: 7,
        border: active ? '2.5px solid #C5A021' : '1px solid #bbb49a',
        boxShadow: active
          ? '0 0 14px rgba(197,160,33,0.45), 0 4px 10px rgba(0,0,0,0.15)'
          : disabled
            ? 'none'
            : '0 2px 3px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        display: 'inline-flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.45 : 1,
        transform: active ? 'scale(1.06)' : 'none',
        transition: 'all 0.15s ease',
        userSelect: 'none' as const,
        fontFamily: '"Noto Serif SC", "Source Han Serif SC", "SimSun", "PMingLiU", serif',
        gap: 0,
        flexShrink: 0,
      }}
    >
      {'isWhite' in t && t.isWhite ? (
        /* White Dragon: double-nested blue rectangle matching physical tile */
        <div style={{
          width: sz.whiteOuter[0],
          height: sz.whiteOuter[1],
          border: '3px solid #1047b0',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '1px 2px 3px rgba(16,71,176,0.25)',
        }}>
          <div style={{
            width: sz.whiteInner[0],
            height: sz.whiteInner[1],
            border: '2px solid #1047b0',
            borderRadius: 2,
          }} />
        </div>
      ) : 'bot' in t ? (
        <>
          <span style={{
            color: t.tc,
            fontSize: sz.top,
            fontWeight: 900,
            lineHeight: 1.0,
            textShadow: emboss(t.tc, sz.shadow),
            letterSpacing: '-0.02em',
          }}>
            {t.top}
          </span>
          <span style={{
            color: t.bc,
            fontSize: sz.bot,
            fontWeight: 900,
            lineHeight: 1.0,
            textShadow: emboss(t.bc!, sz.shadow),
            letterSpacing: '-0.02em',
          }}>
            {t.bot}
          </span>
        </>
      ) : (
        <span style={{
          color: t.tc,
          fontSize: sz.top * 1.15,
          fontWeight: 900,
          lineHeight: 1,
          textShadow: emboss(t.tc!, sz.shadow),
          letterSpacing: '-0.02em',
        }}>
          {t.top}
        </span>
      )}
    </Component>
  );
}
