import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { ALL_INDICATORS } from '../constants/indicators';
import {
  X,
  Sliders,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Check,
  Trash2
} from 'lucide-react';

interface IndicatorsDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'ALL' | 'TREND' | 'VOLATILITY' | 'OSCILLATORS' | 'DRAWING';
}

export const IndicatorsDrawerModal: React.FC<IndicatorsDrawerModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'ALL'
}) => {
  const {
    indicatorsEnabled,
    setIndicatorsEnabled,
    activeIndicatorIds,
    toggleIndicator,
    clearAllActiveIndicators,
    indicators,
    setIndicators
  } = useTrading();

  const [activeCategory, setActiveCategory] = useState<typeof defaultTab>(defaultTab);

  if (!isOpen) return null;

  const categories = ['ALL', 'TREND', 'VOLATILITY', 'OSCILLATORS', 'DRAWING'] as const;

  const filteredIndicators = ALL_INDICATORS.filter((ind) => {
    if (activeCategory === 'ALL') return true;
    return ind.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] bg-[#0c1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-500" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Technical Indicators</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                  LIVE OVERLAY
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {activeIndicatorIds.length} indicators active on chart
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Toggle Strip */}
        <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Enable Indicator Lines</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                indicatorsEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
              }`}
            >
              {indicatorsEnabled ? 'ENABLED' : 'MUTED'}
            </span>
          </div>

          <button
            onClick={() => setIndicatorsEnabled(!indicatorsEnabled)}
            className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-colors ${
              indicatorsEnabled
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            {indicatorsEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-5 py-2 flex gap-1.5 border-b border-white/[0.06] bg-black/20 shrink-0 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Indicator List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredIndicators.map((ind) => {
            const isActive = activeIndicatorIds.includes(ind.id);
            return (
              <div
                key={ind.id}
                onClick={() => {
                  toggleIndicator(ind.id);
                  if (!indicatorsEnabled) setIndicatorsEnabled(true);
                }}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-500/[0.08] border-cyan-400/40 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: ind.color }}
                  />
                  <div>
                    <div className="font-bold text-white text-xs">{ind.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{ind.category} Indicator</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {isActive ? 'ACTIVE' : 'ADD'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between shrink-0">
          {activeIndicatorIds.length > 0 ? (
            <button
              onClick={clearAllActiveIndicators}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-500">Tap any line to toggle on chart</div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
