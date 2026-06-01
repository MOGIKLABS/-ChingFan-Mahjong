/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language } from '../types';
import { RefreshCw, Languages, Trophy, Camera } from 'lucide-react';

interface TopAppBarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  title: string;
  onResetSession?: () => void;
  prevailingWind?: string;
  consecutiveWins?: number;
  onCameraPress?: () => void;
}

export default function TopAppBar({
  language,
  setLanguage,
  title,
  onResetSession,
  prevailingWind = 'east',
  consecutiveWins = 0,
  onCameraPress,
}: TopAppBarProps) {
  const getWindName = (wind: string) => {
    const winds = {
      east: { en: 'East Round', zh: '東圈' },
      south: { en: 'South Round', zh: '南圈' },
      west: { en: 'West Round', zh: '西圈' },
      north: { en: 'North Round', zh: '北圈' },
    };
    return winds[wind as keyof typeof winds] || { en: 'East Round', zh: '東圈' };
  };

  const windInfo = getWindName(prevailingWind);

  return (
    <header id="top-app-bar" className="sticky top-0 z-50 w-full border-b border-gold-leaf/20 bg-surface/95 backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand/Branding logo */}
        <div className="flex items-center gap-3">
          <img
            src="/chingfanlogo.png"
            alt="ChingFan"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-xl font-serif font-extrabold text-gold-leaf tracking-wider">
              {language === 'zh-HK' ? '「清番」' : 'ChingFan'}
            </h1>
            <p className="text-[10px] font-sans tracking-widest text-zinc-400 uppercase">
              {language === 'zh-HK' ? '港式麻雀計算機' : 'HK Mahjong Calculator'}
            </p>
          </div>
        </div>

        {/* Centre: Wind status + Camera */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs text-zinc-300 font-serif">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === 'zh-HK' ? windInfo.zh : windInfo.en}</span>
          </div>
          {consecutiveWins > 0 && (
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent-red/20 border border-accent-red/30 px-3 py-1 text-xs text-gold-leaf font-serif">
              <Trophy size={12} className="text-gold-leaf" />
              <span>
                {language === 'zh-HK' ? `連${consecutiveWins}莊` : `${consecutiveWins}x Dealer`}
              </span>
            </div>
          )}
          {onCameraPress && (
            <button
              onClick={onCameraPress}
              title={language === 'zh-HK' ? '掃描牌面' : 'Scan tiles'}
              className="p-3 text-gold-leaf bg-primary/30 border-2 border-gold-leaf/40 hover:border-gold-leaf hover:bg-primary/50 rounded-full transition-all duration-150 shadow-md hover:shadow-lg"
            >
              <Camera size={28} />
            </button>
          )}
        </div>

        {/* Actions bar (Language picker + reset option) */}
        <div className="flex items-center gap-2">
          {onResetSession && (
            <button
              id="btn-reset-session"
              onClick={onResetSession}
              title={language === 'zh-HK' ? '重置牌局' : 'Reset Table Session'}
              className="p-1.5 text-zinc-400 hover:text-gold-leaf hover:bg-zinc-800/60 rounded-lg transition-colors duration-150"
            >
              <RefreshCw size={18} />
            </button>
          )}

          <button
            id="btn-toggle-language"
            onClick={() => setLanguage(language === 'en' ? 'zh-HK' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-gold-leaf hover:bg-zinc-800/80 rounded-lg text-xs font-mono tracking-tight transition-all duration-150"
          >
            <Languages size={14} className="text-gold-leaf" />
            <span>{language === 'en' ? '繁中' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
