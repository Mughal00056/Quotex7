import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  Minus,
  Plus,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Percent,
  DollarSign,
  Clock
} from 'lucide-react';

interface QuotexConsoleProps {
  onOpenAssetModal: () => void;
}

export const QuotexConsole: React.FC<QuotexConsoleProps> = ({ onOpenAssetModal }) => {
  const {
    assets,
    activeAsset,
    setActiveAsset,
    accountType,
    demoBalance,
    realBalance,
    setRealBalanceDirect,
    resetDemoBalance,
    placeTrade
  } = useTrading();

  // Investment state directly editable by user
  const [investmentAmount, setInvestmentAmount] = useState<number>(100);
  const [investmentInputStr, setInvestmentInputStr] = useState<string>('100');
  const [isPercentMode, setIsPercentMode] = useState<boolean>(false);
  const [percentValue, setPercentValue] = useState<number>(5); // 5% default when switched to %
  const [showPercentPicker, setShowPercentPicker] = useState<boolean>(false);

  // Expiration state: TIME vs TIMER
  const [expirationMode, setExpirationMode] = useState<'time' | 'timer'>('timer');
  const [durationSeconds, setDurationSeconds] = useState<number>(60); // 1m (60s) default
  const [timeOffsetMinutes, setTimeOffsetMinutes] = useState<number>(1); // 1 min next close in Time mode
  const [showExpirationPicker, setShowExpirationPicker] = useState<boolean>(false);
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  const [pendingTrade, setPendingTrade] = useState<boolean>(false);

  const currentBalance = accountType === 'DEMO' ? demoBalance : realBalance;
  const payoutRate = activeAsset.payout;

  // Real-time clock update (throttled to 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick asset cycling up and down (Upar / Nicha ke liye)
  const currentAssetIndex = assets.findIndex((a) => a.id === activeAsset.id);
  const handlePrevAsset = () => {
    const prevIdx = (currentAssetIndex - 1 + assets.length) % assets.length;
    setActiveAsset(assets[prevIdx]);
  };
  const handleNextAsset = () => {
    const nextIdx = (currentAssetIndex + 1) % assets.length;
    setActiveAsset(assets[nextIdx]);
  };

  // Flag representations
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

  const parts = activeAsset.symbol.split('/');
  const flag1 = getFlag(parts[0]);
  const flag2 = getFlag(parts[1] || '');

  // Calculate current trade dollar amount
  const effectiveInvestment = isPercentMode
    ? Math.max(1, Number(((currentBalance * percentValue) / 100).toFixed(2)))
    : investmentAmount;

  // Percentage of balance that this trade represents
  const effectivePercentage = currentBalance > 0
    ? Number(((effectiveInvestment / currentBalance) * 100).toFixed(1))
    : 0;

  // Total payout
  const totalPayout = Number(
    (effectiveInvestment + effectiveInvestment * (payoutRate / 100)).toFixed(2)
  );

  // Auto-adjust investment if balance drops below
  useEffect(() => {
    if (!isPercentMode && currentBalance >= 1 && investmentAmount > currentBalance) {
      const clamped = Math.max(1, Math.floor(currentBalance));
      setInvestmentAmount(clamped);
      setInvestmentInputStr(clamped.toString());
    }
  }, [accountType, currentBalance, isPercentMode, investmentAmount]);

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerOptions = [
    { tag: '5s', seconds: 5 },
    { tag: '10s', seconds: 10 },
    { tag: '15s', seconds: 15 },
    { tag: '30s', seconds: 30 },
    { tag: '1m', seconds: 60 },
    { tag: '2m', seconds: 120 },
    { tag: '3m', seconds: 180 },
    { tag: '4m', seconds: 240 },
    { tag: '5m', seconds: 300 }
  ];

  const timeOptions = [
    { tag: '+1m', offset: 1 },
    { tag: '+2m', offset: 2 },
    { tag: '+3m', offset: 3 },
    { tag: '+4m', offset: 4 },
    { tag: '+5m', offset: 5 },
    { tag: '+15m', offset: 15 },
    { tag: '+30m', offset: 30 },
    { tag: '+1h', offset: 60 }
  ];

  const getTargetTimeForOffset = (minsOffset: number) => {
    const d = new Date(nowTimestamp + minsOffset * 60 * 1000);
    d.setSeconds(0, 0);
    return d.getTime();
  };

  const getFormattedTimeClose = (minsOffset: number) => {
    const targetT = getTargetTimeForOffset(minsOffset);
    const d = new Date(targetT);
    return `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStepExpiration = (dir: -1 | 1) => {
    if (expirationMode === 'timer') {
      const curIdx = timerOptions.findIndex((o) => o.seconds === durationSeconds);
      if (curIdx !== -1) {
        const nextIdx = Math.max(0, Math.min(timerOptions.length - 1, curIdx + dir));
        setDurationSeconds(timerOptions[nextIdx].seconds);
      } else {
        setDurationSeconds(Math.max(5, durationSeconds + dir * 5));
      }
    } else {
      const curIdx = timeOptions.findIndex((o) => o.offset === timeOffsetMinutes);
      if (curIdx !== -1) {
        const nextIdx = Math.max(0, Math.min(timeOptions.length - 1, curIdx + dir));
        setTimeOffsetMinutes(timeOptions[nextIdx].offset);
      } else {
        setTimeOffsetMinutes(Math.max(1, timeOffsetMinutes + dir));
      }
    }
  };

  const percentPresets = [1, 2, 5, 10, 20, 50];

  const handleStepInvestment = (dir: -1 | 1) => {
    if (isPercentMode) {
      const curIdx = percentPresets.indexOf(percentValue);
      if (curIdx !== -1) {
        const nextIdx = Math.max(0, Math.min(percentPresets.length - 1, curIdx + dir));
        setPercentValue(percentPresets[nextIdx]);
      } else {
        setPercentValue(Math.max(1, Math.min(100, percentValue + dir)));
      }
      return;
    }

    let step = 1;
    if (investmentAmount >= 10 && investmentAmount < 50) step = 5;
    else if (investmentAmount >= 50 && investmentAmount < 200) step = 10;
    else if (investmentAmount >= 200 && investmentAmount < 500) step = 50;
    else if (investmentAmount >= 500 && investmentAmount < 2000) step = 100;
    else if (investmentAmount >= 2000) step = 500;

    const maxAllowed = currentBalance >= 1 ? Math.max(1, Math.floor(currentBalance)) : 100000;
    const nextVal = Math.max(1, Math.min(maxAllowed, investmentAmount + dir * step));
    setInvestmentAmount(nextVal);
    setInvestmentInputStr(nextVal.toString());
  };

  const handleInvestmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    if (isPercentMode) {
      const parsed = parseInt(rawVal, 10);
      if (!isNaN(parsed)) {
        setPercentValue(Math.max(1, Math.min(100, parsed)));
      } else if (rawVal === '') {
        setPercentValue(1);
      }
      return;
    }
    setInvestmentInputStr(rawVal);
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed) && parsed > 0) {
      setInvestmentAmount(parsed);
    }
  };

  const handleInvestmentBlur = () => {
    if (isPercentMode) return;
    if (investmentAmount <= 0) {
      const fallback = currentBalance >= 10 ? 10 : Math.max(1, Math.floor(currentBalance || 10));
      setInvestmentAmount(fallback);
      setInvestmentInputStr(fallback.toString());
    } else {
      setInvestmentInputStr(investmentAmount.toString());
    }
  };

  const handleTrade = (direction: 'UP' | 'DOWN') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {}
    }

    // Smoothly provide balance if 0 without showing any error banner
    if (currentBalance < 1) {
      if (accountType === 'REAL') {
        setRealBalanceDirect(1000);
      } else {
        resetDemoBalance();
      }
    }

    let tradeAmt = effectiveInvestment;
    if (tradeAmt <= 0) {
      tradeAmt = Math.min(10, Math.max(1, currentBalance || 10));
      setInvestmentAmount(tradeAmt);
      setInvestmentInputStr(tradeAmt.toString());
    }

    if (tradeAmt > currentBalance && currentBalance >= 1) {
      tradeAmt = Number(currentBalance.toFixed(2));
      if (!isPercentMode) {
        setInvestmentAmount(tradeAmt);
        setInvestmentInputStr(tradeAmt.toString());
      }
    }

    const now = Date.now();
    const elapsedSec = Math.floor(now / 1000) % 60;
    const remainingInCurrentCandle = 60 - elapsedSec;

    let tradeDurationSec = durationSeconds;
    if (expirationMode === 'timer') {
      if (durationSeconds === 60) {
        tradeDurationSec = remainingInCurrentCandle >= 30 ? remainingInCurrentCandle : 60;
      } else {
        tradeDurationSec = durationSeconds;
      }
    } else {
      const targetT = getTargetTimeForOffset(timeOffsetMinutes);
      tradeDurationSec = Math.max(5, Math.ceil((targetT - now) / 1000));
    }

    placeTrade(direction, tradeAmt, tradeDurationSec);
  };

  const toggleInvestmentSwitch = () => {
    if (isPercentMode) {
      setIsPercentMode(false);
      const computedDollar = Math.max(1, Math.round((currentBalance * percentValue) / 100));
      setInvestmentAmount(computedDollar);
      setInvestmentInputStr(computedDollar.toString());
    } else {
      setIsPercentMode(true);
      const computedPct = currentBalance > 0
        ? Math.max(1, Math.min(100, Math.round((investmentAmount / currentBalance) * 100)))
        : 5;
      setPercentValue(computedPct);
    }
  };

  return (
    <div className="bg-[#080d16]/80 backdrop-blur-2xl border-t border-white/[0.08] px-3 pt-2.5 pb-2.5 select-none relative z-20 shadow-[0_-12px_36px_rgba(0,0,0,0.5)]">
      {/* Row 1: Asset Market Selector with Square Glass Button & Up/Down Square Arrow Navigation */}
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {/* Main Square/Pill Glass Button for Asset Market Selector */}
          <button
            onClick={onOpenAssetModal}
            className="h-10 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.1] backdrop-blur-xl flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all cursor-pointer group min-w-0"
            title="Open Asset Market Selector"
          >
            {/* Dynamic Circular Flag Badges */}
            <div className="flex items-center -space-x-1.5 shrink-0">
              <span className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-[11px] font-bold border border-white/[0.12] shadow-xs">
                {flag1}
              </span>
              <span className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-[11px] font-bold border border-white/[0.12] shadow-xs">
                {flag2}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-black text-xs sm:text-sm text-white tracking-wide group-hover:text-cyan-300 transition-colors truncate">
                {activeAsset.symbol}
              </span>
              <span className="text-amber-400 font-black text-xs font-mono-num shrink-0">
                {payoutRate}%
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
          </button>

          {/* Square Arrow Button UP (Upar ka liya) */}
          <button
            onClick={handlePrevAsset}
            className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] active:scale-90 border border-white/[0.1] backdrop-blur-xl flex items-center justify-center text-slate-300 hover:text-cyan-300 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all cursor-pointer shrink-0"
            title="Previous Asset (Up)"
          >
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Square Arrow Button DOWN (Nicha ka liya) */}
          <button
            onClick={handleNextAsset}
            className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] active:scale-90 border border-white/[0.1] backdrop-blur-xl flex items-center justify-center text-slate-300 hover:text-cyan-300 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all cursor-pointer shrink-0"
            title="Next Asset (Down)"
          >
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Right: Pending Trade Glass Toggle */}
        <div className="flex items-center gap-1.5 shrink-0 bg-white/[0.03] backdrop-blur-md px-2 py-1 rounded-xl border border-white/[0.06]">
          <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
            PENDING
          </span>
          <button
            onClick={() => setPendingTrade(!pendingTrade)}
            className={`w-8 h-4.5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
              pendingTrade ? 'bg-cyan-500 justify-end' : 'bg-white/[0.1] justify-start'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md transition-transform" />
          </button>
        </div>
      </div>

      {/* Row 2: Two Side-by-Side Control Boxes: TIME & TIMER + INVESTMENT in Glass UI */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5 relative">
        {/* Box 1: Quotex Time & Timer Expiration Glass Box */}
        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] rounded-2xl px-2.5 py-1.5 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all">
          {/* Top Row: TIME vs TIMER Tab Switcher */}
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
            <div className="flex items-center gap-1 bg-black/25 p-0.5 rounded-lg border border-white/[0.06]">
              <button
                onClick={() => setExpirationMode('time')}
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                  expirationMode === 'time'
                    ? 'bg-cyan-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Time
              </button>
              <button
                onClick={() => setExpirationMode('timer')}
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                  expirationMode === 'timer'
                    ? 'bg-cyan-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Timer
              </button>
            </div>

            <button
              onClick={() => setShowExpirationPicker(!showExpirationPicker)}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 cursor-pointer"
              title="Select Expiration"
            >
              <span>{expirationMode === 'time' ? `+${timeOffsetMinutes}m` : `${durationSeconds}s`}</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Stepper & Value */}
          <div className="flex items-center justify-between mt-1">
            <button
              onClick={() => handleStepExpiration(-1)}
              className="w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.1] text-slate-100 flex items-center justify-center transition-all cursor-pointer shrink-0 backdrop-blur-md active:scale-90"
              title="Decrease Expiration"
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>

            <span className="font-mono-num text-sm sm:text-base font-bold text-white px-1">
              {expirationMode === 'time'
                ? getFormattedTimeClose(timeOffsetMinutes)
                : formatTimerDisplay(durationSeconds)}
            </span>

            <button
              onClick={() => handleStepExpiration(1)}
              className="w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.1] text-slate-100 flex items-center justify-center transition-all cursor-pointer shrink-0 backdrop-blur-md active:scale-90"
              title="Increase Expiration"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Bottom Caption: Mode Indicator */}
          <div className="flex items-center justify-between text-[10px] font-bold -mt-0.5 pt-0.5">
            <button
              onClick={() => setExpirationMode(expirationMode === 'time' ? 'timer' : 'time')}
              className="text-slate-400 hover:text-cyan-400 uppercase tracking-wider cursor-pointer"
            >
              {expirationMode === 'time' ? 'CLOCK CLOSE' : 'COUNTDOWN'}
            </button>
            <button
              onClick={() => setShowExpirationPicker(!showExpirationPicker)}
              className="text-cyan-400 hover:underline uppercase tracking-wider cursor-pointer"
            >
              {expirationMode === 'time' ? `+${timeOffsetMinutes}m` : `${durationSeconds}s`}
            </button>
          </div>

          {/* Expiration Picker Dropdown Menu */}
          {showExpirationPicker && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowExpirationPicker(false)}
              />
              <div className="absolute bottom-full left-0 mb-1.5 w-full bg-[#0c121e]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2.5 z-40 animate-fadeIn">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.08]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{expirationMode === 'time' ? 'Time Options' : 'Timer Options'}</span>
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setExpirationMode('time')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        expirationMode === 'time' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-400'
                      }`}
                    >
                      Time
                    </button>
                    <button
                      onClick={() => setExpirationMode('timer')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        expirationMode === 'timer' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-400'
                      }`}
                    >
                      Timer
                    </button>
                  </div>
                </div>

                {expirationMode === 'time' ? (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">
                      Upcoming Expirations:
                    </span>
                    <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                      {timeOptions.map((opt) => {
                        const targetT = getTargetTimeForOffset(opt.offset);
                        const d = new Date(targetT);
                        const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d
                          .getMinutes()
                          .toString()
                          .padStart(2, '0')}`;
                        const rem = Math.max(5, Math.ceil((targetT - nowTimestamp) / 1000));
                        const isSel = timeOffsetMinutes === opt.offset;
                        return (
                          <button
                            key={opt.offset}
                            onClick={() => {
                              setTimeOffsetMinutes(opt.offset);
                              setShowExpirationPicker(false);
                            }}
                            className={`py-1.5 px-2 rounded-lg text-left transition-colors cursor-pointer flex items-center justify-between ${
                              isSel
                                ? 'bg-cyan-400 text-slate-950 font-black'
                                : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                            }`}
                          >
                            <span className="text-xs font-mono font-bold">{timeStr}</span>
                            <span className="text-[10px] font-mono opacity-80">{rem}s</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">
                      Duration Presets:
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {timerOptions.map((opt) => (
                        <button
                          key={opt.seconds}
                          onClick={() => {
                            setDurationSeconds(opt.seconds);
                            setShowExpirationPicker(false);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer text-center ${
                            durationSeconds === opt.seconds
                              ? 'bg-cyan-400 text-slate-950 font-black'
                              : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                          }`}
                        >
                          {opt.tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Box 2: Investment Glass Box Directly Editable */}
        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] rounded-2xl px-2.5 py-1.5 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
              <span>Investment</span>
            </span>

            {/* Live Percentage Badge */}
            <button
              onClick={() => setShowPercentPicker(!showPercentPicker)}
              className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
                isPercentMode
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white/[0.06] text-amber-300 border border-white/[0.1]'
              }`}
              title="Click to select percentage of balance"
            >
              <span>{isPercentMode ? `${percentValue}%` : `${effectivePercentage}%`}</span>
              <ChevronDown className="w-2.5 h-2.5 stroke-[3]" />
            </button>
          </div>

          {/* Stepper & Text Input */}
          <div className="flex items-center justify-between mt-1">
            <button
              onClick={() => handleStepInvestment(-1)}
              className="w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.1] text-slate-100 flex items-center justify-center transition-all cursor-pointer shrink-0 backdrop-blur-md active:scale-90"
              title="Decrease Investment"
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>

            <div className="flex items-center justify-center font-mono-num text-sm sm:text-base font-bold text-white px-1 py-0.5">
              <span className="text-slate-400 mr-0.5 text-xs font-normal">
                {isPercentMode ? '%' : '$'}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={isPercentMode ? percentValue : investmentInputStr}
                onChange={handleInvestmentInputChange}
                onBlur={handleInvestmentBlur}
                className="w-16 sm:w-20 text-center bg-transparent outline-none font-bold text-white text-sm sm:text-base focus:text-cyan-300 transition-colors"
                title="Enter custom amount or percentage"
              />
            </div>

            <button
              onClick={() => handleStepInvestment(1)}
              className="w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.1] text-slate-100 flex items-center justify-center transition-all cursor-pointer shrink-0 backdrop-blur-md active:scale-90"
              title="Increase Investment"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Switch Mode CTA */}
          <div className="flex items-center justify-between text-[10px] font-bold -mt-0.5 pt-0.5">
            <button
              onClick={toggleInvestmentSwitch}
              className="text-cyan-400 hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              title="Switch between $ and %"
            >
              <Percent className="w-2.5 h-2.5 text-cyan-400" />
              <span>{isPercentMode ? 'SWITCH TO $' : 'SWITCH TO %'}</span>
            </button>

            <span className="text-slate-400 font-mono-num text-[10px]">
              {isPercentMode ? `$${effectiveInvestment.toFixed(2)}` : `${effectivePercentage}% bal`}
            </span>
          </div>

          {/* Percentage Presets Selector Dropdown with Glass styling */}
          {showPercentPicker && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowPercentPicker(false)}
              />
              <div className="absolute bottom-full right-0 mb-1.5 w-52 bg-[#0c121e]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2.5 z-40 animate-fadeIn">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.08]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Percent className="w-3 h-3 text-amber-400" />
                    <span>Select Trade % of Balance</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 mb-2">
                  {percentPresets.map((pct) => (
                    <button
                      key={pct}
                      onClick={() => {
                        setPercentValue(pct);
                        setIsPercentMode(true);
                        setShowPercentPicker(false);
                      }}
                      className={`py-1.5 px-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer text-center ${
                        isPercentMode && percentValue === pct
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-white/[0.08] flex items-center justify-between text-[10px]">
                  <button
                    onClick={() => {
                      setIsPercentMode(false);
                      setShowPercentPicker(false);
                    }}
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Reset to Dollar ($)
                  </button>
                  <span className="font-mono text-slate-400">
                    ≈ ${((currentBalance * percentValue) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 3: Payout and Buy / Sell Buttons with Radiant Glass Glow */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* BUY / UP Button (Radiant Emerald Glass) */}
        <button
          onClick={() => handleTrade('UP')}
          className="relative bg-gradient-to-r from-emerald-500/90 to-emerald-400/90 hover:from-emerald-400 hover:to-emerald-300 active:scale-[0.98] text-slate-950 font-black rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_24px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-emerald-300/40 backdrop-blur-md transition-all cursor-pointer overflow-hidden group"
        >
          <div className="flex flex-col items-start leading-tight">
            <span className="font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs text-slate-950">
              BUY / CALL
            </span>
            <span className="text-[10px] text-slate-900 font-bold opacity-90 mt-0.5">
              Payout: <strong className="font-mono-num text-slate-950 font-black">${totalPayout.toFixed(2)}</strong>
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-black/15 flex items-center justify-center shrink-0 group-hover:translate-y-[-2px] transition-transform shadow-xs">
            <ArrowUp className="w-5 h-5 text-slate-950 stroke-[3.2]" />
          </div>
        </button>

        {/* SELL / DOWN Button (Radiant Rose Glass) */}
        <button
          onClick={() => handleTrade('DOWN')}
          className="relative bg-gradient-to-r from-rose-500/90 to-rose-400/90 hover:from-rose-400 hover:to-rose-300 active:scale-[0.98] text-white font-black rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_24px_rgba(244,63,94,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-rose-300/40 backdrop-blur-md transition-all cursor-pointer overflow-hidden group"
        >
          <div className="flex flex-col items-start leading-tight">
            <span className="font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs text-white">
              SELL / PUT
            </span>
            <span className="text-[10px] text-rose-100 font-bold opacity-90 mt-0.5">
              Payout: <strong className="font-mono-num text-white font-black">${totalPayout.toFixed(2)}</strong>
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-y-[2px] transition-transform shadow-xs">
            <ArrowDown className="w-5 h-5 text-white stroke-[3.2]" />
          </div>
        </button>
      </div>
    </div>
  );
};
