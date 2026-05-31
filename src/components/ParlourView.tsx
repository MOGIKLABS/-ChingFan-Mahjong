/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MatchSession, Player, Language } from '../types';
import { Settings2, Plus, Minus, TrendingUp } from 'lucide-react';

interface ParlourViewProps {
  session: MatchSession;
  setSession: (s: MatchSession) => void;
  language: Language;
  onNavigateToBuilder: () => void;
}

export default function ParlourView({
  session,
  setSession,
  language,
  onNavigateToBuilder,
}: ParlourViewProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [editingPlayers, setEditingPlayers] = useState<Player[]>(session.players);

  const t = {
    tableName: language === 'zh-HK' ? '「東風雅座」牌局' : 'Heritage Table',
    setupTitle: language === 'zh-HK' ? '雅座牌局設定' : 'Heritage Configuration',
    roundWind: language === 'zh-HK' ? '圈風 (場風)' : 'Prevailing Wind',
    dealer: language === 'zh-HK' ? '莊家' : 'Dealer',
    consecutiveDealer: language === 'zh-HK' ? '連莊數' : 'Dealer Streak',
    minFan: language === 'zh-HK' ? '起胡番數 (門檻)' : 'Minimum House Fan',
    playersLabel: language === 'zh-HK' ? '雀友名單' : 'Players Register',
    startingChips: language === 'zh-HK' ? '起始籌碼' : 'Initial Chips/Points',
    saveSetup: language === 'zh-HK' ? '開局 / 保存設定' : 'Lock Setup / Save',
    activeTable: language === 'zh-HK' ? '私房牌局' : 'Active Parlour Round',
    recapLabel: language === 'zh-HK' ? '雅局籌碼分布' : 'Chips Balance Sheets',
    quickAction: language === 'zh-HK' ? '前往算分' : 'Open Scorer',
    cantOn: language === 'zh-HK' ? '本局最低起胡：' : 'Min House Rule: ',
    fanLabel: language === 'zh-HK' ? '番' : 'Fan',
    dealerMark: language === 'zh-HK' ? '莊' : 'D',
  };

  const handleSaveConfig = () => {
    setSession({
      ...session,
      players: editingPlayers,
    });
    setShowConfig(false);
  };

  const updatePlayerName = (idx: number, val: string) => {
    const list = [...editingPlayers];
    list[idx] = { ...list[idx], name: val };
    setEditingPlayers(list);
  };

  const updatePlayerChips = (idx: number, delta: number) => {
    const list = [...editingPlayers];
    list[idx] = { ...list[idx], chips: Math.max(0, list[idx].chips + delta) };
    setEditingPlayers(list);
  };

  const changePrevailingWind = (w: 'east' | 'south' | 'west' | 'north') => {
    setSession({ ...session, prevailingWind: w });
  };

  const setDealer = (idx: number) => {
    setSession({
      ...session,
      dealerIndex: idx,
      consecutiveDealerWins: 0, // reset on dealer swap
    });
  };

  const changeConsecWins = (amount: number) => {
    setSession({
      ...session,
      consecutiveDealerWins: Math.max(0, session.consecutiveDealerWins + amount),
    });
  };

  const changeMinFan = (amount: number) => {
    setSession({
      ...session,
      minFan: Math.max(1, Math.min(13, session.minFan + amount)),
    });
  };

  // Identify who is dealer
  const activeDealer = session.players[session.dealerIndex];

  return (
    <div id="parlour-view" className="space-y-6">
      {/* Overview Card with dynamic Felt background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a2f0a] via-[#004d00] to-[#043404] p-6 shadow-2xl border border-gold-leaf/30">
        {/* Visual elements */}
        <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full border border-gold-leaf/10 bg-gradient-to-br from-gold-leaf/5 to-transparent" />
        <div className="absolute left-[-20px] bottom-[-20px] h-32 w-32 rounded-full border border-primary/20 bg-primary/10" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest font-mono text-gold-leaf">
                {t.activeTable}
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-ivory flex items-center gap-2">
              {t.tableName}
            </h2>
            <p className="text-sm text-emerald-100/70 mt-1 max-w-md">
              {t.cantOn} <strong className="text-gold-leaf">{session.minFan} {t.fanLabel}</strong>. {language === 'zh-HK' ? '此番數以下為自摸/食糊不予算分' : 'Hands scoring below this are invalid and pay zero.'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              id="btn-toggle-config"
              onClick={() => {
                setEditingPlayers(session.players);
                setShowConfig(!showConfig);
              }}
              className="flex items-center gap-2 border border-gold-leaf/30 bg-surface/50 text-gold-leaf px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-surface/80 transition-all duration-150"
            >
              <Settings2 size={16} />
              <span>{showConfig ? (language === 'zh-HK' ? '關閉面板' : 'Close Settings') : t.setupTitle}</span>
            </button>

            <button
              id="btn-quick-scorer"
              onClick={onNavigateToBuilder}
              className="flex items-center gap-2 bg-gradient-to-r from-gold-leaf to-amber-500 text-surface font-semibold px-5 py-2.5 rounded-xl text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all duration-150"
            >
              <TrendingUp size={16} />
              <span>{t.quickAction}</span>
            </button>
          </div>
        </div>

        {/* Dynamic game setup counters bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gold-leaf/10 text-ivory">
          <div className="bg-surface/30 rounded-xl p-3 border border-gold-leaf/5">
            <span className="text-[10px] text-emerald-100/60 uppercase block font-mono">{t.roundWind}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-serif text-gold-leaf">
                {session.prevailingWind === 'east' && '東圈 (East)'}
                {session.prevailingWind === 'south' && '南圈 (South)'}
                {session.prevailingWind === 'west' && '西圈 (West)'}
                {session.prevailingWind === 'north' && '北圈 (North)'}
              </span>
            </div>
          </div>

          <div className="bg-surface/30 rounded-xl p-3 border border-gold-leaf/5">
            <span className="text-[10px] text-emerald-100/60 uppercase block font-mono">Current {t.dealer}</span>
            <span className="text-lg font-serif text-ivory block mt-1">
              {activeDealer ? activeDealer.name : 'Unknown'}
            </span>
          </div>

          <div className="bg-surface/30 rounded-xl p-3 border border-gold-leaf/5">
            <span className="text-[10px] text-emerald-100/60 uppercase block font-mono">{t.consecutiveDealer}</span>
            <span className="text-lg font-serif text-gold-leaf block mt-1 font-semibold">
              {session.consecutiveDealerWins} x
            </span>
          </div>

          <div className="bg-surface/30 rounded-xl p-3 border border-gold-leaf/5">
            <span className="text-[10px] text-emerald-100/60 uppercase block font-mono">House Minimum</span>
            <span className="text-lg font-serif text-ivory block mt-1 font-semibold">
              {session.minFan} {t.fanLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Settings configuration form */}
      {showConfig && (
        <div id="parlour-settings-panel" className="rounded-2xl border border-zinc-800 bg-[#1E211E] p-6 space-y-6 animate-fadeIn">
          <h3 className="text-lg font-serif font-bold text-gold-leaf flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Settings2 size={18} />
            <span>{t.setupTitle}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Col: Match Rules */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{language === 'zh-HK' ? '本局規則與莊位' : 'Match Rules & Dealers'}</h4>

              {/* Prevailing Wind */}
              <div>
                <label className="text-xs text-zinc-300 block mb-2">{t.roundWind}</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['east', 'south', 'west', 'north'] as const).map(w => (
                    <button
                      key={w}
                      id={`wind-selector-${w}`}
                      onClick={() => changePrevailingWind(w)}
                      className={`py-2 rounded-xl text-sm font-serif font-bold border transition-colors ${
                        session.prevailingWind === w
                          ? 'bg-primary text-ivory border-gold-leaf'
                          : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {w === 'east' && '東'}
                      {w === 'south' && '南'}
                      {w === 'west' && '西'}
                      {w === 'north' && '北'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dealer Position */}
              <div>
                <label className="text-xs text-zinc-300 block mb-2">{language === 'zh-HK' ? '設定當前莊家' : 'Appoint Current Dealer'}</label>
                <div className="grid grid-cols-4 gap-2">
                  {session.players.map((p, idx) => (
                    <button
                      key={p.id}
                      id={`dealer-btn-${p.id}`}
                      onClick={() => setDealer(idx)}
                      className={`py-2 px-1 text-xs font-medium rounded-xl border transition-colors truncate ${
                        session.dealerIndex === idx
                          ? 'bg-accent-red text-ivory border-gold-leaf'
                          : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Fan & Streak */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1.5">{t.minFan}</label>
                  <div className="flex items-center gap-2">
                    <button
                      id="minfan-minus"
                      onClick={() => changeMinFan(-1)}
                      className="p-1.5 bg-zinc-800 border border-zinc-700 hover:border-gold-leaf rounded-lg text-zinc-300"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-mono text-sm w-8 text-center text-ivory font-semibold">{session.minFan}</span>
                    <button
                      id="minfan-plus"
                      onClick={() => changeMinFan(1)}
                      className="p-1.5 bg-zinc-800 border border-zinc-700 hover:border-gold-leaf rounded-lg text-zinc-300"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1.5">{t.consecutiveDealer}</label>
                  <div className="flex items-center gap-2">
                    <button
                      id="streaks-minus"
                      onClick={() => changeConsecWins(-1)}
                      className="p-1.5 bg-zinc-800 border border-zinc-700 hover:border-gold-leaf rounded-lg text-zinc-300"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-mono text-sm w-8 text-center text-ivory font-semibold">
                      {session.consecutiveDealerWins}
                    </span>
                    <button
                      id="streaks-plus"
                      onClick={() => changeConsecWins(1)}
                      className="p-1.5 bg-zinc-800 border border-zinc-700 hover:border-gold-leaf rounded-lg text-zinc-300"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Player Register */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{t.playersLabel}</h4>

              <div className="space-y-3">
                {editingPlayers.map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-3 bg-zinc-800/40 border border-zinc-800 p-2.5 rounded-xl">
                    <div className="flex items-center h-8 w-8 justify-center rounded-lg bg-zinc-800 shrink-0 font-serif font-bold text-gold-leaf border border-gold-leaf/10 text-xs">
                      {p.seatWind === 'east' && '東'}
                      {p.seatWind === 'south' && '南'}
                      {p.seatWind === 'west' && '西'}
                      {p.seatWind === 'north' && '北'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        id={`player-input-${p.id}`}
                        value={p.name}
                        onChange={e => updatePlayerName(idx, e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-gold-leaf focus:outline-none text-zinc-200 text-sm py-0.5"
                        placeholder="雀友名稱"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updatePlayerChips(idx, -10)}
                        className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-sm"
                      >
                        -10
                      </button>
                      <span className="font-mono text-xs w-14 text-right text-gold-leaf/90 font-medium">
                        {p.chips} pts
                      </span>
                      <button
                        onClick={() => updatePlayerChips(idx, 10)}
                        className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-sm"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-zinc-800">
            <button
              id="settings-save-btn"
              onClick={handleSaveConfig}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-emerald-800 border border-gold-leaf/30 hover:brightness-110 active:scale-98 transition-all text-ivory text-xs font-semibold rounded-xl"
            >
              {t.saveSetup}
            </button>
          </div>
        </div>
      )}

      {/* Parlour Seat map layout */}
      <div className="border border-zinc-800 bg-surface/40 rounded-2xl p-6">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-6">{language === 'zh-HK' ? '雀桌形勢 (座次分布)' : 'Felt Map (Play Seats)'}</h3>

        <div className="flex justify-center items-center py-6">
          <div className="relative w-72 h-72 border border-gold-leaf/20 bg-gradient-to-br from-[#1b3f1b] to-[#043404] rounded-2xl shadow-xl flex items-center justify-center">
            {/* Core Prevailing wind compass */}
            <div className="w-24 h-24 rounded-full bg-surface border border-gold-leaf/30 shadow-inner flex flex-col items-center justify-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Wind</span>
              <span className="text-2xl font-serif font-extrabold text-gold-leaf animate-pulse">
                {session.prevailingWind === 'east' && '東'}
                {session.prevailingWind === 'south' && '南'}
                {session.prevailingWind === 'west' && '西'}
                {session.prevailingWind === 'north' && '北'}
              </span>
              <span className="text-[9px] text-zinc-400 font-serif">
                {session.prevailingWind === 'east' && 'East Round'}
                {session.prevailingWind === 'south' && 'South Round'}
                {session.prevailingWind === 'west' && 'West Round'}
                {session.prevailingWind === 'north' && 'North Round'}
              </span>
            </div>

            {/* Players positions placed around card board */}
            {session.players.map((p, idx) => {
              // Placed top (North), right (East), bottom (South), left (West)
              // Note HK mahjong coordinates: East is usually Dealer, sitting relative.
              // Let's place based on index: 0 = East (Right), 1 = South (Bottom), 2 = West (Left), 3 = North (Top)
              const positions = [
                'absolute right-2 top-[calc(50%-44px)] flex flex-col items-end',  // East
                'absolute bottom-2 left-[calc(50%-60px)] flex flex-col items-center', // South
                'absolute left-2 top-[calc(50%-44px)] flex flex-col items-start',     // West
                'absolute top-2 left-[calc(50%-60px)] flex flex-col items-center',    // North
              ];

              const windLabels = { east: '東', south: '南', west: '西', north: '北' };

              return (
                <div key={p.id} className={`${positions[idx]} w-28 text-center bg-surface/90 border border-zinc-800 p-2 rounded-xl transition-all`}>
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    <span className={`inline-flex items-center justify-center rounded-sm text-[10px] font-bold h-4 w-4 ${
                      session.dealerIndex === idx 
                        ? 'bg-accent-red text-ivory border border-gold-leaf/30' 
                        : 'bg-zinc-800 text-gold-leaf'
                    }`}>
                      {windLabels[p.seatWind]}
                    </span>
                    <span className="text-xs text-zinc-100 font-semibold truncate max-w-[80px]">{p.name}</span>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-400 font-medium">
                    {p.chips} pts
                  </div>

                  {session.dealerIndex === idx && (
                    <span className="mt-1 text-[9px] font-serif tracking-widest text-[#FFF5EE] bg-[#B22222] px-1 py-0.5 rounded-xs scale-90">
                      {t.dealer.toUpperCase()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recap & Logs section */}
      <div className="rounded-2xl border border-zinc-800 bg-[#121412] p-5 space-y-4">
        <h3 className="text-sm font-serif font-bold text-gold-leaf flex items-center gap-2 border-b border-zinc-800 pb-3">
          <TrendingUp size={16} />
          <span>{t.recapLabel}</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {session.players.map(p => {
            const winsCount = session.ledger.filter(l => l.winnerId === p.id).length;
            const lossesCount = session.ledger.filter(l => l.loserId === p.id).length;

            return (
              <div key={p.id} className="bg-zinc-800/20 border border-zinc-800/80 rounded-xl p-3 text-center">
                <span className="text-xs text-zinc-400 block font-semibold">{p.name}</span>
                <span className="text-xl font-mono text-gold-leaf font-bold mt-1.5 block">{p.chips} pts</span>
                <div className="grid grid-cols-2 text-[10px] text-zinc-500 font-mono mt-2 pt-2 border-t border-zinc-800/50">
                  <span>Wins: <strong className="text-emerald-500">{winsCount}</strong></span>
                  <span>Pays: <strong className="text-accent-red/90">{lossesCount}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
