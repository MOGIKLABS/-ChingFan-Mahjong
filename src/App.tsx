/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, MatchSession, HandState } from './types';
import TopAppBar from './components/TopAppBar';
import ParlourView from './components/ParlourView';
import BuilderView from './components/BuilderView';
import InspectorView from './components/InspectorView';
import GlossaryView from './components/GlossaryView';
import LedgerView from './components/LedgerView';
import { LayoutDashboard, Hammer, Eye, Compass, History } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'chingfan_session_v1';

const DEFAULT_SESSION: MatchSession = {
  id: 'session_default',
  title: '東風雅座 (Royal Parlour Match)',
  date: new Date().toLocaleDateString(),
  prevailingWind: 'east',
  dealerIndex: 0,
  consecutiveDealerWins: 0,
  minFan: 3,
  players: [
    { id: 'p_east', name: '大東家 (A-East)', seatWind: 'east', chips: 1000 },
    { id: 'p_south', name: '小南家 (B-South)', seatWind: 'south', chips: 1000 },
    { id: 'p_west', name: '阿西風 (C-West)', seatWind: 'west', chips: 1000 },
    { id: 'p_north', name: '老北家 (D-North)', seatWind: 'north', chips: 1000 },
  ],
  ledger: [],
};

export default function App() {
  const [language, setLanguage] = useState<Language>('zh-HK');
  const [activeTab, setActiveTab] = useState<'parlour' | 'builder' | 'inspector' | 'glossary' | 'ledger'>('builder');
  const [session, setSession] = useState<MatchSession>(DEFAULT_SESSION);

  // A buffer to hold newly scanned mahjong layout, which gets loaded into Scorer directly
  const [scannedHandBuffer, setScannedHandBuffer] = useState<HandState | null>(null);

  // 1. Initial State Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing saved ChingFan session from localStorage:', err);
      }
    }
  }, []);

  // 2. Persist State updates to LocalStorage
  const handleUpdateSession = (newSession: MatchSession) => {
    setSession(newSession);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSession));
  };

  const handleResetSession = () => {
    if (window.confirm(language === 'zh-HK' ? '警告：確定要清空記賬並將雀友籌碼重置為 1000 點起點嗎？' : 'Are you sure you want to completely clear the ledger logs and reset everyone to 1,000 Starting Points?')) {
      const reset: MatchSession = {
        ...DEFAULT_SESSION,
        date: new Date().toLocaleDateString(),
      };
      setSession(reset);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reset));
    }
  };

  // Nav labels translation
  const tabsConfig = [
    { id: 'builder' as const, icon: Hammer, zh: '算分器', en: 'Builder' },
    { id: 'inspector' as const, icon: Eye, zh: '掃描器', en: 'Inspector' },
    { id: 'glossary' as const, icon: Compass, zh: '番種指南', en: 'Glossary' },
    { id: 'parlour' as const, icon: LayoutDashboard, zh: '雅座', en: 'Parlour' },
    { id: 'ledger' as const, icon: History, zh: '結算簿', en: 'Ledger' },
  ];

  return (
    <div className="min-h-screen bg-surface text-zinc-100 flex flex-col selection:bg-gold-leaf/20 selection:text-gold-leaf pb-20">
      {/* Top action header */}
      <TopAppBar
        language={language}
        setLanguage={setLanguage}
        title={language === 'zh-HK' ? '「清番」' : 'ChingFan'}
        onResetSession={handleResetSession}
        prevailingWind={session.prevailingWind}
        consecutiveWins={session.consecutiveDealerWins}
      />

      {/* Main active sheet contents */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 animate-fadeIn">
        {activeTab === 'parlour' && (
          <ParlourView
            session={session}
            setSession={handleUpdateSession}
            language={language}
            onNavigateToBuilder={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'builder' && (
          <BuilderView
            session={session}
            setSession={handleUpdateSession}
            language={language}
            onNavigateToLedger={() => setActiveTab('ledger')}
            externalScannedHand={scannedHandBuffer}
            clearExternalScannedHand={() => setScannedHandBuffer(null)}
          />
        )}

        {activeTab === 'inspector' && (
          <InspectorView
            language={language}
            onScannedLoaded={(h) => setScannedHandBuffer(h)}
            onNavigateToBuilder={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'glossary' && (
          <GlossaryView language={language} />
        )}

        {activeTab === 'ledger' && (
          <LedgerView
            session={session}
            setSession={handleUpdateSession}
            language={language}
          />
        )}
      </main>

      {/* Persistent 5-tab Bottom Navigation bar */}
      <nav id="bottom-navigation-bar" className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-850 bg-black/90 backdrop-blur-md py-2 px-2">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                  active
                    ? 'text-gold-leaf bg-zinc-900/60 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={18} className={active ? 'text-gold-leaf scale-105' : 'text-zinc-400'} />
                <span className="text-[10px] sm:text-xs mt-1 block tracking-tight truncate w-full text-center">
                  {language === 'zh-HK' ? tab.zh : tab.en}
                </span>
                {/* Visual active wind-indicator bubble */}
                {active && (
                  <span className="h-1 w-1.5 rounded-full bg-gold-leaf mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
