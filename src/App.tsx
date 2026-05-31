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
import { LayoutDashboard, Calculator, Compass, History, X } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'calculator' | 'glossary' | 'parlour' | 'ledger'>('calculator');
  const [session, setSession] = useState<MatchSession>(DEFAULT_SESSION);
  const [showScanner, setShowScanner] = useState(false);

  const [scannedHandBuffer, setScannedHandBuffer] = useState<HandState | null>(null);

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

  const handleScanComplete = (h: HandState) => {
    setScannedHandBuffer(h);
    setShowScanner(false);
    setActiveTab('calculator');
  };

  const tabsConfig = [
    { id: 'calculator' as const, icon: Calculator, zh: '計算', en: 'Calculate' },
    { id: 'glossary' as const, icon: Compass, zh: '番種', en: 'Glossary' },
    { id: 'parlour' as const, icon: LayoutDashboard, zh: '雅座', en: 'Parlour' },
    { id: 'ledger' as const, icon: History, zh: '記賬', en: 'Ledger' },
  ];

  return (
    <div className="min-h-screen bg-surface text-zinc-100 flex flex-col selection:bg-gold-leaf/20 selection:text-gold-leaf pb-20">
      <TopAppBar
        language={language}
        setLanguage={setLanguage}
        title={language === 'zh-HK' ? '「清番」' : 'ChingFan'}
        onResetSession={handleResetSession}
        prevailingWind={session.prevailingWind}
        consecutiveWins={session.consecutiveDealerWins}
        onCameraPress={() => setShowScanner(true)}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 animate-fadeIn">
        {activeTab === 'calculator' && (
          <BuilderView
            session={session}
            setSession={handleUpdateSession}
            language={language}
            onNavigateToLedger={() => setActiveTab('ledger')}
            externalScannedHand={scannedHandBuffer}
            clearExternalScannedHand={() => setScannedHandBuffer(null)}
          />
        )}

        {activeTab === 'glossary' && (
          <GlossaryView language={language} />
        )}

        {activeTab === 'parlour' && (
          <ParlourView
            session={session}
            setSession={handleUpdateSession}
            language={language}
            onNavigateToBuilder={() => setActiveTab('calculator')}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerView
            session={session}
            setSession={handleUpdateSession}
            language={language}
          />
        )}
      </main>

      {/* Scanner overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm">
          <div className="relative h-full overflow-y-auto">
            <button
              onClick={() => setShowScanner(false)}
              className="fixed top-4 right-4 z-[70] p-2 bg-surface/80 border border-zinc-700 rounded-full text-zinc-300 hover:text-white hover:bg-surface transition-all"
            >
              <X size={24} />
            </button>
            <div className="max-w-3xl mx-auto px-4 py-16">
              <InspectorView
                language={language}
                onScannedLoaded={handleScanComplete}
                onNavigateToBuilder={() => { setShowScanner(false); setActiveTab('calculator'); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom tab bar - 4 tabs */}
      <nav id="bottom-navigation-bar" className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-850 bg-black/90 backdrop-blur-md py-2 px-2">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
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
                <Icon size={20} className={active ? 'text-gold-leaf scale-105' : 'text-zinc-400'} />
                <span className="text-xs mt-1 block tracking-tight truncate w-full text-center">
                  {language === 'zh-HK' ? tab.zh : tab.en}
                </span>
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
