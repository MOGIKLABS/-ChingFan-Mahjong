/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MatchSession, HandState, Meld, Language, Player, GameRecord } from '../types';
import { ALL_TILES, calculateScore } from '../utils/mahjongCalculator';
import TileVisual from './TileVisual';
import { Check, AlertTriangle, Plus, Trash2, Save } from 'lucide-react';

interface BuilderViewProps {
  session: MatchSession;
  setSession: (s: MatchSession) => void;
  language: Language;
  onNavigateToLedger: () => void;
  // Allows loading scanned states from scanner view
  externalScannedHand: HandState | null;
  clearExternalScannedHand: () => void;
}

export default function BuilderView({
  session,
  setSession,
  language,
  onNavigateToLedger,
  externalScannedHand,
  clearExternalScannedHand,
}: BuilderViewProps) {
  // Core scoring inputs
  const [winnerId, setWinnerId] = useState<string>(session.players[0]?.id || '');
  const [winType, setWinType] = useState<'self-drawn' | 'discard'>('self-drawn');
  const [loserId, setLoserId] = useState<string>(
    session.players.find(p => p.id !== (session.players[0]?.id || ''))?.id || 'self-drawn'
  );

  // Initialize hand builder state (4 melds + 1 eye + flowers)
  const [hand, setHand] = useState<HandState>({
    melds: [],
    eye: null,
    flowers: [],
    concealedHand: true,
    selfDrawn: true,
    winningTile: null,
  });

  // Editor modal state for editing a single slot
  const [editingSlot, setEditingSlot] = useState<number | 'eye' | null>(null); // 0..3 for melds, 'eye' for eye
  const [editorMeldType, setEditorMeldType] = useState<'chow' | 'pung' | 'kong'>('pung');
  const [editorSuit, setEditorSuit] = useState<'characters' | 'dots' | 'bamboo' | 'honors'>('characters');
  const [editorValue, setEditorValue] = useState<string>('1');

  // Load external scans if loaded
  useEffect(() => {
    if (externalScannedHand) {
      setHand(externalScannedHand);
      clearExternalScannedHand();
    }
  }, [externalScannedHand]);

  // Adjust selfDrawn state when winType changes
  useEffect(() => {
    setHand(prev => ({
      ...prev,
      selfDrawn: winType === 'self-drawn',
    }));
  }, [winType]);

  // Translate helpers
  const t = {
    title: language === 'zh-HK' ? '算番' : 'Score Hand',
    winner: language === 'zh-HK' ? '邊個贏？' : 'Who won?',
    winMethod: language === 'zh-HK' ? '點贏？' : 'How?',
    selfDrawn: language === 'zh-HK' ? '自摸' : 'Self-Drawn',
    discard: language === 'zh-HK' ? '食糊' : 'Discard',
    discarder: language === 'zh-HK' ? '邊個出銃？' : 'Who dealt in?',
    concealed: language === 'zh-HK' ? '門前清（冇上冇碰）' : 'Concealed (no calls)',
    meldList: language === 'zh-HK' ? '砌牌（4組 + 1對眼）' : 'Build Hand (4 sets + 1 pair)',
    flowers: language === 'zh-HK' ? '花牌' : 'Flowers',
    scoreResult: language === 'zh-HK' ? '結果' : 'Result',
    points: language === 'zh-HK' ? '分' : 'Points',
    fan: language === 'zh-HK' ? '番' : 'Fan',
    recordBtn: language === 'zh-HK' ? '記賬' : 'Record',
    configureSlot: language === 'zh-HK' ? '設定' : 'Set',
    meldBuilder: language === 'zh-HK' ? '揀牌' : 'Pick Tiles',
    apply: language === 'zh-HK' ? '確定' : 'Confirm',
    close: language === 'zh-HK' ? '取消' : 'Cancel',
    emptySlot: language === 'zh-HK' ? '撳呢度揀牌' : 'Tap to set',
    emptyEye: language === 'zh-HK' ? '撳呢度揀眼' : 'Tap to set pair',
    invalidWarn: language === 'zh-HK' ? '未砌好' : 'Incomplete hand',
  };

  // Perform calculation
  const winnerPlayer = session.players.find(p => p.id === winnerId);
  const seatWind = winnerPlayer ? winnerPlayer.seatWind : 'east';
  const calculation = calculateScore(hand, seatWind, session.prevailingWind, session.minFan);

  // Meld application logic
  const handleApplyMeld = () => {
    if (editingSlot === 'eye') {
      // Create eye pair
      let tileId = '';
      if (editorSuit === 'honors') {
        tileId = editorValue;
      } else {
        const suitSuffix = editorSuit === 'characters' ? 'w' : editorSuit === 'dots' ? 'd' : 'b';
        tileId = `${editorValue}${suitSuffix}`;
      }
      setHand(prev => ({
        ...prev,
        eye: [tileId, tileId],
      }));
    } else if (typeof editingSlot === 'number') {
      // Create standard meld (chow or pung or kong)
      const meldTiles: string[] = [];

      if (editorMeldType === 'chow') {
        const startVal = parseInt(editorValue, 10);
        // Valid ranges for chows are starting at 1..7
        const cappedVal = Math.min(7, Math.max(1, startVal));
        const suitSuffix = editorSuit === 'characters' ? 'w' : editorSuit === 'dots' ? 'd' : 'b';

        meldTiles.push(`${cappedVal}${suitSuffix}`);
        meldTiles.push(`${cappedVal + 1}${suitSuffix}`);
        meldTiles.push(`${cappedVal + 2}${suitSuffix}`);
      } else {
        // Pung / Kong creation
        let tileId = '';
        if (editorSuit === 'honors') {
          tileId = editorValue;
        } else {
          const suitSuffix = editorSuit === 'characters' ? 'w' : editorSuit === 'dots' ? 'd' : 'b';
          tileId = `${editorValue}${suitSuffix}`;
        }
        const count = editorMeldType === 'pung' ? 3 : 4;
        for (let i = 0; i < count; i++) {
          meldTiles.push(tileId);
        }
      }

      const newMeld: Meld = {
        id: `m_${Date.now()}_${editingSlot}`,
        type: editorMeldType,
        tiles: meldTiles,
        isConcealed: hand.concealedHand,
      };

      const updatedMelds = [...hand.melds];
      updatedMelds[editingSlot] = newMeld;

      setHand(prev => ({
        ...prev,
        melds: updatedMelds,
      }));
    }

    setEditingSlot(null);
  };

  // Toggle Flowers
  const toggleFlower = (id: string) => {
    setHand(prev => {
      const active = prev.flowers.includes(id);
      const updated = active
        ? prev.flowers.filter(f => f !== id)
        : [...prev.flowers, id];
      return {
        ...prev,
        flowers: updated,
      };
    });
  };

  // Clear slot helper
  const clearSlot = (slotIdx: number | 'eye') => {
    if (slotIdx === 'eye') {
      setHand(prev => ({ ...prev, eye: null }));
    } else {
      setHand(prev => {
        const updated = [...prev.melds];
        updated.splice(slotIdx, 1);
        return { ...prev, melds: updated };
      });
    }
  };

  // Record win into Ledger & rotate dealer automatically
  const handleRecordWin = () => {
    if (!calculation.isValid) return;

    // payment math:
    // scoring has exponential points e.g. 4, 8, 16 points. 
    // HK payment mechanisms:
    // 自摸 (Self-Drawn): Every player pays the points.
    // 出冲 (Discard feed): The discarder pays double, or the discarder pays the base points for everyone (standard total score payout).
    // Let's implement full HK Mahjong ledger adjustments:
    // If winner is Dealer (莊家): wins are doubled (Everyone pays Dealer double points, or Dealer earns double points).
    // Let's write the ledger entry:
    const adjustment: Record<string, number> = {};
    for (const p of session.players) {
      adjustment[p.id] = 0;
    }

    const value = calculation.points;

    if (winType === 'self-drawn') {
      // Winner earns from all 3 other players
      // Each player pays base value. If winner or payer is dealer, standard is x2.
      // Let's apply standard simple self-draw: Payer pays 'value'. If payer or winner is dealer, pays 2x!
      const isWinnerDealer = session.dealerIndex === session.players.findIndex(p => p.id === winnerId);

      let totalEarned = 0;
      session.players.forEach((p, idx) => {
        if (p.id !== winnerId) {
          const isPlayerDealer = session.dealerIndex === idx;
          const payAmount = (isWinnerDealer || isPlayerDealer) ? value * 2 : value;
          adjustment[p.id] = -payAmount;
          totalEarned += payAmount;
        }
      });
      adjustment[winnerId] = totalEarned;
    } else {
      // Discard feeding win
      // Discarder pays full amount, other two players do not play or pay nothing? 
      // In HK rules: feed chong = discarder pays whole hand. Remaining two players don't pay.
      // If winner or discarder is dealer, pays 2x!
      const isWinnerDealer = session.dealerIndex === session.players.findIndex(p => p.id === winnerId);
      const isDiscarderDealer = session.dealerIndex === session.players.findIndex(p => p.id === loserId);

      const payAmount = (isWinnerDealer || isDiscarderDealer) ? value * 2 : value;
      adjustment[loserId] = -payAmount;
      adjustment[winnerId] = payAmount;
    }

    // Apply adjustments to players chips
    const updatedPlayers = session.players.map(p => ({
      ...p,
      chips: p.chips + (adjustment[p.id] || 0),
    }));

    // Record detail translations for the ledger entry
    const timestampStr = new Date().toLocaleTimeString(language === 'en' ? 'en-GB' : 'zh-HK', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isWinnerDealer = session.dealerIndex === session.players.findIndex(p => p.id === winnerId);
    let dealerWinsDelta = 0;
    let newDealerIndex = session.dealerIndex;

    if (isWinnerDealer) {
      // Dealer win -> dealer stays as dealer and consecutive wins goes up by 1!
      dealerWinsDelta = 1;
    } else {
      // Other player wins -> dealer changes to next seat rotational order, streak resets!
      newDealerIndex = (session.dealerIndex + 1) % 4;
    }

    const record: GameRecord = {
      id: `record_${Date.now()}`,
      timestamp: timestampStr,
      winnerId,
      loserId: winType === 'self-drawn' ? 'self-drawn' : loserId,
      fan: calculation.totalFan,
      points: calculation.points,
      handNameZh: calculation.handNameZh,
      handNameEn: calculation.handNameEn,
      detailTranslations: {
        en: `${winnerPlayer?.name} won with ${calculation.handNameEn} (${calculation.totalFan} Fan, ${calculation.points} Pts) via ${winType === 'self-drawn' ? 'Self-drawn' : 'Feed'}`,
        zh: `${winnerPlayer?.name} 以 ${calculation.handNameZh} 配 ${calculation.totalFan}番 (${calculation.points}分) ${winType === 'self-drawn' ? '自摸' : '食胡'}入賬`,
      },
      payments: adjustment,
    };

    setSession({
      ...session,
      players: updatedPlayers,
      dealerIndex: newDealerIndex,
      consecutiveDealerWins: isWinnerDealer ? session.consecutiveDealerWins + dealerWinsDelta : 0,
      ledger: [record, ...session.ledger],
    });

    // Reset hand builder state on record
    setHand({
      melds: [],
      eye: null,
      flowers: [],
      concealedHand: true,
      selfDrawn: true,
      winningTile: null,
    });

    onNavigateToLedger();
  };

  return (
    <div id="builder-view" className="space-y-8">
      {/* Result - always visible at top */}
      <div className="rounded-2xl border border-gold-leaf/20 bg-[#0f3320] p-6 space-y-5">
        <h3 className="text-base font-serif font-bold text-gold-leaf">{t.scoreResult}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Fan Count */}
          <div className="bg-white/5 border border-gold-leaf/15 p-6 rounded-xl flex flex-col items-center justify-center text-center">
            {calculation.isValid ? (
              <>
                <div className="flex items-center gap-2 text-emerald-400 font-serif text-sm font-bold mb-2">
                  <Check size={18} />
                  <span>{language === 'zh-HK' ? '胡牌成立' : 'Valid Hand'}</span>
                </div>
                <div className="text-6xl font-serif font-extrabold text-gold-leaf tracking-wider mt-2">
                  {calculation.totalFan} <span className="text-2xl font-normal">{t.fan}</span>
                </div>
                <div className="text-lg font-serif text-emerald-400 font-bold mt-3">
                  {calculation.points} {language === 'zh-HK' ? '分' : 'Points'}
                </div>
                <span className="mt-2 text-sm text-ivory/70 font-serif">{calculation.handNameZh} ({calculation.totalFan}番)</span>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <AlertTriangle size={36} className="text-amber-500 mb-3" />
                  <span className="text-sm text-ivory/60 font-serif leading-relaxed">
                    {calculation.errorMsg}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Fan Breakdown */}
          <div className="bg-white/5 border border-gold-leaf/15 p-5 rounded-xl md:col-span-2 space-y-3">
            <span className="text-sm text-gold-leaf/70 block font-serif">{language === 'zh-HK' ? '番種明細' : 'Fan Breakdown'}</span>

            {calculation.isValid && calculation.breakdown.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {calculation.breakdown.map((b, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-gold-leaf/10">
                    <span className="text-ivory font-medium">{language === 'zh-HK' ? b.nameZh : b.nameEn}</span>
                    <span className="text-gold-leaf font-serif font-bold">+{b.fan} {t.fan}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-ivory/40 block py-8 text-center font-serif">
                {calculation.isValid ? (language === 'zh-HK' ? '雞糊（冇番）' : 'Chicken hand (no fan)') : (language === 'zh-HK' ? '砌好先計' : 'Complete hand to score')}
              </span>
            )}
          </div>
        </div>

        {/* Record button */}
        <div className="flex justify-end pt-3 border-t border-gold-leaf/10">
          <button
            id="builder-record-win-btn"
            disabled={!calculation.isValid}
            onClick={handleRecordWin}
            className={`
              flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-xl transition-all duration-150
              ${
                !calculation.isValid
                  ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500'
                  : 'bg-gradient-to-r from-gold-leaf via-amber-500 to-amber-600 text-surface hover:brightness-110 shadow-lg hover:shadow-xl hover:translate-y-[-1px]'
              }
            `}
          >
            <Save size={18} />
            <span>{t.recordBtn}</span>
          </button>
        </div>
      </div>

      {/* Your Hand - shows the tiles you've selected */}
      {editingSlot === null && (hand.melds.some(m => m !== null) || hand.eye) && (
        <div className="border border-gold-leaf/20 bg-[#0f3320] p-5 rounded-2xl space-y-3">
          <h3 className="text-sm font-serif font-semibold text-gold-leaf">
            {language === 'zh-HK' ? '你嘅手牌' : 'Your Hand'}
          </h3>
          <div className="flex flex-wrap gap-3 items-end">
            {hand.melds.map((meld, idx) => (
              meld && (
                <div key={`meld-${idx}`} className="flex gap-1 bg-white/5 rounded-lg p-2 border border-gold-leaf/10">
                  {meld.tiles.map((tId, tIdx) => (
                    <TileVisual key={tIdx} tileId={tId} size="sm" />
                  ))}
                </div>
              )
            ))}
            {hand.eye && (
              <div className="flex gap-1 bg-white/5 rounded-lg p-2 border border-gold-leaf/10">
                {hand.eye.map((tId, tIdx) => (
                  <TileVisual key={tIdx} tileId={tId} size="sm" />
                ))}
              </div>
            )}
          </div>
          {hand.flowers.length > 0 && (
            <div className="flex gap-1 mt-2">
              {hand.flowers.map((fId, fIdx) => (
                <TileVisual key={fIdx} tileId={fId} size="sm" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Configuration context cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gold-leaf/20 bg-[#0f3320] p-5 rounded-2xl">
        {/* Left Card: Winner Selection */}
        <div className="space-y-3">
          <label className="text-sm font-serif font-semibold text-gold-leaf">{t.winner}</label>
          <div className="grid grid-cols-4 gap-2">
            {session.players.map((p, idx) => (
              <button
                key={p.id}
                id={`builder-winner-btn-${p.id}`}
                onClick={() => {
                  setWinnerId(p.id);
                  if (loserId === p.id) {
                    const other = session.players.find(x => x.id !== p.id);
                    if (other) setLoserId(other.id);
                  }
                }}
                className={`py-2 px-1 text-xs rounded-xl font-medium border text-center transition-all ${
                  winnerId === p.id
                    ? 'bg-primary border-gold-leaf text-ivory shadow-lg'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                {p.name}
                <span className="block text-[8px] opacity-60 uppercase">
                  {p.seatWind} {session.dealerIndex === idx && '（莊）'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs text-zinc-400 font-medium">{t.winMethod}:</span>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
                <input
                  type="radio"
                  name="wintype"
                  checked={winType === 'self-drawn'}
                  onChange={() => setWinType('self-drawn')}
                  className="accent-primary"
                />
                <span>{t.selfDrawn}</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
                <input
                  type="radio"
                  name="wintype"
                  checked={winType === 'discard'}
                  onChange={() => setWinType('discard')}
                  className="accent-accent-red"
                />
                <span>{t.discard}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right card: Loser Selection for Gun/Discard */}
        <div className="space-y-3 md:border-l md:border-zinc-800 md:pl-5">
          {winType === 'discard' ? (
            <>
              <label className="text-sm font-serif font-semibold text-gold-leaf">{t.discarder}</label>
              <div className="grid grid-cols-4 gap-2">
                {session.players.map(p => (
                  <button
                    key={p.id}
                    id={`builder-loser-btn-${p.id}`}
                    disabled={p.id === winnerId}
                    onClick={() => setLoserId(p.id)}
                    className={`py-2 px-1 text-xs rounded-xl font-medium border text-center transition-all ${
                      p.id === winnerId
                        ? 'opacity-40 cursor-not-allowed border-transparent bg-zinc-900 text-zinc-600'
                        : loserId === p.id
                          ? 'bg-accent-red border-gold-leaf text-ivory shadow-lg'
                          : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col justify-center text-center p-3 text-xs text-zinc-500 font-serif leading-relaxed">
              {language === 'zh-HK' ? '自摸局面：每家均需按自摸賠率進行記賬支付。' : 'Self-drawn status is active: all other 3 players will pay the winner.'}
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hand.concealedHand}
                onChange={e => setHand(prev => ({ ...prev, concealedHand: e.target.checked }))}
                className="accent-primary"
              />
              <span>{t.concealed} (+1 {t.fan})</span>
            </label>
          </div>
        </div>
      </div>

      {/* Hand builder interface representing 4 Melds + 1 Eye */}
      <div className="border border-gold-leaf/20 bg-[#0f3320] p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-serif font-semibold text-gold-leaf">{t.meldList}</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 4 Melds slots */}
          {Array.from({ length: 4 }).map((_, idx) => {
            const m = hand.melds[idx];
            return (
              <div
                key={idx}
                className="relative border border-dashed border-gold-leaf/20 hover:bg-zinc-800/10 p-3 rounded-xl flex flex-col justify-between min-h-[140px] transition-all"
              >
                <div>
                  <span className="text-xs text-gold-leaf/60 block font-serif">{idx + 1}</span>
                  {m ? (
                    <div className="flex gap-1 mt-2 flex-wrap items-center justify-center">
                      {m.tiles.map((tId, tIdx) => (
                        <TileVisual key={tIdx} tileId={tId} size="sm" />
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600 font-serif text-center block mt-6">{t.emptySlot}</span>
                  )}
                </div>

                <div className="flex gap-1.5 mt-3 pt-2 border-t border-gold-leaf/10">
                  <button
                    onClick={() => {
                      setEditorMeldType('pung');
                      setEditorSuit('characters');
                      setEditorValue('1');
                      setEditingSlot(idx);
                    }}
                    className="flex-1 text-sm bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-gold-leaf hover:bg-zinc-700 font-medium py-2.5 rounded-lg transition-colors"
                  >
                    {t.configureSlot}
                  </button>
                  {m && (
                    <button
                      onClick={() => clearSlot(idx)}
                      className="p-1 hover:text-accent-red hover:bg-[#8B0000]/10 rounded-sm"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Eye pair slot */}
          <div className="relative border border-dashed border-gold-leaf/20 hover:bg-zinc-800/10 p-3 rounded-xl flex flex-col justify-between min-h-[140px] transition-all">
            <div>
              <span className="text-xs text-gold-leaf/60 block font-serif">{language === 'zh-HK' ? '眼' : 'Pair'}</span>
              {hand.eye ? (
                <div className="flex gap-1 mt-2 justify-center">
                  {hand.eye.map((tId, tIdx) => (
                    <TileVisual key={tIdx} tileId={tId} size="sm" />
                  ))}
                </div>
              ) : (
                <span className="text-xs text-zinc-600 font-serif text-center block mt-6">{t.emptyEye}</span>
              )}
            </div>

            <div className="flex gap-1.5 mt-3 pt-2 border-t border-gold-leaf/10">
              <button
                onClick={() => {
                  setEditorSuit('characters');
                  setEditorValue('1');
                  setEditingSlot('eye');
                }}
                className="flex-1 text-sm bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-gold-leaf hover:bg-zinc-700 font-medium py-2.5 rounded-lg transition-colors"
              >
                {t.configureSlot}
              </button>
              {hand.eye && (
                <button
                  onClick={() => clearSlot('eye')}
                  className="p-1 hover:text-accent-red hover:bg-[#8B0000]/10 rounded-sm"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Flowers selector screen */}
      <div className="border border-gold-leaf/20 bg-[#0f3320] p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-serif font-semibold text-gold-leaf">{t.flowers}</h3>

        <div className="flex flex-wrap gap-2.5 justify-center">
          {ALL_TILES.filter(t => t.suit === 'flowers' || t.suit === 'seasons').map(t => {
            const active = hand.flowers.includes(t.id);
            return (
              <button
                key={t.id}
                id={`flower-selector-${t.id}`}
                onClick={() => toggleFlower(t.id)}
                className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                  active
                    ? 'bg-white/10 border-gold-leaf text-gold-leaf shadow-sm scale-102 font-bold'
                    : 'bg-white/5 border-gold-leaf/15 text-zinc-300 hover:text-zinc-100 hover:border-gold-leaf/30'
                }`}
              >
                <div>
                  <TileVisual tileId={t.id} size="sm" active={active} />
                </div>
                <span className="text-[10px] font-medium leading-none block text-center mt-1">
                  {language === 'zh-HK' ? t.nameZh : t.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Modal Overlay for slot config */}
      {editingSlot !== null && (
        <div id="meld-builder-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md border border-gold-leaf/20 bg-[#0f3320] rounded-2xl p-6 shadow-2xl space-y-4">
            <h4 className="text-md font-serif font-bold text-gold-leaf flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Plus size={16} />
              <span>{t.meldBuilder} (Editing {editingSlot === 'eye' ? 'Eye' : `Meld ${editingSlot + 1}`})</span>
            </h4>

            {/* Select Meld Type (if editing standard meld) */}
            {editingSlot !== 'eye' && (
              <div className="space-y-1.5 animate-fadeIn">
                <span className="text-xs text-zinc-400 block font-semibold">組合類型</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['chow', 'pung', 'kong'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setEditorMeldType(type)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        editorMeldType === type
                          ? 'bg-primary text-ivory border-gold-leaf'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {type === 'chow' && (language === 'zh-HK' ? '順子 (Chow)' : 'Chow')}
                      {type === 'pung' && (language === 'zh-HK' ? '刻子 (Pung)' : 'Pung')}
                      {type === 'kong' && (language === 'zh-HK' ? '槓子 (Kong)' : 'Kong')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Select Suit */}
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 block font-semibold">花色分類</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['characters', 'dots', 'bamboo', 'honors'] as const).map(suit => {
                  // If 'chow' is selected, honors are forbidden
                  const isChowMode = editingSlot !== 'eye' && editorMeldType === 'chow';
                  const isAllowed = !(isChowMode && suit === 'honors');

                  return (
                    <button
                      key={suit}
                      disabled={!isAllowed}
                      onClick={() => {
                        setEditorSuit(suit);
                        if (suit === 'honors') {
                          setEditorValue('east');
                        } else {
                          setEditorValue('1');
                        }
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        !isAllowed
                          ? 'opacity-40 cursor-not-allowed border-zinc-800 text-zinc-650 bg-zinc-900'
                          : editorSuit === suit
                            ? 'bg-primary text-ivory border-gold-leaf'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {suit === 'characters' && (language === 'zh-HK' ? '萬子' : 'Man')}
                      {suit === 'dots' && (language === 'zh-HK' ? '筒子' : 'Dot')}
                      {suit === 'bamboo' && (language === 'zh-HK' ? '索子' : 'Bamboo')}
                      {suit === 'honors' && (language === 'zh-HK' ? '字牌' : 'Honours')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Tile value depending on suit */}
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 block font-semibold">選擇牌面</span>

              {editorSuit === 'honors' ? (
                // Honors subset
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'east', nameZh: '東', nameEn: 'East' },
                    { id: 'south', nameZh: '南', nameEn: 'South' },
                    { id: 'west', nameZh: '西', nameEn: 'West' },
                    { id: 'north', nameZh: '北', nameEn: 'North' },
                    { id: 'red', nameZh: '中', nameEn: 'Red' },
                    { id: 'green', nameZh: '發', nameEn: 'Green' },
                    { id: 'white', nameZh: '白', nameEn: 'White' },
                  ].map(h => (
                    <button
                      key={h.id}
                      onClick={() => setEditorValue(h.id)}
                      className={`py-2 text-xs font-serif font-bold rounded-lg border transition-colors ${
                        editorValue === h.id
                          ? 'bg-gold-leaf text-surface border-gold-leaf shadow-sm scale-102'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-zinc-100'
                      }`}
                    >
                      {language === 'zh-HK' ? h.nameZh : h.nameEn}
                    </button>
                  ))}
                </div>
              ) : (
                // Suit numbers 1..9 (with 1-7 cap if chow)
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const val = `${idx + 1}`;
                    const isChowMode = editingSlot !== 'eye' && editorMeldType === 'chow';
                    const isAllowed = !(isChowMode && idx > 6); // can't start chow on 8 or 9

                    return (
                      <button
                        key={val}
                        disabled={!isAllowed}
                        onClick={() => setEditorValue(val)}
                        className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                          !isAllowed
                            ? 'opacity-30 cursor-not-allowed border-zinc-800 text-zinc-650 bg-zinc-900'
                            : editorValue === val
                              ? 'bg-gold-leaf text-surface border-gold-leaf shadow-sm scale-102'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-zinc-100'
                        }`}
                      >
                        {val}
                        {isChowMode && <span className="block text-[8px] font-serif font-normal text-zinc-90 w-full truncate">{val}-{idx+2}-{idx+3}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions modal bar */}
            <div className="flex gap-2 pt-4 border-t border-gold-leaf/10 justify-end">
              <button
                onClick={() => setEditingSlot(null)}
                className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-350 text-xs font-semibold rounded-lg"
              >
                {t.close}
              </button>

              <button
                onClick={handleApplyMeld}
                className="px-5 py-2 bg-[#004d00] hover:bg-[#005a00] border border-gold-leaf/30 text-ivory text-xs font-bold rounded-lg shadow-md"
              >
                {t.apply}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
