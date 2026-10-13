import React from 'react';
import {
  X,
  Bell,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Gift,
  ArrowRight
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onOpenDeposit
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: '50% First Deposit Bonus Active',
      desc: 'Use promo code BONUS50 to claim up to $500 bonus funds on your next deposit.',
      time: 'Just now',
      tag: 'PROMO',
      tagColor: 'bg-amber-400 text-slate-950',
      action: 'CLAIM_BONUS'
    },
    {
      id: '2',
      title: 'High Payout Signals: EUR/USD OTC (93%)',
      desc: 'Market liquidity is elevated. Up to 93% return rate currently available.',
      time: '12 min ago',
      tag: 'MARKET',
      tagColor: 'bg-emerald-500 text-slate-950'
    },
    {
      id: '3',
      title: 'Security Verification Complete',
      desc: 'Your trading profile and PIN protections are actively safeguarded.',
      time: '1 hr ago',
      tag: 'SECURITY',
      tagColor: 'bg-cyan-500 text-slate-950'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#0c1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Notifications & Alerts</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="text-[11px] text-slate-400">
                Broker messages, bonuses, and live announcements
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/15 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="text-[10px] text-slate-500">{item.time}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>

              {item.action === 'CLAIM_BONUS' && onOpenDeposit && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenDeposit();
                  }}
                  className="w-full mt-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Claim 50% Bonus Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
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
