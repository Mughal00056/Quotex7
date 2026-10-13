import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset } from '../types/trading';
import { X, Search, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/chartMath';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose }) => {
  const { assets, activeAsset, setActiveAsset } = useTrading();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  if (!isOpen) return null;

  const categories = ['ALL', 'Forex OTC', 'Crypto', 'Commodities', 'Stocks OTC', 'Indices'];

  const filteredAssets = assets
    .filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || asset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      return sortDirection === 'desc' ? b.payout - a.payout : a.payout - b.payout;
    });

  const handleSelect = (asset: Asset) => {
    setActiveAsset(asset);
    onClose();
  };

  const getFlag = (curr: string) => {
    switch (curr) {
      case 'EUR': return '🇪🇺';
      case 'USD': return '🇺🇸';
      case 'GBP': return '🇬🇧';
      case 'JPY': return '🇯🇵';
      case 'CHF': return '🇨🇭';
      case 'AUD': return '🇦🇺';
      case 'CAD': return '🇨🇦';
      case 'NZD': return '🇳🇿';
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      default: return '🌐';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c121e]/85 backdrop-blur-2xl border border-white/12 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[92dvh]">
        {/* Header in Frosted Glass */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Asset Market Selector
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  UP TO 94% PAYOUT
                </span>
              </h2>
              <div className="text-[10px] text-slate-400">
                Choose currency pairs, crypto & OTC instruments
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Toggle Button (Arrow Up / Down) */}
            <button
              onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sort by payout"
            >
              <span>Payout</span>
              {sortDirection === 'desc' ? (
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Glass Bar */}
        <div className="p-3.5 border-b border-white/[0.06] bg-black/20 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets (e.g. EUR/USD, BTC, Gold, GBP/JPY)..."
              className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400/80 rounded-2xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-400 outline-none backdrop-blur-md transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_2px_12px_rgba(6,182,212,0.4)]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Asset Table List in Glass UI */}
        <div className="p-3.5 overflow-y-auto flex-1 space-y-2">
          {filteredAssets.map((asset) => {
            const isSelected = activeAsset.id === asset.id;
            const isPositive = (asset.change24h ?? 0) >= 0;
            const parts = asset.symbol.split('/');
            const flag1 = getFlag(parts[0]);
            const flag2 = getFlag(parts[1] || '');

            return (
              <button
                key={asset.id}
                onClick={() => handleSelect(asset)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/30'
                    : 'bg-white/[0.025] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/[0.14] text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Square Flag Container */}
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    <span className="text-sm">{flag1}</span>
                    {flag2 && <span className="text-sm -ml-1">{flag2}</span>}
                  </div>

                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                      {asset.name}
                      {asset.isOtc && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1 py-0.2 rounded-md font-mono">
                          OTC
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span>{asset.category}</span>
                      <span>•</span>
                      <span className="font-mono">{asset.symbol}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Price & 24h Change */}
                  <div className="text-right">
                    <div className="font-mono-num text-xs sm:text-sm font-bold text-white">
                      {formatPrice(asset.currentPrice, asset.decimalPlaces)}
                    </div>
                    <div
                      className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{isPositive ? `+${asset.change24h}%` : `${asset.change24h}%`}</span>
                    </div>
                  </div>

                  {/* High Payout Square Badge */}
                  <div className="min-w-[65px] text-right">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1.5 rounded-xl text-xs font-black font-mono-num shadow-xs inline-block">
                      +{asset.payout}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
