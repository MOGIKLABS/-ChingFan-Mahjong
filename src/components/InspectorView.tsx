/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HandState, Language } from '../types';
import TileVisual from './TileVisual';
import { Camera, Upload, RefreshCw, Layers, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface InspectorViewProps {
  language: Language;
  onScannedLoaded: (hand: HandState) => void;
  onNavigateToBuilder: () => void;
}

export default function InspectorView({
  language,
  onScannedLoaded,
  onNavigateToBuilder,
}: InspectorViewProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const t = {
    title: language === 'zh-HK' ? '智能「清番」掃描器 (Inspector)' : "The Inspector (Scanner)",
    subtitle: language === 'zh-HK' ? '上傳雀牌擺位照片，AI 自動檢測胡牌結構並排版！' : 'Upload a photo of your laid out mahjong hand, and let Gemini detect tiles & organize melds!',
    uploadLabel: language === 'zh-HK' ? '選擇照片 / 拍照' : 'Upload Photo / Take Picture',
    dragDrop: language === 'zh-HK' ? '支援拖放或點擊拍照' : 'Drag & drop image here or tap to snap',
    scanning: language === 'zh-HK' ? 'AI 雀神分析中...' : 'Gemini AI Analyzing Mahjong Hand...',
    loadToBuilder: language === 'zh-HK' ? '載入至食糊分析器' : 'Export and Load to Scorer',
    sampleHands: language === 'zh-HK' ? '沒有牌在手？試試範例圖片：' : 'No tiles nearby? Try these sample layouts:',
    sample1: language === 'zh-HK' ? '範例：混一色對對胡' : 'Example: All Pungs of Bamboo',
    sample2: language === 'zh-HK' ? '範例：大三元滿貫' : 'Example: Great Three Dragons Limit',
  };

  const sample1Base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // Mock transparent 1x1 base64 to avoid huge string but allow loader
  const sample2Base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  // Real world mahjong hand presets for testing
  const sample1Data: HandState = {
    melds: [
      { id: 'sim_1', type: 'pung', tiles: ['2b', '2b', '2b'], isConcealed: false },
      { id: 'sim_2', type: 'pung', tiles: ['5b', '5b', '5b'], isConcealed: false },
      { id: 'sim_3', type: 'pung', tiles: ['east', 'east', 'east'], isConcealed: false },
      { id: 'sim_4', type: 'chow', tiles: ['7b', '8b', '9b'], isConcealed: false },
    ],
    eye: ['white', 'white'],
    flowers: ['f1', 's2'],
    concealedHand: false,
    selfDrawn: true,
    winningTile: '9b',
  };

  const sample2Data: HandState = {
    melds: [
      { id: 'sim_drag_1', type: 'pung', tiles: ['red', 'red', 'red'], isConcealed: true },
      { id: 'sim_drag_2', type: 'pung', tiles: ['green', 'green', 'green'], isConcealed: true },
      { id: 'sim_drag_3', type: 'pung', tiles: ['white', 'white', 'white'], isConcealed: true },
      { id: 'sim_drag_4', type: 'chow', tiles: ['1w', '2w', '3w'], isConcealed: true },
    ],
    eye: ['5d', '5d'],
    flowers: ['s1', 's2', 's3', 's4'],
    concealedHand: true,
    selfDrawn: true,
    winningTile: '3w',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async (imgData: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/inspector/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imgData }),
      });

      if (!response.ok) {
        let errMsg = 'Network error scanning Mahjong layout.';
        try {
          const errJson = await response.json();
          errMsg = errJson.error || errMsg;
        } catch {
          // Response wasn't JSON (e.g. Vercel 404 page)
        }
        throw new Error(errMsg);
      }

      const scanResult = await response.json();
      setResult(scanResult);
    } catch (err: any) {
      const isNetworkError = err.message?.includes('Failed to fetch') || err.message?.includes('Network error');
      const friendlyMsg = isNetworkError
        ? (language === 'zh-HK'
          ? '掃描功能需要本地伺服器及 Gemini API 金鑰才能運行。請使用下方的「範例牌型」按鈕試用功能！'
          : 'Photo scanning requires a local server with a Gemini API key. Try the sample preset hands below to see the feature in action!')
        : (err.message || 'Error occurred starting Mahjong image parse.');
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchAnalysis = () => {
    if (image) {
      startAnalysis(image);
    }
  };

  const handleLoadPreset = (preset: HandState) => {
    // Directly simulated scan output
    setImage('preset_placeholder');
    setResult({
      success: true,
      explanation: language === 'zh-HK' 
        ? "AI 大師檢測結果：此為模擬牌型分析。這張預設樣張牌被精確識別並自動生成暗槓、刻子等細緻的傳統番種配置！" 
        : "AI Master Scan Detected: This simulated layout preset registers winning combinations, and extracts detailed point-bearing indices perfectly mapped into the builder.",
      melds: preset.melds,
      eye: preset.eye,
      flowers: preset.flowers,
    });
  };

  const handleExportToBuilder = () => {
    if (!result) return;
    
    // Format returned result into standard HandState
    const parsedHand: HandState = {
      melds: result.melds.map((m: any, idx: number) => ({
        id: `scan_m_${idx}_${Date.now()}`,
        type: m.type,
        tiles: m.tiles,
        isConcealed: m.isConcealed ?? false,
      })),
      eye: result.eye || null,
      flowers: result.flowers || [],
      concealedHand: false,
      selfDrawn: true,
      winningTile: result.eye ? result.eye[0] : null,
    };

    onScannedLoaded(parsedHand);
    onNavigateToBuilder();
  };

  return (
    <div id="inspector-view" className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
        <h2 className="text-2xl font-serif font-bold text-gold-leaf flex items-center justify-center gap-2">
          <Camera size={24} />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs text-zinc-400 font-serif leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Main photo loader board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left column: upload card */}
        <div className="border border-zinc-800 bg-[#121412] p-5 rounded-2xl space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl h-60 bg-surface relative overflow-hidden transition-all hover:bg-zinc-800/10">
            {image === 'preset_placeholder' ? (
              <div className="text-center p-4">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-2 animate-bounce" />
                <span className="text-xs text-zinc-300 font-serif block">Preset Sample Loaded 範例手牌載入完成</span>
              </div>
            ) : image ? (
              <img src={image} alt="Uploaded Hand Layout" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center space-y-2 p-6">
                <Upload size={36} className="text-zinc-600 mx-auto mb-1 animate-pulse" />
                <label className="cursor-pointer bg-primary border border-gold-leaf/30 text-ivory text-xs px-4 py-2 font-semibold rounded-lg shadow-md block hover:brightness-110 active:scale-95 transition-all">
                  <span>{t.uploadLabel}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-zinc-500 font-serif leading-none mt-2">{t.dragDrop}</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-center space-y-3 z-10">
                <RefreshCw size={32} className="text-gold-leaf animate-spin" />
                <span className="text-xs text-zinc-300 font-serif">{t.scanning}</span>
                <div className="w-2/3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-leaf to-amber-500 animate-pulse w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {image && image !== 'preset_placeholder' && (
              <button
                id="btn-reupload"
                onClick={() => {
                  setImage(null);
                  setResult(null);
                  setError(null);
                }}
                className="flex-1 py-2 px-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Clear 清除
              </button>
            )}
            {image && image !== 'preset_placeholder' && (
              <button
                id="btn-analyze-hand"
                disabled={loading}
                onClick={handleLaunchAnalysis}
                className="flex-2 py-2 px-4 bg-primary hover:bg-[#005a00] border border-gold-leaf/30 text-ivory font-semibold rounded-lg text-xs shadow-md"
              >
                Let Gemini Scan 啟動 AI 檢測
              </button>
            )}
          </div>

          {/* Sample Hands testing buttons */}
          <div className="pt-4 border-t border-zinc-850 space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">{t.sampleHands}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                id="btn-load-sample1"
                onClick={() => handleLoadPreset(sample1Data)}
                className="py-1.5 px-2 bg-zinc-800/60 border border-zinc-800 hover:border-gold-leaf text-zinc-300 rounded-lg text-[10px] text-left truncate flex items-center gap-2"
              >
                <Layers size={12} className="text-gold-leaf shrink-0" />
                <span>{t.sample1}</span>
              </button>
              <button
                id="btn-load-sample2"
                onClick={() => handleLoadPreset(sample2Data)}
                className="py-1.5 px-2 bg-zinc-800/60 border border-zinc-800 hover:border-gold-leaf text-zinc-300 rounded-lg text-[10px] text-left truncate flex items-center gap-2"
              >
                <Layers size={12} className="text-gold-leaf shrink-0" />
                <span>{t.sample2}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: results preview */}
        <div className="border border-zinc-800 bg-[#121412] p-5 rounded-2xl min-h-[300px] flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono mb-4">Detection Results 檢測明細</span>

            {error && (
              <div id="inspector-error-panel" className="bg-accent-red/10 border border-accent-red/20 text-gold-leaf p-3.5 rounded-xl flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-accent-red" />
                <span className="text-xs leading-relaxed font-serif">{error}</span>
              </div>
            )}

            {result ? (
              <div id="inspector-result-panel" className="space-y-4 animate-fadeIn">
                <div className="bg-surface/60 border border-zinc-850 p-3 rounded-lg text-xs leading-relaxed text-zinc-300 font-serif">
                  {result.explanation}
                </div>

                {/* Detected Hand tiles visualization */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono">Recognized Components 組合成型:</span>

                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Melds */}
                    {result.melds?.map((m: any, mIdx: number) => (
                      <div key={mIdx} className="bg-zinc-800/40 border border-zinc-800 p-1.5 rounded-lg flex gap-1">
                        {m.tiles.map((tId: string, tIdx: number) => (
                          <TileVisual key={tIdx} tileId={tId} size="sm" />
                        ))}
                      </div>
                    ))}

                    {/* Eye */}
                    {result.eye && (
                      <div className="bg-[#8B0000]/10 border border-[#8B0000]/25 p-1.5 rounded-lg flex gap-1">
                        {result.eye.map((tId: string, tIdx: number) => (
                          <TileVisual key={tIdx} tileId={tId} size="sm" />
                        ))}
                      </div>
                    )}

                    {/* Flowers */}
                    {result.flowers?.length > 0 && (
                      <div className="bg-zinc-850 border border-zinc-800/80 p-1.5 rounded-lg flex gap-1">
                        {result.flowers.map((tId: string, tIdx: number) => (
                          <TileVisual key={tIdx} tileId={tId} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-550 font-serif text-xs">
                {!error && (language === 'zh-HK'
                  ? '上傳照片啟動 AI 掃描，或使用左方「範例牌型」按鈕即時體驗！'
                  : 'Upload a photo to scan with Gemini AI, or try the sample preset hands on the left to see it in action.')}
              </div>
            )}
          </div>

          {result && (
            <div className="pt-4 border-t border-zinc-850 flex justify-end">
              <button
                id="btn-export-scanned-to-scorer"
                onClick={handleExportToBuilder}
                className="flex items-center gap-2 bg-gradient-to-r from-gold-leaf to-amber-500 text-surface text-xs font-bold px-6 py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all"
              >
                <span>{t.loadToBuilder}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
