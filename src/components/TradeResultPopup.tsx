import React, { useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { formatCurrency, formatPrice } from '../utils/chartMath';
import { ArrowUpRight, ArrowDownRight, X, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TradeResultPopup: React.FC = () => {
  const { lastClosedTrade, clearLastClosedTrade, showResultPopupEnabled } = useTrading();

  useEffect(() => {
    if (lastClosedTrade && showResultPopupEnabled && lastClosedTrade.isWin) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Ignore if canvas-confetti is not loaded
      }
    }
  }, [lastClosedTrade, showResultPopupEnabled]);

  if (!lastClosedTrade || !showResultPopupEnabled) return null;

  const isWin = lastClosedTrade.isWin;
  const isUp = lastClosedTrade.direction === 'UP' || lastClosedTrade.direction === 'CALL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs pointer-events-auto animate-fadeIn">
      <div
        className={`relative w-full max-w-xs rounded-2xl p-5 border shadow-2xl backdrop-blur-2xl transition-all ${
          isWin
            ? 'bg-[#002619]/90 border-[#00e599]/50 shadow-[0_16px_48px_rgba(0,229,153,0.35)]'
            : 'bg-[#29080e]/90 border-[#ff3355]/50 shadow-[0_16px_48px_rgba(255,51,85,0.35)]'
        }`}
      >
        <button
          onClick={clearLastClosedTrade}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
              isWin ? 'bg-[#00e599] text-slate-950' : 'bg-[#ff3355] text-white'
            }`}
          >
            {isWin ? (
              <Trophy className="w-8 h-8 stroke-[2.2]" />
            ) : (
              <ArrowDownRight className="w-8 h-8 stroke-[2.5]" />
            )}
          </div>

          <div
            className={`text-xs font-black tracking-widest uppercase ${
              isWin ? 'text-[#00e599]' : 'text-[#ff4d6b]'
            }`}
          >
            {isWin ? 'TRADE COMPLETED — WIN' : 'TRADE COMPLETED — LOSS'}
          </div>

          <div
            className={`text-3xl font-black font-mono-num mt-1.5 ${
              isWin ? 'text-white' : 'text-slate-300'
            }`}
          >
            {isWin ? `+${formatCurrency(lastClosedTrade.potentialProfit)}` : `-${formatCurrency(lastClosedTrade.amount)}`}
          </div>

          <div className="mt-3 w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Asset:</span>
              <span className="font-bold text-white">{lastClosedTrade.assetName}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Entry / Exit:</span>
              <span>
                {formatPrice(lastClosedTrade.entryPrice)} → {formatPrice(lastClosedTrade.exitPrice || lastClosedTrade.entryPrice)}
              </span>
            </div>
          </div>

          <button
            onClick={clearLastClosedTrade}
            className={`mt-4 w-full py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-md transition-colors ${
              isWin
                ? 'bg-[#00e599] hover:bg-[#00f7a5] text-slate-950'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
          >
            Continue Trading
          </button>
        </div>
      </div>
    </div>
  );
};
