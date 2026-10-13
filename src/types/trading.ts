export type AccountType = 'DEMO' | 'REAL';

export type TradeDirection = 'UP' | 'DOWN' | 'CALL' | 'PUT';

export type TradeStatus = 'OPEN' | 'WON' | 'LOST' | 'CLOSED' | 'TIE';

export type MarketBehaviorMode =
  | 'REAL'
  | 'WIN'
  | 'LOSS'
  | 'smart_push'
  | 'force_loss'
  | 'realistic'
  | 'bull_trend'
  | 'bear_trend'
  | string;

export type ChartType = 'candlestick' | 'heikinAshi' | 'area' | 'line';

export type WatermarkType = 'text' | 'logo' | 'both';

export type DrawingToolType =
  | 'none'
  | 'trendline'
  | 'horizontal'
  | 'vertical'
  | 'ray'
  | 'channel'
  | 'rectangle'
  | 'fibonacci'
  | 'freehand'
  | 'crosshair';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  category: string;
  payout: number;
  currentPrice: number;
  decimalPlaces: number;
  volatility: number;
  change24h?: number;
  flag?: string;
  baseCurrency?: string;
  quoteCurrency?: string;
  isOtc?: boolean;
}

export interface Trade {
  id: string;
  assetId: string;
  assetName: string;
  direction: TradeDirection;
  amount: number;
  entryPrice: number;
  exitPrice?: number;
  payoutRate: number;
  potentialProfit: number;
  profit?: number;
  actualProfit?: number;
  isWin?: boolean;
  status: TradeStatus;
  openTime: number;
  closeTime: number;
  candleTime?: number;
  durationSeconds: number;
  accountType: AccountType;
}

export interface DepositTransaction {
  id: string;
  amount: number;
  bonusAmount: number;
  totalCredited: number;
  method: string;
  txHash: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING';
  createdAt: number;
  accountType: AccountType;
  promoCode?: string;
  senderDetails?: string;
  balanceAfter: number;
}

export interface WithdrawalTransaction {
  id: string;
  amount: number;
  method: string;
  destinationAccount: string;
  accountHolderName: string;
  fee: number;
  balanceAfter: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING';
  createdAt: number;
  accountType: AccountType;
  txId: string;
}

export interface IndicatorSettings {
  sma: boolean;
  smaPeriod: number;
  ema: boolean;
  emaPeriod: number;
  bbands: boolean;
  bbandsPeriod: number;
  bbandsStdDev: number;
  rsi: boolean;
  rsiPeriod: number;
  macd: boolean;
  macdFast: number;
  macdSlow: number;
  macdSignal: number;
  stoch: boolean;
  stochK: number;
  stochD: number;
  parabolicSar?: boolean;
}

export interface DrawnLine {
  id: string;
  type: DrawingToolType;
  time1?: number;
  price1: number;
  time2?: number;
  price2?: number;
  price3?: number;
  color: string;
  strokeWidth?: number;
  lineWidth?: number;
  label?: string;
  offsetPrice?: number;
  visible?: boolean;
  points?: { time: number; price: number }[];
}

export interface OrderToast {
  id: string;
  assetSymbol: string;
  direction: TradeDirection;
  amount: number;
  payoutRate: number;
  price: number;
  timestamp: number;
}

export type CandleColorScheme =
  | 'classic'
  | 'neon'
  | 'cyanOrange'
  | 'purpleYellow'
  | 'monochrome';

export interface ColorPalette {
  label: string;
  subtitle: string;
  bullish: string;
  bearish: string;
  bullishBg?: string;
  bearishBg?: string;
}

export const CANDLE_COLOR_SCHEMES: Record<CandleColorScheme, ColorPalette> = {
  classic: {
    label: 'Quotex Classic',
    subtitle: 'Standard Emerald Green & Scarlet Red',
    bullish: '#00e599',
    bearish: '#ff3355',
    bullishBg: 'rgba(0, 229, 153, 0.15)',
    bearishBg: 'rgba(255, 51, 85, 0.15)'
  },
  neon: {
    label: 'Cyber Neon',
    subtitle: 'High contrast electric neon palette',
    bullish: '#00ffcc',
    bearish: '#ff007f',
    bullishBg: 'rgba(0, 255, 204, 0.15)',
    bearishBg: 'rgba(255, 0, 127, 0.15)'
  },
  cyanOrange: {
    label: 'Cyan & Amber',
    subtitle: 'Modern crypto exchange trading tones',
    bullish: '#06b6d4',
    bearish: '#f97316',
    bullishBg: 'rgba(6, 182, 212, 0.15)',
    bearishBg: 'rgba(249, 115, 22, 0.15)'
  },
  purpleYellow: {
    label: 'Violet & Gold',
    subtitle: 'Ultra VIP luxury aesthetic',
    bullish: '#a855f7',
    bearish: '#eab308',
    bullishBg: 'rgba(168, 85, 247, 0.15)',
    bearishBg: 'rgba(234, 179, 8, 0.15)'
  },
  monochrome: {
    label: 'Minimal Monochrome',
    subtitle: 'Clean high-contrast architectural style',
    bullish: '#f8fafc',
    bearish: '#475569',
    bullishBg: 'rgba(248, 250, 252, 0.15)',
    bearishBg: 'rgba(71, 85, 105, 0.15)'
  }
};
