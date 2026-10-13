import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { QuotexMobileTopBar } from './components/QuotexMobileTopBar';
import { ChartCanvas } from './components/ChartCanvas';
import { QuotexConsole } from './components/QuotexConsole';
import { QuotexBottomNav } from './components/QuotexBottomNav';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { HistoryModal } from './components/HistoryModal';
import { AssetModal } from './components/AssetModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ChartSettingsModal } from './components/ChartSettingsModal';
import { IndicatorsDrawerModal } from './components/IndicatorsDrawerModal';
import { ActiveTradesModal } from './components/ActiveTradesModal';
import { NotificationsModal } from './components/NotificationsModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SupportMessagesModal } from './components/SupportMessagesModal';
import { TradeResultPopup } from './components/TradeResultPopup';
import { OrderNotificationToast } from './components/OrderNotificationToast';
import { LoadingScreen } from './components/LoadingScreen';

const QuotexPlatform: React.FC = () => {
  // Navigation & Modals state
  const [navTab, setNavTab] = useState<'chart' | 'help' | 'profile' | 'leaderboard' | 'messages' | 'menu'>('chart');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuLocked, setMenuLocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('quotex_menu_locked');
    return saved !== null ? saved === 'true' : true; // Default locked is TRUE as requested
  });
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'trades' | 'deposits' | 'withdrawals' | 'stats'>('trades');
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [chartSettingsOpen, setChartSettingsOpen] = useState(false);
  const [indicatorsOpen, setIndicatorsOpen] = useState(false);
  const [indicatorsDefaultTab, setIndicatorsDefaultTab] = useState<'ALL' | 'TREND' | 'VOLATILITY' | 'OSCILLATORS' | 'DRAWING'>('ALL');
  const [activeTradesOpen, setActiveTradesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [supportMessagesOpen, setSupportMessagesOpen] = useState(false);
  const [helpGuideOpen, setHelpGuideOpen] = useState(false);

  const handleBottomTabChange = (tab: 'chart' | 'help' | 'profile' | 'leaderboard' | 'messages' | 'menu') => {
    setNavTab(tab);
    if (tab === 'menu') {
      setMenuOpen(true);
    }
    if (tab === 'help') setHelpGuideOpen(true);
    if (tab === 'profile') setProfileOpen(true);
    if (tab === 'leaderboard') setLeaderboardOpen(true);
    if (tab === 'messages') setSupportMessagesOpen(true);
  };

  const openHistoryWithTab = (tab: 'trades' | 'deposits' | 'withdrawals' | 'stats') => {
    setHistoryTab(tab);
    setHistoryOpen(true);
  };

  return (
    <>
      {/* 0. Quotex Premium Initial Loading Screen */}
      <LoadingScreen />

      <div className="fixed inset-0 w-full h-[100dvh] bg-[#050811] select-none overflow-hidden flex justify-center items-center overscroll-none">
        {/* Ambient subtle glass glow backdrops */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/12 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/12 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-purple-500/8 rounded-full blur-[160px] pointer-events-none" />

        {/* Quotex Mobile Glass Container */}
        <div className="relative w-full h-full max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl bg-[#080d16]/95 backdrop-blur-3xl flex flex-col justify-between overflow-hidden shadow-2xl sm:border-x sm:border-white/[0.08]">
          {/* 1. Header with 3-Line Menu, Account pill, Bell badge, Deposit CTA, and 50% bonus banner */}
          <QuotexMobileTopBar
            onOpenDeposit={() => setDepositOpen(true)}
            onOpenWithdraw={() => setWithdrawOpen(true)}
            onOpenHistory={() => openHistoryWithTab('trades')}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenLeaderboard={() => setLeaderboardOpen(true)}
            onOpenIndicators={() => {
              setIndicatorsDefaultTab('ALL');
              setIndicatorsOpen(true);
            }}
            onOpenChartSettings={() => setChartSettingsOpen(true)}
            onOpenActiveTrades={() => setActiveTradesOpen(true)}
            onOpenProfile={() => setProfileOpen(true)}
            onOpenSupport={() => setSupportMessagesOpen(true)}
            isMenuOpen={menuOpen}
            setIsMenuOpen={(open) => {
              setMenuOpen(open);
              if (!open && navTab === 'menu') {
                setNavTab('chart');
              }
            }}
            isMenuLocked={menuLocked}
            setIsMenuLocked={(locked) => {
              setMenuLocked(locked);
              localStorage.setItem('quotex_menu_locked', locked.toString());
            }}
          />

          {/* 2. Main Live Chart Area with watermark, vertical trade lines, countdown pill & floating buttons */}
          <div className="flex-1 relative overflow-hidden bg-[#090d16]">
            <ChartCanvas
              onOpenSettings={() => setChartSettingsOpen(true)}
              onOpenIndicators={(tab) => {
                setIndicatorsDefaultTab(tab || 'ALL');
                setIndicatorsOpen(true);
              }}
              onOpenActiveTrades={() => setActiveTradesOpen(true)}
            />
          </div>

          {/* 3. Lower Quotex Console (Asset payout ▾, Timer, Investment, Payout, Buy & Sell) */}
          <QuotexConsole onOpenAssetModal={() => setAssetModalOpen(true)} />

          {/* 4. Bottom 6-Tab Navigation Bar with Permanent Menu Button & Lock status */}
          <QuotexBottomNav
            activeTab={navTab}
            onChangeTab={handleBottomTabChange}
            isMenuLocked={menuLocked}
          />

          {/* 5. Order Notification Toast (Green for Buy, Red for Sell) */}
          <OrderNotificationToast />
        </div>

        {/* Trade Result Popup with Confetti */}
        <TradeResultPopup />

        {/* Modals & Dialogs */}
        <DepositModal
          isOpen={depositOpen}
          onClose={() => setDepositOpen(false)}
          onOpenHistory={() => openHistoryWithTab('deposits')}
          onOpenWithdraw={() => setWithdrawOpen(true)}
        />

        <WithdrawModal
          isOpen={withdrawOpen}
          onClose={() => setWithdrawOpen(false)}
          onOpenHistory={() => openHistoryWithTab('withdrawals')}
          onOpenDeposit={() => setDepositOpen(true)}
        />

        <HistoryModal
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          defaultTab={historyTab}
          onOpenDeposit={() => setDepositOpen(true)}
          onOpenWithdraw={() => setWithdrawOpen(true)}
        />

        <AssetModal
          isOpen={assetModalOpen}
          onClose={() => setAssetModalOpen(false)}
        />

        <ChartSettingsModal
          isOpen={chartSettingsOpen}
          onClose={() => setChartSettingsOpen(false)}
        />

        <IndicatorsDrawerModal
          isOpen={indicatorsOpen}
          onClose={() => setIndicatorsOpen(false)}
          defaultTab={indicatorsDefaultTab}
        />

        <ActiveTradesModal
          isOpen={activeTradesOpen}
          onClose={() => setActiveTradesOpen(false)}
          onOpenHistory={() => openHistoryWithTab('trades')}
        />

        <NotificationsModal
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          onOpenDeposit={() => setDepositOpen(true)}
        />

        <UserProfileModal
          isOpen={profileOpen}
          onClose={() => {
            setProfileOpen(false);
            setNavTab('chart');
          }}
          onOpenDeposit={() => setDepositOpen(true)}
          onOpenWithdraw={() => setWithdrawOpen(true)}
          onOpenHistory={() => openHistoryWithTab('trades')}
        />

        <LeaderboardModal
          isOpen={leaderboardOpen}
          onClose={() => {
            setLeaderboardOpen(false);
            setNavTab('chart');
          }}
        />

        <SupportMessagesModal
          isOpen={supportMessagesOpen}
          onClose={() => {
            setSupportMessagesOpen(false);
            setNavTab('chart');
          }}
        />

        {/* Help / Onboarding Guide Modal */}
        {helpGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-sm bg-[#0c1220]/95 border border-white/10 rounded-2xl shadow-2xl p-5 text-xs text-slate-300">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span>Quotex Quick Guide</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  PRO BROKER
                </span>
              </h3>
              <div className="space-y-2.5 mt-3">
                <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                  <strong className="text-emerald-400 block mb-0.5">
                    1. Green Buy ⬆ & Red Sell ⬇:
                  </strong>
                  Smooth realistic candle movement with upward trend on Buy and downward trend on Sell.
                </div>
                <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                  <strong className="text-cyan-400 block mb-0.5">
                    2. Instant Cashier & Records:
                  </strong>
                  Deposit and withdraw funds through verified channels. All transactions are logged in History.
                </div>
                <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                  <strong className="text-amber-400 block mb-0.5">
                    3. Technical Indicators & Menu Lock:
                  </strong>
                  The feature menu is secured with PIN code <span className="text-white font-mono font-bold">1234</span>.
                </div>
              </div>
              <button
                onClick={() => {
                  setHelpGuideOpen(false);
                  setNavTab('chart');
                }}
                className="mt-4 w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Start Trading
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <QuotexPlatform />
    </TradingProvider>
  );
}
