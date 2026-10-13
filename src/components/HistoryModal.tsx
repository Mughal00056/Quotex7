import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { formatCurrency, formatPrice } from '../utils/chartMath';
import {
  X,
  History,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Wallet,
  Clock,
  Sparkles,
  BarChart3,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'trades' | 'deposits' | 'withdrawals' | 'stats';
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'trades',
  onOpenDeposit,
  onOpenWithdraw
}) => {
  const {
    tradeHistory,
    deposits,
    withdrawals,
    removeTradeFromHistory,
    removeDepositFromHistory,
    removeWithdrawalFromHistory,
    clearAllHistory
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'trades' | 'deposits' | 'withdrawals' | 'stats'>(defaultTab);

  if (!isOpen) return null;

  const totalTrades = tradeHistory.length;
  const wonTrades = tradeHistory.filter((t) => t.isWin).length;
  const winRate = totalTrades > 0 ? Math.round((wonTrades / totalTrades) * 100) : 0;
  const netProfit = tradeHistory.reduce((acc, t) => acc + (t.profit || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0c1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Glow header ambient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Trading & Financial History</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Detailed transaction ledger and real-time statistics
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

        {/* Sub-Tabs */}
        <div className="px-5 pt-3 pb-2 flex gap-1.5 border-b border-white/[0.06] bg-black/30 shrink-0 overflow-x-auto">
          {[
            { id: 'trades', label: 'Trades', count: tradeHistory.length },
            { id: 'deposits', label: 'Deposits', count: deposits.length },
            { id: 'withdrawals', label: 'Withdrawals', count: withdrawals.length },
            { id: 'stats', label: 'Performance', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {activeTab === 'trades' && (
            <>
              {tradeHistory.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30 text-cyan-400" />
                  <p className="text-sm font-bold text-slate-400">No Closed Trades Yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Place Buy or Sell orders on the chart to generate records.
                  </p>
                </div>
              ) : (
                tradeHistory.map((trade) => {
                  const isWin = trade.isWin;
                  const isUp = trade.direction === 'UP' || trade.direction === 'CALL';
                  return (
                    <div
                      key={trade.id}
                      className={`p-3 rounded-xl border backdrop-blur-xl flex items-center justify-between gap-3 transition-all ${
                        isWin
                          ? 'bg-[#00e599]/[0.06] border-[#00e599]/25 hover:border-[#00e599]/40'
                          : 'bg-[#ff3355]/[0.06] border-[#ff3355]/25 hover:border-[#ff3355]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                            isWin
                              ? 'bg-[#00e599]/20 text-[#00e599]'
                              : 'bg-[#ff3355]/20 text-[#ff3355]'
                          }`}
                        >
                          {isUp ? (
                            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{trade.assetName}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                                isWin
                                  ? 'bg-[#00e599] text-slate-950'
                                  : 'bg-[#ff3355] text-white'
                              }`}
                            >
                              {isWin ? 'WIN' : 'LOSS'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Entry: {formatPrice(trade.entryPrice)} • Close:{' '}
                            {formatPrice(trade.exitPrice || trade.entryPrice)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div
                            className={`font-black font-mono-num text-sm ${
                              isWin ? 'text-[#00e599]' : 'text-[#ff3355]'
                            }`}
                          >
                            {isWin ? `+${formatCurrency(trade.potentialProfit)}` : `-${formatCurrency(trade.amount)}`}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {new Date(trade.closeTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </div>
                        </div>
                        <button
                          onClick={() => removeTradeFromHistory(trade.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete from history"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'deposits' && (
            <>
              {deposits.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <Wallet className="w-12 h-12 mx-auto mb-2 opacity-30 text-emerald-400" />
                  <p className="text-sm font-bold text-slate-400">No Deposits Logged</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Top up your live trading balance anytime.
                  </p>
                  {onOpenDeposit && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDeposit();
                      }}
                      className="mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Make a Deposit
                    </button>
                  )}
                </div>
              ) : (
                deposits.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span>{dep.method}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-black">
                            {dep.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          ID: {dep.id} • {new Date(dep.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-black text-emerald-400 font-mono-num text-sm">
                          +{formatCurrency(dep.totalCredited)}
                        </div>
                        {dep.bonusAmount > 0 && (
                          <div className="text-[10px] text-amber-400 font-mono">
                            Bonus: +{formatCurrency(dep.bonusAmount)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeDepositFromHistory(dep.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'withdrawals' && (
            <>
              {withdrawals.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <ArrowUpRight className="w-12 h-12 mx-auto mb-2 opacity-30 text-cyan-400" />
                  <p className="text-sm font-bold text-slate-400">No Withdrawals Recorded</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Withdrawals are logged here as soon as requested.
                  </p>
                  {onOpenWithdraw && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWithdraw();
                      }}
                      className="mt-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Request Withdrawal
                    </button>
                  )}
                </div>
              ) : (
                withdrawals.map((wth) => (
                  <div
                    key={wth.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span>{wth.method}</span>
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-black">
                            {wth.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          To: {wth.destinationAccount} ({wth.accountHolderName})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-black text-rose-400 font-mono-num text-sm">
                          -{formatCurrency(wth.amount)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(wth.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => removeWithdrawalFromHistory(wth.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Win Rate</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1 font-mono-num">
                    {winRate}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {wonTrades} won of {totalTrades} trades
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Net P/L</div>
                  <div
                    className={`text-2xl font-black mt-1 font-mono-num ${
                      netProfit >= 0 ? 'text-[#00e599]' : 'text-[#ff3355]'
                    }`}
                  >
                    {netProfit >= 0 ? `+${formatCurrency(netProfit)}` : `-${formatCurrency(Math.abs(netProfit))}`}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">All closed positions</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Quotex Fast Execution</div>
                    <div className="text-[10px] text-slate-400">Zero latency real-time quote validation</div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  99.9% ACCURACY
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between shrink-0">
          <button
            onClick={clearAllHistory}
            className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
