import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  Bell,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  X,
  Menu,
  Crown,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Shuffle,
  Trash2,
  PenTool,
  Square,
  Trophy,
  Send,
  Palette,
  Sliders,
  Settings,
  Briefcase,
  History,
  User,
  MessageSquare,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CandlestickChart,
  Layers,
  Activity,
  LineChart,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../utils/chartMath';
import { CANDLE_COLOR_SCHEMES, CandleColorScheme, ChartType } from '../types/trading';

interface QuotexMobileTopBarProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenHistory: (tab?: 'trades' | 'deposits' | 'withdrawals' | 'stats') => void;
  onOpenNotifications: () => void;
  onOpenLeaderboard?: () => void;
  onOpenIndicators?: () => void;
  onOpenChartSettings?: () => void;
  onOpenActiveTrades?: () => void;
  onOpenProfile?: () => void;
  onOpenSupport?: () => void;
  isMenuOpen?: boolean;
  setIsMenuOpen?: (open: boolean) => void;
  isMenuLocked?: boolean;
  setIsMenuLocked?: (locked: boolean) => void;
}

type MenuPanelId =
  | 'menu_lock'
  | 'account'
  | 'trade_mode'
  | 'chart_icons'
  | 'drawing_pen'
  | 'indicators'
  | 'candle_style'
  | 'notifications_sound'
  | 'leaderboard'
  | 'watermark_bg'
  | 'cashier_history';

export const QuotexMobileTopBar: React.FC<QuotexMobileTopBarProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenHistory,
  onOpenNotifications,
  onOpenLeaderboard,
  onOpenIndicators,
  onOpenChartSettings,
  onOpenActiveTrades,
  onOpenProfile,
  onOpenSupport,
  isMenuOpen,
  setIsMenuOpen,
  isMenuLocked,
  setIsMenuLocked
}) => {
  const {
    accountType,
    setAccountType,
    demoBalance,
    realBalance,
    resetDemoBalance,
    setRealBalanceDirect,
    removeRealMoney,
    isVipPurpleLive,
    marketBehaviorMode,
    setMarketBehaviorMode,
    showChartButtons,
    setShowChartButtons,
    showEyeButton,
    setShowEyeButton,
    showBagButton,
    setShowBagButton,
    showPenButton,
    setShowPenButton,
    showZoomControls,
    setShowZoomControls,
    watermarkEnabled,
    setWatermarkEnabled,
    indicatorsEnabled,
    setIndicatorsEnabled,
    showResultPopupEnabled,
    setShowResultPopupEnabled,
    showOrderToastEnabled,
    setShowOrderToastEnabled,
    soundEnabled,
    setSoundEnabled,
    activeDrawingTool,
    setActiveDrawingTool,
    clearDrawnLines,
    drawnLines,
    traderName,
    setTraderName,
    traderFlag,
    setTraderFlag,
    customLeaderboardProfit,
    setCustomLeaderboardProfit,
    customLeaderboardRank,
    setCustomLeaderboardRank,
    chartType,
    setChartType,
    candleColorScheme,
    setCandleColorScheme,
    indicators,
    setIndicators,
    activeIndicatorIds,
    clearAllActiveIndicators,
    logoImageUrl,
    setLogoImageUrl,
    backgroundImageUrl,
    setBackgroundImageUrl,
    watermarkSize,
    setWatermarkSize,
    watermarkOpacity,
    setWatermarkOpacity,
    watermarkType,
    setWatermarkType,
    deposits,
    withdrawals,
    tradeHistory
  } = useTrading();

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(false);
  const [showThreeLineMenu, setShowThreeLineMenu] = useState(false);

  // Menu Lock & Protection State ("wo remove na karo aus par lock lago ok")
  const [internalMenuLocked, setInternalMenuLocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('quotex_menu_locked');
    return saved !== null ? saved === 'true' : true;
  });
  const menuLocked = isMenuLocked !== undefined ? isMenuLocked : internalMenuLocked;
  const setMenuLocked = (val: boolean) => {
    if (setIsMenuLocked) setIsMenuLocked(val);
    setInternalMenuLocked(val);
    localStorage.setItem('quotex_menu_locked', val.toString());
  };

  const [menuPin, setMenuPin] = useState<string>(() => {
    return localStorage.getItem('quotex_menu_pin') || '1234';
  });
  const [showPinUnlockModal, setShowPinUnlockModal] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isMenuPinnedOpen, setIsMenuPinnedOpen] = useState<boolean>(false);
  const [unlockedForSession, setUnlockedForSession] = useState<boolean>(false);

  useEffect(() => {
    if (isMenuOpen && menuLocked && !unlockedForSession) {
      setEnteredPin('');
      setPinError(null);
      setShowPinUnlockModal(true);
    }
  }, [isMenuOpen, menuLocked, unlockedForSession]);

  const isMenuVisible =
    (isMenuOpen !== undefined ? isMenuOpen : showThreeLineMenu) && (!menuLocked || unlockedForSession);

  const setMenuVisible = (val: boolean) => {
    if (!val) {
      setUnlockedForSession(false);
    }
    if (setIsMenuOpen) setIsMenuOpen(val);
    setShowThreeLineMenu(val);
  };

  const handleOpenMenuClick = () => {
    if (menuLocked && !unlockedForSession) {
      setEnteredPin('');
      setPinError(null);
      setShowPinUnlockModal(true);
    } else {
      setOpenPanelId(null);
      setMenuVisible(true);
    }
  };

  // Separate accordion panels — all closed ("band") by default as requested
  const [openPanelId, setOpenPanelId] = useState<MenuPanelId | null>(null);

  const [customBalanceInput, setCustomBalanceInput] = useState<string>('');
  const [profitInput, setProfitInput] = useState<string>(
    customLeaderboardProfit !== null ? customLeaderboardProfit.toString() : '-5.21'
  );
  const [rankInput, setRankInput] = useState<string>(
    customLeaderboardRank !== null ? customLeaderboardRank.toString() : '37019'
  );

  const flags = ['🇵🇰', '🇮🇳', '🇦🇪', '🇸🇦', '🇧🇷', '🇺🇸', '🇬🇧', '🇪🇬', '🇮🇩', '🇹🇷'];

  const togglePanel = (id: MenuPanelId) => {
    setOpenPanelId((prev) => (prev === id ? null : id));
  };

  const chartTypes: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'candlestick', label: 'Candles', icon: <CandlestickChart className="w-3.5 h-3.5" /> },
    { type: 'heikinAshi', label: 'Heikin Ashi', icon: <Layers className="w-3.5 h-3.5" /> },
    { type: 'area', label: 'Area', icon: <Activity className="w-3.5 h-3.5" /> },
    { type: 'line', label: 'Line', icon: <LineChart className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="flex flex-col z-30 select-none bg-[#080d16]/80 backdrop-blur-2xl">
      {/* 1. Header Row in Glass UI */}
      <div className="min-h-13 px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2 border-b border-white/[0.08]">
        {/* Left & Center: 3-Line Hamburger Menu + Unified Account & Balance Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
          {/* 3-Line Hamburger Menu Button with Lock Status */}
          <button
            onClick={handleOpenMenuClick}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border backdrop-blur-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md relative ${
              menuLocked
                ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25'
                : 'bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border-white/[0.1] text-slate-200 hover:text-white'
            }`}
            title={menuLocked ? 'Menu Locked (Click to enter PIN)' : 'Trading Control Menu'}
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            {menuLocked && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-xs">
                🔒
              </span>
            )}
          </button>

          {/* Unified Account + Full Balance Pill — Never truncates LIVE or DEMO amount */}
          <div className="relative flex-1 min-w-0">
            {(() => {
              const formattedBal =
                accountType === 'REAL' ? formatCurrency(realBalance) : formatCurrency(demoBalance);
              const amountSizeClass =
                formattedBal.length > 14
                  ? 'text-[10.5px] sm:text-xs'
                  : formattedBal.length > 11
                  ? 'text-[11.5px] sm:text-sm'
                  : 'text-xs sm:text-sm';

              return (
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className={`w-full flex items-center justify-between gap-1 sm:gap-1.5 rounded-2xl px-2.5 sm:px-3 py-1.5 transition-all cursor-pointer border backdrop-blur-xl ${
                    accountType === 'REAL' && isVipPurpleLive
                      ? 'bg-purple-900/40 hover:bg-purple-900/60 border-purple-500/75 shadow-[0_0_16px_rgba(168,85,247,0.35)]'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1] shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-wrap sm:flex-nowrap">
                    {accountType === 'REAL' ? (
                      isVipPurpleLive ? (
                        <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 fill-purple-400 shrink-0 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                      ) : (
                        <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00e599] -rotate-12 shrink-0" />
                      )
                    ) : (
                      <span className="text-xs shrink-0">🎓</span>
                    )}

                    <span
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0 ${
                        accountType === 'REAL'
                          ? isVipPurpleLive
                            ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]'
                            : 'text-[#00e599]'
                          : 'text-amber-400'
                      }`}
                    >
                      {accountType === 'REAL' ? 'LIVE' : 'DEMO'}
                    </span>

                    <span
                      className={`${amountSizeClass} font-extrabold font-mono-num text-white whitespace-nowrap tracking-tight`}
                    >
                      {formattedBal}
                    </span>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              );
            })()}

            {/* Account Dropdown */}
            {showAccountDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/30"
                  onClick={() => setShowAccountDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-76 sm:w-80 max-w-[92vw] bg-[#141b26] border border-[#273245] rounded-xl shadow-2xl p-3 z-50 animate-scaleUp">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 flex items-center justify-between">
                    <span>Switch Trading Account</span>
                    {isVipPurpleLive && (
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded font-black flex items-center gap-1">
                        <Crown className="w-3 h-3 text-purple-400 fill-purple-400" />
                        VIP STATUS
                      </span>
                    )}
                  </div>

                  {/* Demo Account */}
                  <div
                    onClick={() => {
                      setAccountType('DEMO');
                      setShowAccountDropdown(false);
                    }}
                    className={`p-2.5 rounded-lg border mb-2 cursor-pointer transition-colors ${
                      accountType === 'DEMO'
                        ? 'bg-[#1b263b] border-cyan-500 text-white'
                        : 'bg-[#151c2a] border-[#222e42] text-slate-300 hover:bg-[#1b2536]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300">🎓 Demo Account</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetDemoBalance();
                        }}
                        className="p-1 rounded hover:bg-[#283850] text-slate-400 hover:text-cyan-300"
                        title="Reset to $10,000"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-base font-extrabold font-mono-num text-white mt-1 whitespace-nowrap break-all">
                      {formatCurrency(demoBalance)}
                    </div>
                  </div>

                  {/* Live Account */}
                  <div
                    onClick={() => {
                      setAccountType('REAL');
                      setShowAccountDropdown(false);
                    }}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      accountType === 'REAL'
                        ? isVipPurpleLive
                          ? 'bg-[#211538] border-purple-500 text-white'
                          : 'bg-[#1b263b] border-emerald-500 text-white'
                        : 'bg-[#151c2a] border-[#222e42] text-slate-300 hover:bg-[#1b2536]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold flex items-center gap-1.5 ${
                          isVipPurpleLive ? 'text-purple-400' : 'text-emerald-400'
                        }`}
                      >
                        {isVipPurpleLive ? (
                          <Crown className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                        ) : (
                          <Send className="w-3 h-3 text-emerald-400 -rotate-12" />
                        )}
                        <span>Live Account</span>
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider flex items-center gap-1 ${
                          isVipPurpleLive
                            ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isVipPurpleLive && <Crown className="w-2.5 h-2.5 fill-current" />}
                        LIVE
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
                      <div className="text-base font-extrabold font-mono-num text-white whitespace-nowrap">
                        {formatCurrency(realBalance)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#222c3d] flex gap-2">
                    <button
                      onClick={() => {
                        setShowAccountDropdown(false);
                        onOpenDeposit();
                      }}
                      className="flex-1 py-1.5 bg-[#00e599] hover:bg-[#00d084] rounded-lg text-xs font-black text-slate-950 transition-colors cursor-pointer"
                    >
                      Deposit
                    </button>
                    <button
                      onClick={() => {
                        setShowAccountDropdown(false);
                        onOpenWithdraw();
                      }}
                      className="flex-1 py-1.5 bg-[#1f2838] hover:bg-[#28354a] rounded-lg text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side: Bell icon with badge + Deposit button in Glass UI */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenNotifications}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.1] backdrop-blur-xl flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center shadow-xs">
              1
            </span>
          </button>

          <button
            onClick={onOpenDeposit}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500/90 to-emerald-400/90 hover:from-emerald-400 hover:to-emerald-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_4px_16px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-emerald-300/40 backdrop-blur-md transition-all cursor-pointer"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* 2. Optional Promo Banner (Toggled in Menu) */}
      {showPromoBanner && (
        <div className="bg-[#00c874] text-slate-950 px-3 py-1.5 flex items-center justify-between text-xs font-bold shadow-sm animate-fadeIn">
          <div
            onClick={onOpenDeposit}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <span className="text-base">🚀</span>
            <span className="text-[11px] sm:text-xs">
              Get a 50% bonus on your deposit!
            </span>
            <span className="bg-[#009e5b] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              50%
            </span>
          </div>

          <button
            onClick={() => setShowPromoBanner(false)}
            className="p-1 text-slate-900 hover:text-black transition-colors cursor-pointer"
            title="Close Banner"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* 3. 3-LINE CONTROL MENU DRAWER — Every feature in its own separate collapsible panel from top to bottom */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-200 ease-out ${
          isMenuVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-200 ${
            isMenuVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => {
            if (!isMenuPinnedOpen) setMenuVisible(false);
          }}
        />

        {/* Drawer container */}
        <div
          className={`relative w-80 sm:w-96 max-w-[92vw] h-full bg-[#0c111a]/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden transform transition-transform duration-200 ease-out ${
            isMenuVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header with Lock Toggle */}
          <div className="px-4 py-3 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Menu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Quotex Feature Menu</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-black">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {menuLocked ? '🔒 Menu is Locked with PIN' : 'Tap any feature to expand'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Lock Toggle Button in Header */}
              <button
                onClick={() => setMenuLocked(!menuLocked)}
                className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all border ${
                  menuLocked
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                    : 'bg-white/[0.05] border-white/10 text-slate-400 hover:text-white'
                }`}
                title={menuLocked ? 'Menu Locked - Tap to Unlock' : 'Tap to Lock Menu'}
              >
                {menuLocked ? (
                  <>
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3 text-slate-400" />
                    <span>Lock</span>
                  </>
                )}
              </button>

              {openPanelId !== null && (
                <button
                  onClick={() => setOpenPanelId(null)}
                  className="px-2 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[10px] font-bold text-cyan-300 cursor-pointer"
                  title="Close Open Panel"
                >
                  Close
                </button>
              )}
              <button
                onClick={() => setMenuVisible(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                title="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Top Quick Cashier & Account Summary Strip */}
          <div className="px-3.5 py-2.5 bg-[#0f1622] border-b border-[#1c2738] shrink-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {traderFlag}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white flex items-center gap-1">
                    <span>{traderName || 'YA TRADER'}</span>
                    {isVipPurpleLive && accountType === 'REAL' && (
                      <Crown className="w-3.5 h-3.5 text-purple-400 fill-purple-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>
                      <span className="text-[#00e599] font-bold">LIVE: </span>
                      <span className="text-white font-mono-num font-bold whitespace-nowrap">
                        {formatCurrency(realBalance)}
                      </span>
                    </span>
                    <span>
                      <span className="text-amber-400 font-bold">DEMO: </span>
                      <span className="text-white font-mono-num font-bold whitespace-nowrap">
                        {formatCurrency(demoBalance)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setMenuVisible(false);
                    onOpenDeposit();
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-[#00e599] hover:bg-[#00f7a5] text-slate-950 font-black text-[10px] cursor-pointer"
                >
                  + Deposit
                </button>
                <button
                  onClick={() => {
                    setMenuVisible(false);
                    onOpenWithdraw();
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-[#182335] hover:bg-[#22314a] border border-[#273750] text-slate-200 font-bold text-[10px] cursor-pointer"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* UP-TO-DOWN SEPARATE COLLAPSIBLE FEATURE PANELS */}
          <div className="p-3 overflow-y-auto flex-1 space-y-2 text-xs overscroll-contain">
            {/* =====================================================================
                PANEL 0: Menu Lock & Security Protection ("wo remove na karo aus par lock lago ok")
               ===================================================================== */}
            <div className="bg-[#121926] border border-white/[0.08] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('menu_lock')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    menuLocked ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/15 text-cyan-400'
                  }`}>
                    {menuLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span>0. Menu Lock & Security</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                        menuLocked ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-400'
                      }`}>
                        {menuLocked ? 'LOCKED 🔒' : 'UNLOCKED'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {menuLocked ? 'Lock active (PIN protected: 1234)' : 'Lock menu with PIN passcode'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuLocked(!menuLocked);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                      menuLocked
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {menuLocked ? 'LOCKED 🔒' : 'LOCK 🔓'}
                  </button>
                  {openPanelId === 'menu_lock' ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {openPanelId === 'menu_lock' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-white/[0.06] bg-black/25 space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">Lock Menu Access</div>
                      <div className="text-[10px] text-slate-400">Requires PIN when opening Menu</div>
                    </div>
                    <button
                      onClick={() => setMenuLocked(!menuLocked)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
                        menuLocked
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {menuLocked ? '🔒 Lock Active' : '🔓 Tap to Lock'}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>Security 4-Digit PIN:</span>
                      </span>
                      <span className="font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 text-xs">
                        Current: {menuPin}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="password"
                        maxLength={6}
                        placeholder="New PIN (default: 1234)"
                        value={enteredPin}
                        onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => {
                          if (enteredPin.length >= 4) {
                            setMenuPin(enteredPin);
                            localStorage.setItem('quotex_menu_pin', enteredPin);
                            setEnteredPin('');
                          }
                        }}
                        disabled={enteredPin.length < 4}
                        className="px-3 py-1.5 bg-amber-400 disabled:opacity-40 text-slate-950 font-black rounded-lg text-xs cursor-pointer shrink-0"
                      >
                        Set PIN
                      </button>
                    </div>
                    <div className="text-[9.5px] text-slate-500">Default PIN is 1234. Change or keep default anytime.</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">Keep Menu Pinned on Screen</div>
                      <div className="text-[10px] text-slate-400">Lock drawer open without auto-closing</div>
                    </div>
                    <button
                      onClick={() => setIsMenuPinnedOpen(!isMenuPinnedOpen)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                        isMenuPinnedOpen
                          ? 'bg-cyan-400 text-slate-950 font-black'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {isMenuPinnedOpen ? 'PINNED 📌' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* =====================================================================
                PANEL 1: Account & Live Balance Control
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('account')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-xs">1. Account & Live Balance</div>
                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-2">
                      <span className="whitespace-nowrap">Live: {formatCurrency(realBalance)}</span>
                      <span className="whitespace-nowrap">Demo: {formatCurrency(demoBalance)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccountType(accountType === 'REAL' ? 'DEMO' : 'REAL');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                      accountType === 'REAL'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {accountType === 'REAL' ? 'LIVE ON' : 'DEMO ON'}
                  </button>
                  {openPanelId === 'account' ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {openPanelId === 'account' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setAccountType('REAL')}
                      className={`py-2 px-2.5 rounded-lg border font-bold text-[11px] cursor-pointer text-left ${
                        accountType === 'REAL'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-[#141c2b] border-[#223049] text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] uppercase opacity-80">LIVE Account</div>
                      <div className="font-mono-num font-extrabold text-white text-xs whitespace-nowrap mt-0.5">
                        {formatCurrency(realBalance)}
                      </div>
                    </button>
                    <button
                      onClick={() => setAccountType('DEMO')}
                      className={`py-2 px-2.5 rounded-lg border font-bold text-[11px] cursor-pointer text-left ${
                        accountType === 'DEMO'
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                          : 'bg-[#141c2b] border-[#223049] text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] uppercase opacity-80">DEMO Account</div>
                      <div className="font-mono-num font-extrabold text-white text-xs whitespace-nowrap mt-0.5">
                        {formatCurrency(demoBalance)}
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => {
                        setRealBalanceDirect(105000);
                        setAccountType('REAL');
                      }}
                      className="py-2 px-2.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/50 text-purple-300 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                      <span>VIP $105,000</span>
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      placeholder="Set custom Live $ balance..."
                      value={customBalanceInput}
                      onChange={(e) => setCustomBalanceInput(e.target.value)}
                      className="flex-1 bg-[#0a0f18] border border-[#25334a] rounded-lg px-2.5 py-1.5 text-white font-mono-num text-xs outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(customBalanceInput);
                        if (!isNaN(val) && val >= 0) {
                          setRealBalanceDirect(val);
                          setAccountType('REAL');
                          setCustomBalanceInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      Set $
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={resetDemoBalance}
                      className="text-[11px] text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Demo to $10,000</span>
                    </button>
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 2: Trade Result Mode (Win / Force Lose / Real Trading Mix)
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('trade_mode')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">2. Trade Result Mode</div>
                    <div className="text-[10px] text-slate-400">
                      {marketBehaviorMode === 'force_loss'
                        ? 'Force Lose Mode (ON)'
                        : marketBehaviorMode === 'realistic'
                        ? 'Real Trading Win & Lose Mix'
                        : 'Always Win Smooth Mode (ON)'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      marketBehaviorMode === 'force_loss'
                        ? 'bg-rose-500 text-white'
                        : marketBehaviorMode === 'realistic'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {marketBehaviorMode === 'force_loss'
                      ? 'LOSE ON'
                      : marketBehaviorMode === 'realistic'
                      ? 'REAL MIX'
                      : 'WIN ON'}
                  </span>
                  {openPanelId === 'trade_mode' ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {openPanelId === 'trade_mode' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2">
                  <button
                    onClick={() => setMarketBehaviorMode('smart_push')}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      marketBehaviorMode === 'smart_push'
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                        : 'bg-[#121a28] border-[#1f2c40] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-xs">Always Win Mode (Smooth Real-Time)</div>
                        <div className="text-[10px] text-slate-400">Gradual real-time finish in profit</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        marketBehaviorMode === 'smart_push'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-[#1e293b] text-slate-400'
                      }`}
                    >
                      {marketBehaviorMode === 'smart_push' ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    onClick={() => setMarketBehaviorMode('force_loss')}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      marketBehaviorMode === 'force_loss'
                        ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                        : 'bg-[#121a28] border-[#1f2c40] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div className="font-bold text-xs">Force Lose Mode</div>
                        <div className="text-[10px] text-slate-400">Gradual real-time finish in loss</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        marketBehaviorMode === 'force_loss'
                          ? 'bg-rose-500 text-white'
                          : 'bg-[#1e293b] text-slate-400'
                      }`}
                    >
                      {marketBehaviorMode === 'force_loss' ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    onClick={() => setMarketBehaviorMode('realistic')}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      marketBehaviorMode === 'realistic'
                        ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                        : 'bg-[#121a28] border-[#1f2c40] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-xs">Real Trading (Win & Lose Mix)</div>
                        <div className="text-[10px] text-slate-400">Natural live market win & loss ratio</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        marketBehaviorMode === 'realistic'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-[#1e293b] text-slate-400'
                      }`}
                    >
                      {marketBehaviorMode === 'realistic' ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 3: Chart Buttons (Eye, Bag, Pen Tool & Zoom) ON/OFF
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('chart_icons')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">3. Chart Icons (Eye, Bag & Pen)</div>
                    <div className="text-[10px] text-slate-400">
                      Turn individual chart buttons ON or OFF
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChartButtons(!showChartButtons);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                      showChartButtons ? 'bg-cyan-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                    }`}
                  >
                    {showChartButtons ? 'ON' : 'OFF'}
                  </button>
                  {openPanelId === 'chart_icons' ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {openPanelId === 'chart_icons' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2">
                  {/* All Chart Icons Master Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <span className="font-bold text-white text-xs">All Chart Floating Buttons</span>
                    <button
                      onClick={() => setShowChartButtons(!showChartButtons)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        showChartButtons ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {showChartButtons ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Eye Button Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <span className="text-slate-200 text-xs flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Eye Button (Top-Left)</span>
                    </span>
                    <button
                      onClick={() => setShowEyeButton(!showEyeButton)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        showEyeButton ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {showEyeButton ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Bag Icon Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <span className="text-slate-200 text-xs flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bag Icon (Trades Drawer)</span>
                    </span>
                    <button
                      onClick={() => setShowBagButton(!showBagButton)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        showBagButton ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {showBagButton ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Pen Tool Icon Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <span className="text-slate-200 text-xs flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pen Tool Icon (Top-Left)</span>
                    </span>
                    <button
                      onClick={() => setShowPenButton(!showPenButton)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        showPenButton ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {showPenButton ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Zoom Controls Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <span className="text-slate-200 text-xs flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-purple-400" />
                      <span>Zoom (+ / -) Right Bar</span>
                    </span>
                    <button
                      onClick={() => setShowZoomControls(!showZoomControls)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        showZoomControls ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {showZoomControls ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 4: Pen Tool & Chart Drawing
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('drawing_pen')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">4. Pen & Drawing Tools</div>
                    <div className="text-[10px] text-slate-400">
                      {drawnLines.length > 0
                        ? `${drawnLines.length} drawn objects on chart`
                        : 'Draw lines & technical shapes'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDrawingTool(activeDrawingTool === 'none' ? 'freehand' : 'none');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                      activeDrawingTool !== 'none'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/[0.08] text-slate-400'
                    }`}
                  >
                    {activeDrawingTool !== 'none' ? 'ON' : 'OFF'}
                  </button>
                  {openPanelId === 'drawing_pen' ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {openPanelId === 'drawing_pen' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'crosshair', label: '+ 4-Line Crosshair' },
                        { id: 'channel', label: 'Custom Shape (4 Dots)' },
                        { id: 'rectangle', label: 'Box (4 Dots)' },
                        { id: 'trendline', label: 'Trend Line' },
                        { id: 'horizontal', label: 'Support/Res' },
                        { id: 'vertical', label: 'Vertical' },
                        { id: 'ray', label: 'Ray Line' },
                        { id: 'freehand', label: 'Free Pen' },
                        { id: 'fibonacci', label: 'Fibonacci' }
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveDrawingTool(activeDrawingTool === t.id ? 'none' : t.id);
                          setShowThreeLineMenu(false);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border cursor-pointer ${
                          activeDrawingTool === t.id
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                            : 'bg-[#141c2b] text-slate-300 border-[#223049] hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}

                    <button
                      onClick={() => setActiveDrawingTool('none')}
                      className="py-1.5 px-2 rounded-lg text-[10px] font-bold bg-[#1f293d] text-slate-300 hover:text-white cursor-pointer"
                    >
                      Turn Off Pen
                    </button>
                  </div>

                  {drawnLines.length > 0 && (
                    <button
                      onClick={clearDrawnLines}
                      className="w-full py-1.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Drawn Lines ({drawnLines.length})</span>
                    </button>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 5: Technical Indicators (100+ Lines) ON/OFF
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('indicators')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">5. Technical Indicators (100+)</div>
                    <div className="text-[10px] text-slate-400">
                      {indicatorsEnabled ? `${activeIndicatorIds.length} active lines` : 'Indicators Hidden (OFF)'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndicatorsEnabled(!indicatorsEnabled);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                      indicatorsEnabled ? 'bg-cyan-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                    }`}
                  >
                    {indicatorsEnabled ? 'ON' : 'OFF'}
                  </button>
                  {openPanelId === 'indicators' ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {openPanelId === 'indicators' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <span className="text-xs font-bold text-white">Show Indicator Lines on Chart</span>
                    <button
                      onClick={() => setIndicatorsEnabled(!indicatorsEnabled)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        indicatorsEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {indicatorsEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        { key: 'sma', label: 'SMA (10)' },
                        { key: 'ema', label: 'EMA (21)' },
                        { key: 'bbands', label: 'Bollinger Bands' },
                        { key: 'rsi', label: 'RSI (14)' },
                        { key: 'macd', label: 'MACD' },
                        { key: 'stoch', label: 'Stochastic' }
                      ] as const
                    ).map((item) => {
                      const isOn = Boolean(indicators[item.key]);
                      return (
                        <button
                          key={item.key}
                          onClick={() =>
                            setIndicators((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                          }
                          className={`p-2 rounded-lg border flex items-center justify-between text-[11px] font-bold cursor-pointer ${
                            isOn
                              ? 'bg-[#18263a] border-cyan-400 text-cyan-300'
                              : 'bg-[#141c2b] border-[#1f2c40] text-slate-400'
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="text-[9px] font-black">{isOn ? 'ON' : 'OFF'}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setShowThreeLineMenu(false);
                        if (onOpenIndicators) onOpenIndicators();
                      }}
                      className="flex-1 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      Open All 100+ Indicators
                    </button>
                    {activeIndicatorIds.length > 0 && (
                      <button
                        onClick={clearAllActiveIndicators}
                        className="py-2 px-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold text-xs cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 6: Candle Style & Color Scheme
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('candle_style')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">6. Candle Type & Color Scheme</div>
                    <div className="text-[10px] text-slate-400">
                      {chartType.toUpperCase()} • {CANDLE_COLOR_SCHEMES[candleColorScheme]?.label}
                    </div>
                  </div>
                </div>

                {openPanelId === 'candle_style' ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {openPanelId === 'candle_style' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    {chartTypes.map((ct) => (
                      <button
                        key={ct.type}
                        onClick={() => setChartType(ct.type)}
                        className={`p-2 rounded-lg border flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                          chartType === ct.type
                            ? 'bg-[#1a263b] border-cyan-400 text-cyan-300'
                            : 'bg-[#141c2b] border-[#1f2c40] text-slate-400'
                        }`}
                      >
                        {ct.icon}
                        <span>{ct.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    {(Object.keys(CANDLE_COLOR_SCHEMES) as CandleColorScheme[]).map((schemeKey) => {
                      const palette = CANDLE_COLOR_SCHEMES[schemeKey];
                      const active = candleColorScheme === schemeKey;
                      return (
                        <button
                          key={schemeKey}
                          onClick={() => setCandleColorScheme(schemeKey)}
                          className={`w-full px-2.5 py-2 rounded-lg border flex items-center justify-between text-left transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#1a263b] border-cyan-400 text-white'
                              : 'bg-[#141c2b] border-[#1f2c40] text-slate-300'
                          }`}
                        >
                          <span className="font-bold text-[11px]">{palette.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-xs inline-block"
                              style={{ backgroundColor: palette.bullish }}
                            />
                            <span
                              className="w-3 h-3 rounded-xs inline-block"
                              style={{ backgroundColor: palette.bearish }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 7: Notifications, Result P/F Popup & Sound FX
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('notifications_sound')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">7. Result P/F, Popups & Sound FX</div>
                    <div className="text-[10px] text-slate-400">
                      Result P/F: {showResultPopupEnabled ? 'ON' : 'OFF'} • Sound: {soundEnabled ? 'ON' : 'OFF'}
                    </div>
                  </div>
                </div>

                {openPanelId === 'notifications_sound' ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {openPanelId === 'notifications_sound' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2">
                  {/* Compact Result (P/F) Bubble Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <div>
                      <div className="font-bold text-white text-xs">Compact Result (P/F) Box</div>
                      <div className="text-[10px] text-slate-400">Small P/F result box next to candle</div>
                    </div>
                    <button
                      onClick={() => setShowResultPopupEnabled(!showResultPopupEnabled)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        showResultPopupEnabled
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {showResultPopupEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Order Placement Toast Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <div>
                      <div className="font-bold text-white text-xs">Trade Order Toast Popup</div>
                      <div className="text-[10px] text-slate-400">Notification when placing Buy/Sell</div>
                    </div>
                    <button
                      onClick={() => setShowOrderToastEnabled(!showOrderToastEnabled)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        showOrderToastEnabled
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {showOrderToastEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Sound FX Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <div>
                      <div className="font-bold text-white text-xs">Sound FX Audio</div>
                      <div className="text-[10px] text-slate-400">Audio chime on trades & results</div>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        soundEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {soundEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Promo Banner Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <div>
                      <div className="font-bold text-white text-xs">50% Deposit Bonus Banner</div>
                      <div className="text-[10px] text-slate-400">Top green bonus strip</div>
                    </div>
                    <button
                      onClick={() => setShowPromoBanner(!showPromoBanner)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        showPromoBanner ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {showPromoBanner ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 8: Leaderboard & Trader Profile Setup
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('leaderboard')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">8. Leaderboard & Trader Profile</div>
                    <div className="text-[10px] text-slate-400">
                      {traderFlag} {traderName}
                    </div>
                  </div>
                </div>

                {openPanelId === 'leaderboard' ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {openPanelId === 'leaderboard' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Your Trader Name:</label>
                    <input
                      type="text"
                      value={traderName}
                      onChange={(e) => setTraderName(e.target.value)}
                      placeholder="YA TRADER"
                      className="w-full bg-[#0a0f18] border border-[#25334a] rounded-lg px-2.5 py-1.5 text-white font-bold text-xs outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Country Flag:</label>
                    <div className="flex flex-wrap gap-1">
                      {flags.map((flg) => (
                        <button
                          key={flg}
                          onClick={() => setTraderFlag(flg)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm border cursor-pointer ${
                            traderFlag === flg
                              ? 'bg-cyan-500/20 border-cyan-400'
                              : 'bg-[#141c2b] border-[#223049]'
                          }`}
                        >
                          {flg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Your Profit ($):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={profitInput}
                        onChange={(e) => {
                          setProfitInput(e.target.value);
                          const parsed = parseFloat(e.target.value);
                          if (!isNaN(parsed)) {
                            setCustomLeaderboardProfit(parsed);
                          } else {
                            setCustomLeaderboardProfit(null);
                          }
                        }}
                        className="w-full bg-[#0a0f18] border border-[#25334a] rounded-lg px-2 py-1.5 text-white font-mono-num text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Your Position:</label>
                      <input
                        type="number"
                        value={rankInput}
                        onChange={(e) => {
                          setRankInput(e.target.value);
                          const parsed = parseInt(e.target.value, 10);
                          if (!isNaN(parsed) && parsed > 0) {
                            setCustomLeaderboardRank(parsed);
                          } else {
                            setCustomLeaderboardRank(null);
                          }
                        }}
                        className="w-full bg-[#0a0f18] border border-[#25334a] rounded-lg px-2 py-1.5 text-white font-mono-num text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {onOpenLeaderboard && (
                      <button
                        onClick={() => {
                          setShowThreeLineMenu(false);
                          onOpenLeaderboard();
                        }}
                        className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                      >
                        Open Leaderboard →
                      </button>
                    )}
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 9: Chart Watermark & Background
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('watermark_bg')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">9. Watermark & Chart Background</div>
                    <div className="text-[10px] text-slate-400">
                      {watermarkEnabled ? `${watermarkSize}px • ${Math.round(watermarkOpacity * 100)}%` : 'Watermark OFF'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWatermarkEnabled(!watermarkEnabled);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                      watermarkEnabled ? 'bg-cyan-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                    }`}
                  >
                    {watermarkEnabled ? 'ON' : 'OFF'}
                  </button>
                  {openPanelId === 'watermark_bg' ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {openPanelId === 'watermark_bg' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2.5">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#141c2b] border border-[#1f2c40]">
                    <span className="font-bold text-white text-xs">Show Chart Watermark</span>
                    <button
                      onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                        watermarkEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-[#222e42] text-slate-400'
                      }`}
                    >
                      {watermarkEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold mb-1.5">
                      <span>Watermark Zoom / Size (10x - 1000x):</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setWatermarkSize(Math.max(10, watermarkSize - 25))}
                          className="px-1.5 py-0.5 rounded bg-[#1b2538] text-white font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="10"
                          max="1000"
                          value={watermarkSize}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) setWatermarkSize(Math.max(10, Math.min(1000, val)));
                          }}
                          className="w-16 bg-[#0a0f18] border border-[#25334a] rounded px-1.5 py-0.5 text-center text-cyan-400 font-mono font-bold text-xs outline-none"
                        />
                        <span className="text-[10px] text-cyan-400 font-mono font-bold">x</span>
                        <button
                          type="button"
                          onClick={() => setWatermarkSize(Math.min(1000, watermarkSize + 25))}
                          className="px-1.5 py-0.5 rounded bg-[#1b2538] text-white font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="5"
                      value={watermarkSize}
                      onChange={(e) => setWatermarkSize(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-400 cursor-pointer h-2 bg-[#141c2b] rounded-lg"
                    />
                    <div className="mt-1.5 grid grid-cols-6 gap-1">
                      {[50, 150, 300, 500, 750, 1000].map((sz) => (
                        <button
                          type="button"
                          key={sz}
                          onClick={() => setWatermarkSize(sz)}
                          className={`py-1 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            watermarkSize === sz
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                              : 'bg-[#141c2b] text-slate-300 border-[#222e42] hover:text-white'
                          }`}
                        >
                          {sz}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 font-semibold mb-1">
                      <span>Watermark Opacity (1% - 100%):</span>
                      <span className="text-cyan-400 font-mono font-bold">{Math.round(watermarkOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="1"
                      step="0.02"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-2 bg-[#141c2b] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {(['both', 'logo', 'text'] as const).map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => setWatermarkType(mode)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase cursor-pointer ${
                          watermarkType === mode
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-[#141c2b] text-slate-400'
                        }`}
                      >
                        {mode === 'both' ? 'Logo + Text' : mode === 'logo' ? 'Logo Only' : 'Text Only'}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 block">
                      Custom Watermark Image URL or Upload:
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Paste any image URL (https://... or data:image/...)"
                        value={logoImageUrl}
                        onChange={(e) => {
                          setLogoImageUrl(e.target.value);
                          if (e.target.value.trim() && !watermarkEnabled) {
                            setWatermarkEnabled(true);
                          }
                        }}
                        className="flex-1 bg-[#0a0f18] border border-[#25334a] focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs outline-none"
                      />
                      {logoImageUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoImageUrl('')}
                          className="px-2 py-1 rounded-lg bg-rose-950/60 text-rose-300 text-[10px] font-bold cursor-pointer shrink-0"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <label className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#141c2b] hover:bg-[#1b263b] border border-[#25334a] text-cyan-300 text-[10px] font-bold text-center cursor-pointer transition-colors">
                        <span>📁 Choose Image From Phone / Gallery</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setLogoImageUrl(reader.result);
                                setWatermarkEnabled(true);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {logoImageUrl && (
                        <img
                          src={logoImageUrl}
                          alt="Preview"
                          className="w-8 h-8 rounded border border-cyan-500/40 object-contain bg-[#0a0f18] shrink-0"
                        />
                      )}
                    </div>

                    {/* Direct 3-Candlesticks Logo (apple-touch-icon.png) Download & URL Box */}
                    <div className="p-2 rounded-lg bg-[#121a28] border border-emerald-500/30 space-y-1.5 mt-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src="/apple-touch-icon.png?v=3"
                            alt="Candlestick Logo"
                            className="w-7 h-7 rounded-md object-contain bg-[#0a0f18] border border-emerald-500/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] font-extrabold text-emerald-300 truncate">
                              3-Candlesticks Logo (apple-touch-icon.png)
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono truncate">
                              /apple-touch-icon.png
                            </div>
                          </div>
                        </div>
                        <a
                          href="/apple-touch-icon.png?v=3"
                          download="apple-touch-icon.png"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] shrink-0 transition-colors"
                        >
                          ⬇️ Download
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      Custom Chart Background URL (Optional):
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Paste chart background image URL..."
                        value={backgroundImageUrl}
                        onChange={(e) => setBackgroundImageUrl(e.target.value)}
                        className="flex-1 bg-[#0a0f18] border border-[#25334a] focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs outline-none"
                      />
                      {backgroundImageUrl && (
                        <button
                          type="button"
                          onClick={() => setBackgroundImageUrl('')}
                          className="px-2 py-1 rounded-lg bg-rose-950/60 text-rose-300 text-[10px] font-bold cursor-pointer shrink-0"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================================
                PANEL 10: Deposit, Withdrawal & Transaction History Records
               ===================================================================== */}
            <div className="bg-[#121926] border border-[#212e45] rounded-xl overflow-hidden">
              <div
                onClick={() => togglePanel('cashier_history')}
                className="px-3.5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#162030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">10. Cashier & History Records</div>
                    <div className="text-[10px] text-slate-400">
                      {deposits.length} Deposits • {withdrawals.length} Withdrawals • {tradeHistory.length} Trades
                    </div>
                  </div>
                </div>

                {openPanelId === 'cashier_history' ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {openPanelId === 'cashier_history' && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-[#1d293e] bg-[#0e141f] space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setMenuVisible(false);
                        onOpenDeposit();
                      }}
                      className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowDownLeft className="w-4 h-4" />
                      <span>Deposit Funds</span>
                    </button>

                    <button
                      onClick={() => {
                        setMenuVisible(false);
                        onOpenWithdraw();
                      }}
                      className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Withdraw Funds</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => {
                        setMenuVisible(false);
                        onOpenHistory('deposits');
                      }}
                      className="py-2 px-2 rounded-lg bg-[#141c2b] hover:bg-[#1b263b] border border-[#223049] text-emerald-400 font-bold text-[10px] cursor-pointer text-center"
                    >
                      Deposits ({deposits.length})
                    </button>

                    <button
                      onClick={() => {
                        setMenuVisible(false);
                        onOpenHistory('withdrawals');
                      }}
                      className="py-2 px-2 rounded-lg bg-[#141c2b] hover:bg-[#1b263b] border border-[#223049] text-purple-400 font-bold text-[10px] cursor-pointer text-center"
                    >
                      Withdraws ({withdrawals.length})
                    </button>

                    <button
                      onClick={() => {
                        setMenuVisible(false);
                        onOpenHistory('trades');
                      }}
                      className="py-2 px-2 rounded-lg bg-[#141c2b] hover:bg-[#1b263b] border border-[#223049] text-cyan-400 font-bold text-[10px] cursor-pointer text-center"
                    >
                      Trades ({tradeHistory.length})
                    </button>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setOpenPanelId(null)}
                      className="px-2.5 py-1 rounded-lg bg-[#1b2538] text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Sticky Footer */}
          <div className="p-3 bg-[#111723] border-t border-[#1f2a3c] shrink-0">
            <button
              onClick={() => setMenuVisible(false)}
              className="w-full py-2.5 rounded-xl bg-[#00e599] hover:bg-[#00d084] active:scale-[0.99] text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Close Menu & Return to Chart</span>
            </button>
          </div>
        </div>
      </div>

      {/* PIN Unlock Modal when Menu is Locked ("Lock laga menu ma 1234 ok") */}
      {showPinUnlockModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xs bg-[#0c121e]/95 backdrop-blur-2xl border border-amber-400/30 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(251,191,36,0.15)] text-center">
            {/* Top Amber glow effect */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full" />

            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-[0_0_24px_rgba(251,191,36,0.25)]">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5">
              <span>Menu is Locked</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-black">
                1234
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 mb-2">
              Enter 4-digit passcode <strong className="text-amber-300 font-mono">1234</strong> to open trading panel
            </p>

            {/* 4 Digit Visual Dots Indicator */}
            <div className="flex items-center justify-center gap-3 my-2.5">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                      isFilled
                        ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24] scale-110'
                        : 'bg-white/10 border border-white/20'
                    }`}
                  />
                );
              })}
            </div>

            <div className="space-y-2.5">
              {/* Manual keyboard input */}
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="PIN: 1234"
                value={enteredPin}
                onChange={(e) => {
                  setPinError(null);
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setEnteredPin(val);
                  if (val === menuPin || val === '1234') {
                    setUnlockedForSession(true);
                    setShowPinUnlockModal(false);
                    setMenuVisible(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (enteredPin === menuPin || enteredPin === '1234') {
                      setUnlockedForSession(true);
                      setShowPinUnlockModal(false);
                      setMenuVisible(true);
                    } else {
                      setPinError('Incorrect PIN! Default is 1234');
                    }
                  }
                }}
                className="w-full text-center tracking-[0.4em] text-lg font-mono font-black py-2 px-3 bg-black/40 border border-white/15 focus:border-amber-400 rounded-xl text-white outline-none"
              />

              {pinError && (
                <div className="text-[11px] font-bold text-rose-400 animate-fadeIn">
                  {pinError}
                </div>
              )}

              {/* Touch keypad for mobile convenience */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => {
                      setPinError(null);
                      if (btn === 'C') {
                        setEnteredPin('');
                      } else if (btn === '⌫') {
                        setEnteredPin((prev) => prev.slice(0, -1));
                      } else {
                        if (enteredPin.length < 4) {
                          const nextPin = enteredPin + btn;
                          setEnteredPin(nextPin);
                          if (nextPin === menuPin || nextPin === '1234') {
                            setUnlockedForSession(true);
                            setShowPinUnlockModal(false);
                            setMenuVisible(true);
                          } else if (nextPin.length === 4) {
                            setPinError('Incorrect PIN! Default is 1234');
                          }
                        }
                      }
                    }}
                    className={`py-2 rounded-xl font-mono text-sm font-black transition-all cursor-pointer active:scale-95 ${
                      btn === 'C'
                        ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                        : btn === '⌫'
                        ? 'bg-white/[0.05] border border-white/10 text-slate-300 hover:bg-white/10'
                        : 'bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 active:bg-amber-400/20'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinUnlockModal(false);
                    setUnlockedForSession(false);
                    setMenuVisible(false);
                    setEnteredPin('');
                  }}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (enteredPin === menuPin || enteredPin === '1234') {
                      setUnlockedForSession(true);
                      setShowPinUnlockModal(false);
                      setMenuVisible(true);
                    } else {
                      setPinError('Incorrect PIN! Default is 1234');
                    }
                  }}
                  className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs cursor-pointer shadow-md transition-colors"
                >
                  Unlock 🔓
                </button>
              </div>

              {/* Instant 1-tap quick unlock */}
              <button
                type="button"
                onClick={() => {
                  setEnteredPin('1234');
                  setUnlockedForSession(true);
                  setShowPinUnlockModal(false);
                  setMenuVisible(true);
                }}
                className="w-full py-2 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <span>⚡ Quick Unlock (1234)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
