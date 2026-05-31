/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GLOSSARY_HANDS } from '../utils/mahjongCalculator';
import { Language } from '../types';
import TileVisual from './TileVisual';
import { BookOpen } from 'lucide-react';

interface GlossaryViewProps {
  language: Language;
}

export default function GlossaryView({ language }: GlossaryViewProps) {
  const t = {
    title: language === 'zh-HK' ? '「麻雀大典」番種指南 (Glossary)' : "The Scholar's Guide (Glossary)",
    subtitle: language === 'zh-HK' ? '學習經典港式胡牌組合與番數，助你快速胡大牌！' : 'Study traditional Hong Kong Mahjong patterns, names, phonetics, and scoring guidelines.',
    fan: language === 'zh-HK' ? '番' : 'Fan',
    exampleLabel: language === 'zh-HK' ? '牌型範例：' : 'Layout Example:',
  };

  return (
    <div id="glossary-view" className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
        <h2 className="text-2xl font-serif font-bold text-gold-leaf flex items-center justify-center gap-2">
          <BookOpen className="text-gold-leaf" />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs text-zinc-400 font-serif leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GLOSSARY_HANDS.map(g => (
          <div
            key={g.id}
            id={`glossary-card-${g.id}`}
            className="border border-zinc-800 bg-[#121412] hover:border-gold-leaf/30 rounded-2xl p-5 space-y-4 transition-all hover:translate-y-[-1px]"
          >
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-serif font-bold text-ivory">
                    {language === 'zh-HK' ? g.nameZh : g.nameEn}
                  </span>
                  {language === 'en' && (
                    <span className="text-xs text-zinc-400 italic">({g.nameZh})</span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 block leading-tight mt-1">
                  Cantonese Phonetic: <strong className="text-gold-leaf">{g.phonetic}</strong>
                </span>
              </div>

              <div className="bg-primary/20 border border-primary/30 text-gold-leaf text-xs font-serif font-bold px-3 py-1 rounded-full shrink-0">
                {g.fan} {t.fan}
              </div>
            </div>

            <p className="text-xs text-zinc-350 leading-relaxed font-serif">
              {language === 'zh-HK' ? g.descriptionZh : g.descriptionEn}
            </p>

            <div className="space-y-2 pt-1 border-t border-zinc-850/30">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">{t.exampleLabel}</span>
              <div className="flex flex-wrap gap-1 leading-none p-1.5 bg-surface/40 rounded-xl justify-center">
                {g.exampleTiles.map((tId, idx) => (
                  <TileVisual key={idx} tileId={tId} size="sm" disabled={true} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
