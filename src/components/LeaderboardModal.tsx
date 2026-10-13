import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { formatCurrency } from '../utils/chartMath';
import {
  X,
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Globe,
  Sparkles,
  UserCheck,
  Edit3,
  Check
} from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  flag: string;
  country: string;
  profit: number;
  tradesWon: number;
  winRate: number;
}

const TOP_TRADERS: LeaderboardEntry[] = [
  { rank: 1, name: 'Sultan_ProFX', flag: '🇵🇰', country: 'Pakistan', profit: 48920.5, tradesWon: 142, winRate: 94 },
  { rank: 2, name: 'Apex_Trader99', flag: '🇦🇪', country: 'UAE', profit: 42180.0, tradesWon: 128, winRate: 91 },
  { rank: 3, name: 'Vikram_Binary', flag: '🇮🇳', country: 'India', profit: 37650.25, tradesWon: 115, winRate: 89 },
  { rank: 4, name: 'CryptoWhale_BR', flag: '🇧🇷', country: 'Brazil', profit: 31200.0, tradesWon: 98, winRate: 87 },
  { rank: 5, name: 'LordOfCandles', flag: '🇬🇧', country: 'UK', profit: 28450.75, tradesWon: 92, winRate: 86 },
  { rank: 6, name: 'Al_Mansoor_VIP', flag: '🇸🇦', country: 'Saudi Arabia', profit: 25100.0, tradesWon: 84, winRate: 85 },
  { rank: 7, name: 'AlphaScalper', flag: '🇺🇸', country: 'USA', profit: 22890.3, tradesWon: 79, winRate: 84 },
  { rank: 8, name: 'IndoSurge', flag: '🇮🇩', country: 'Indonesia', profit: 19450.0, tradesWon: 73, winRate: 82 },
  { rank: 9, name: 'NileTrader_EG', flag: '🇪🇬', country: 'Egypt', profit: 17200.5, tradesWon: 67, winRate: 81 },
  { rank: 10, name: 'Bosphorus_Bull', flag: '🇹🇷', country: 'Turkey', profit: 15800.0, tradesWon: 62, winRate: 80 }
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const {
    traderName,
    setTraderName,
    traderFlag,
    setTraderFlag,
    customLeaderboardProfit,
    setCustomLeaderboardProfit,
    customLeaderboardRank,
    setCustomLeaderboardRank
  } = useTrading();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(traderName);
  const [editProfit, setEditProfit] = useState(
    customLeaderboardProfit !== null ? customLeaderboardProfit.toString() : '12450.00'
  );
  const [editRank, setEditRank] = useState(
    customLeaderboardRank !== null ? customLeaderboardRank.toString() : '24'
  );

  if (!isOpen) return null;

  const currentRank = customLeaderboardRank || 24;
  const currentProfit = customLeaderboardProfit !== null ? customLeaderboardProfit : 12450.0;

  const handleSave = () => {
    setTraderName(editName || 'YA TRADER');
    const p = parseFloat(editProfit);
    if (!isNaN(p)) setCustomLeaderboardProfit(p);
    const r = parseInt(editRank, 10);
    if (!isNaN(r)) setCustomLeaderboardRank(r);
    setIsEditing(false);
  };

  const flags = ['🇵🇰', '🇮🇳', '🇦🇪', '🇸🇦', '🇧🇷', '🇺🇸', '🇬🇧', '🇪🇬', '🇮🇩', '🇹🇷'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0c1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                <span>World Leaderboard</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                  TOP TRADERS
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Live rankings updated every trading round
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

        {/* User Card Sticky Summary */}
        <div className="p-4 bg-[#121a2c]/80 border-b border-white/[0.08] shrink-0">
          <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#16233a] to-emerald-950/40 border border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-lg shrink-0">
                {traderFlag}
              </div>
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span>{traderName}</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-black">
                    YOUR PROFILE
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                  Rank: #{currentRank} • Profit: <span className="text-emerald-400 font-bold font-mono-num">{formatCurrency(currentProfit)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Close' : 'Edit'}</span>
            </button>
          </div>

          {isEditing && (
            <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Display Name:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-bold outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Country Flag:</label>
                  <div className="flex items-center gap-1 overflow-x-auto py-1">
                    {flags.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setTraderFlag(f)}
                        className={`text-base p-1 rounded-md cursor-pointer hover:bg-white/10 ${
                          traderFlag === f ? 'bg-cyan-500/20 border border-cyan-400' : ''
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Custom Rank (#):</label>
                  <input
                    type="number"
                    value={editRank}
                    onChange={(e) => setEditRank(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Custom Profit ($):</label>
                  <input
                    type="number"
                    value={editProfit}
                    onChange={(e) => setEditProfit(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono font-bold outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Leaderboard Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Traders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {TOP_TRADERS.map((trader) => {
            const isTop3 = trader.rank <= 3;
            return (
              <div
                key={trader.rank}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  trader.rank === 1
                    ? 'bg-amber-400/[0.08] border-amber-400/30'
                    : trader.rank === 2
                    ? 'bg-slate-300/[0.06] border-slate-300/25'
                    : trader.rank === 3
                    ? 'bg-amber-700/[0.08] border-amber-700/30'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      trader.rank === 1
                        ? 'bg-amber-400 text-slate-950'
                        : trader.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : trader.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {trader.rank}
                  </div>
                  <div className="text-xl shrink-0">{trader.flag}</div>
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-1">
                      <span>{trader.name}</span>
                      {isTop3 && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {trader.tradesWon} trades • {trader.winRate}% Win Rate
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-emerald-400 font-mono-num text-xs">
                    +{formatCurrency(trader.profit)}
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase">
                    Verified PnL
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
