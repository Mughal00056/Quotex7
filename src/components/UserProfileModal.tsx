import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { formatCurrency } from '../utils/chartMath';
import {
  X,
  User,
  ShieldCheck,
  Crown,
  Wallet,
  ArrowUpRight,
  History,
  Check,
  Copy,
  Lock,
  Sparkles
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenHistory?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenHistory
}) => {
  const {
    traderName,
    setTraderName,
    traderFlag,
    setTraderFlag,
    realBalance,
    demoBalance,
    accountType,
    setAccountType,
    isVipPurpleLive
  } = useTrading();

  const [copiedId, setCopiedId] = useState(false);
  const accountId = 'QX-8821943';

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(accountId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[88vh] bg-[#0c1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Trader Account</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  VERIFIED
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Personal trading credentials and wallet
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

        {/* Profile Card */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#131b2e] to-[#0a101d] border border-white/10 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 border border-white/20 flex items-center justify-center text-2xl shadow-md">
                {traderFlag}
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>{traderName}</span>
                  {isVipPurpleLive && <Crown className="w-4 h-4 text-purple-400 fill-purple-400" />}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[11px] text-slate-400 font-mono">ID: {accountId}</span>
                  <button
                    onClick={handleCopyId}
                    className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                    title="Copy Account ID"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-black px-2 py-1 rounded-lg">
              PRO TRADER
            </span>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={() => setAccountType('REAL')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                accountType === 'REAL'
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(0,229,153,0.15)]'
                  : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                <span>LIVE BALANCE</span>
                {accountType === 'REAL' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <div className="text-lg font-black text-white font-mono-num mt-1">
                {formatCurrency(realBalance)}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Real Funds</div>
            </div>

            <div
              onClick={() => setAccountType('DEMO')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                accountType === 'DEMO'
                  ? 'bg-amber-400/10 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                  : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                <span>DEMO BALANCE</span>
                {accountType === 'DEMO' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </div>
              <div className="text-lg font-black text-white font-mono-num mt-1">
                {formatCurrency(demoBalance)}
              </div>
              <div className="text-[10px] text-amber-400 font-bold mt-0.5">Practice Funds</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            {onOpenDeposit && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDeposit();
                }}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <Wallet className="w-4 h-4" />
                <span>Deposit Funds (+50% Bonus)</span>
              </button>
            )}

            {onOpenWithdraw && (
              <button
                onClick={() => {
                  onClose();
                  onOpenWithdraw();
                }}
                className="w-full py-2.5 px-4 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw Funds</span>
              </button>
            )}

            {onOpenHistory && (
              <button
                onClick={() => {
                  onClose();
                  onOpenHistory();
                }}
                className="w-full py-2.5 px-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <History className="w-4 h-4" />
                <span>View Transaction History</span>
              </button>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-white/[0.08] bg-white/[0.02] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
