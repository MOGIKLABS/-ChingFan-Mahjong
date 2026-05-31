/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MatchSession, Language, GameRecord } from '../types';
import { ScrollText, Trash2 } from 'lucide-react';

interface LedgerViewProps {
  session: MatchSession;
  setSession: (s: MatchSession) => void;
  language: Language;
}

export default function LedgerView({
  session,
  setSession,
  language,
}: LedgerViewProps) {
  const t = {
    title: language === 'zh-HK' ? '「清番」賬簿明細 (Recap Ledger)' : 'The Ledger (Recap Logs)',
    subtitle: language === 'zh-HK' ? '詳細記錄每一局的胡牌收付、番數，隨時稽核雅座賬目！' : 'Audit match histories, chip transfers, and cumulative session balances in detail.',
    emptyLogs: language === 'zh-HK' ? '暫無記賬記錄，開局大吉！' : 'No recorded transactions. Good luck at the table!',
    winner: language === 'zh-HK' ? '獲勝' : 'Winner Story',
    points: language === 'zh-HK' ? '分' : 'Pts',
    fan: language === 'zh-HK' ? '番' : 'Fan',
    clearLedger: language === 'zh-HK' ? '清空賬目 (保留雀友)' : 'Clear Logs Only',
    payoutMath: language === 'zh-HK' ? '賬面收付結算：' : 'Payout Balance Adjustments:',
    selfDrawn: language === 'zh-HK' ? '自摸' : 'Self-drawn',
    discardFeed: language === 'zh-HK' ? '出冲' : 'Discard Feed',
  };

  const handleClearLedger = () => {
    // Confirm via simple react states (avoiding blocking alerts)
    if (window.confirm(language === 'zh-HK' ? '確定要清空本桌的所有記賬及贏分記錄嗎？這不會更改雀友名字。' : 'Wipe all transaction history? Player scores will stay but historical audit lists will remove.')) {
      setSession({
        ...session,
        ledger: [],
      });
    }
  };

  return (
    <div id="ledger-view" className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
        <h2 className="text-2xl font-serif font-bold text-gold-leaf flex items-center justify-center gap-2">
          <ScrollText className="text-gold-leaf" />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs text-zinc-400 font-serif leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {session.ledger.length > 0 && (
        <div className="flex justify-end pr-1">
          <button
            id="btn-clear-ledger-logs"
            onClick={handleClearLedger}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-accent-red/30 bg-accent-red/10 text-[#FF6347] text-xs font-semibold rounded-lg hover:bg-accent-red/20 transition-all active:scale-95"
          >
            <Trash2 size={13} />
            <span>{t.clearLedger}</span>
          </button>
        </div>
      )}

      <div className="space-y-4">
        {session.ledger.length > 0 ? (
          session.ledger.map((log: GameRecord) => {
            const winner = session.players.find(p => p.id === log.winnerId);
            const isSelfDrawn = log.loserId === 'self-drawn';

            return (
              <div
                key={log.id}
                id={`ledger-entry-${log.id}`}
                className="border border-zinc-850/80 bg-[#121412] rounded-2xl p-5 space-y-4 animate-fadeIn"
              >
                {/* Header info */}
                <div className="flex justify-between items-start border-b border-zinc-800/50 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] text-emerald-400 font-serif font-bold shrink-0">
                      W
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-ivory">
                        {winner ? winner.name : 'Discarder'} {t.winner}
                      </div>
                      <span className="text-[10px] text-zinc-550 block font-mono">
                        Rule: {isSelfDrawn ? t.selfDrawn : t.discardFeed} • {log.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-gold-leaf font-serif text-sm font-extrabold block">
                      {log.fan} {t.fan} / {log.points} {t.points}
                    </span>
                    <span className="text-[10px] text-zinc-450 font-serif">
                      {language === 'zh-HK' ? log.handNameZh : log.handNameEn}
                    </span>
                  </div>
                </div>

                {/* Log Description text */}
                <p className="text-xs text-zinc-300 font-serif py-1 italic border-l-2 border-gold-leaf/40 pl-3 leading-relaxed">
                  {language === 'zh-HK' ? log.detailTranslations.zh : log.detailTranslations.en}
                </p>

                {/* Payments transfers list */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                    {t.payoutMath}
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {session.players.map(p => {
                      const payAmt = log.payments[p.id] || 0;
                      return (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                            payAmt > 0
                              ? 'bg-primary/15 border-primary/25 text-emerald-400'
                              : payAmt < 0
                                ? 'bg-accent-red/10 border-accent-red/20 text-[#FF6347]'
                                : 'bg-zinc-800/10 border-zinc-800 text-zinc-500'
                          }`}
                        >
                          <span className="truncate max-w-[60px] font-sans font-medium text-zinc-400">{p.name}</span>
                          <span className="font-bold">
                            {payAmt > 0 ? `+${payAmt}` : payAmt === 0 ? '0' : payAmt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="border border-zinc-800/60 bg-surface/30 rounded-2xl py-16 text-center text-zinc-550 font-serif text-xs">
            {t.emptyLogs}
          </div>
        )}
      </div>
    </div>
  );
}
