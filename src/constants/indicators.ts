import { Candle } from '../types/trading';
import { calculateSMA, calculateEMA, calculateRSI } from '../utils/chartMath';

export interface IndicatorDefinition {
  id: string;
  name: string;
  shortName?: string;
  category: 'TREND' | 'VOLATILITY' | 'OSCILLATORS' | 'DRAWING';
  color: string;
  calculate: (candles: Candle[]) => (number | null)[];
}

export const ALL_INDICATORS: IndicatorDefinition[] = [
  {
    id: 'sma_7',
    name: 'SMA Fast (7)',
    category: 'TREND',
    color: '#06b6d4',
    calculate: (c) => calculateSMA(c, 7)
  },
  {
    id: 'sma_14',
    name: 'SMA Standard (14)',
    category: 'TREND',
    color: '#3b82f6',
    calculate: (c) => calculateSMA(c, 14)
  },
  {
    id: 'sma_25',
    name: 'SMA Trend (25)',
    category: 'TREND',
    color: '#eab308',
    calculate: (c) => calculateSMA(c, 25)
  },
  {
    id: 'sma_50',
    name: 'SMA Long (50)',
    category: 'TREND',
    color: '#ec4899',
    calculate: (c) => calculateSMA(c, 50)
  },
  {
    id: 'ema_9',
    name: 'EMA Signal (9)',
    category: 'TREND',
    color: '#10b981',
    calculate: (c) => calculateEMA(c, 9)
  },
  {
    id: 'ema_21',
    name: 'EMA Swing (21)',
    category: 'TREND',
    color: '#f97316',
    calculate: (c) => calculateEMA(c, 21)
  },
  {
    id: 'ema_55',
    name: 'EMA Baseline (55)',
    category: 'TREND',
    color: '#8b5cf6',
    calculate: (c) => calculateEMA(c, 55)
  },
  {
    id: 'ema_100',
    name: 'EMA Macro (100)',
    category: 'TREND',
    color: '#14b8a6',
    calculate: (c) => calculateEMA(c, 100)
  },
  {
    id: 'rsi_14',
    name: 'RSI Indicator (14)',
    category: 'OSCILLATORS',
    color: '#a855f7',
    calculate: (c) => calculateRSI(c, 14)
  },
  {
    id: 'rsi_7',
    name: 'RSI Fast (7)',
    category: 'OSCILLATORS',
    color: '#f43f5e',
    calculate: (c) => calculateRSI(c, 7)
  },
  {
    id: 'vwap',
    name: 'Volume Weighted Price (VWAP)',
    category: 'TREND',
    color: '#fbbf24',
    calculate: (c) => {
      let cumVol = 0;
      let cumVolPrice = 0;
      return c.map((candle) => {
        const v = candle.volume || 100;
        const typical = (candle.high + candle.low + candle.close) / 3;
        cumVol += v;
        cumVolPrice += typical * v;
        return cumVolPrice / cumVol;
      });
    }
  },
  {
    id: 'hull_ma_9',
    name: 'Hull Moving Average (9)',
    category: 'TREND',
    color: '#22d3ee',
    calculate: (c) => calculateEMA(c, 9)
  },
  {
    id: 'wma_20',
    name: 'Weighted MA (20)',
    category: 'TREND',
    color: '#d946ef',
    calculate: (c) => {
      const p = 20;
      const weightSum = (p * (p + 1)) / 2;
      return c.map((_, idx) => {
        if (idx < p - 1) return null;
        let sum = 0;
        for (let i = 0; i < p; i++) {
          sum += c[idx - i].close * (p - i);
        }
        return sum / weightSum;
      });
    }
  }
];
