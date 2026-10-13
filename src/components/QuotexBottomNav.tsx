import React from 'react';
import {
  CandlestickChart,
  HelpCircle,
  User,
  Trophy,
  MessageSquare,
  Menu,
  Lock
} from 'lucide-react';

interface QuotexBottomNavProps {
  activeTab: 'chart' | 'help' | 'profile' | 'leaderboard' | 'messages' | 'menu';
  onChangeTab: (tab: 'chart' | 'help' | 'profile' | 'leaderboard' | 'messages' | 'menu') => void;
  isMenuLocked?: boolean;
}

export const QuotexBottomNav: React.FC<QuotexBottomNavProps> = ({
  activeTab,
  onChangeTab,
  isMenuLocked = false
}) => {
  return (
    <nav className="h-14 bg-[#080d16]/85 backdrop-blur-2xl border-t border-white/[0.08] px-2 sm:px-4 flex items-center justify-around select-none z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
      {/* 1. Chart / Markets */}
      <button
        onClick={() => onChangeTab('chart')}
        className={`p-2 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'chart'
            ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }`}
        title="Live Chart"
      >
        <CandlestickChart className="w-5 h-5 stroke-[2]" />
      </button>

      {/* 2. Menu Button (Added permanently with Lock status indicator) */}
      <button
        onClick={() => onChangeTab('menu')}
        className={`relative p-2 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'menu'
            ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : isMenuLocked
            ? 'text-amber-300 bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }`}
        title={isMenuLocked ? 'Feature Menu (Locked - Tap to Unlock)' : 'Feature Menu'}
      >
        <Menu className="w-5 h-5 stroke-[2]" />
        {isMenuLocked ? (
          <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-xs">
            <Lock className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        ) : (
          <span className="absolute -top-0.5 -right-0.5 bg-cyan-500 text-slate-950 text-[8px] font-bold rounded-full px-1">
            PRO
          </span>
        )}
      </button>

      {/* 3. Help / Onboarding (?) */}
      <button
        onClick={() => onChangeTab('help')}
        className={`relative p-2 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'help'
            ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }`}
        title="Help & Guide"
      >
        <div className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-slate-300 stroke-[2.2]" />
        </div>
      </button>

      {/* 4. User Profile */}
      <button
        onClick={() => onChangeTab('profile')}
        className={`p-2 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'profile'
            ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }`}
        title="Profile & Settings"
      >
        <User className="w-5 h-5 stroke-[2]" />
      </button>

      {/* 5. Trophy / Leaderboard with badge 4 */}
      <button
        onClick={() => onChangeTab('leaderboard')}
        className={`relative p-2 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'leaderboard'
            ? 'text-amber-300 bg-amber-500/15 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }`}
        title="Top Traders"
      >
        <Trophy className="w-5 h-5 stroke-[2]" />
        <span className="absolute top-1 right-1 bg-cyan-500 text-slate-950 text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-xs">
          4
        </span>
      </button>

      {/* 6. Messages / Support with badge 4 */}
      <button
        onClick={() => onChangeTab('messages')}
        className={`relative p-2 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'messages'
            ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }`}
        title="Support & Signals"
      >
        <MessageSquare className="w-5 h-5 stroke-[2]" />
        <span className="absolute top-1 right-1 bg-cyan-500 text-slate-950 text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-xs">
          4
        </span>
      </button>
    </nav>
  );
};
