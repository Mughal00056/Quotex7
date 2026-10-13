import { Candle } from '../types/trading';

export function formatPrice(price: number, decimals = 5): string {
  if (price === undefined || price === null || isNaN(price)) return '0.00000';
  return price.toFixed(decimals);
}

export function formatCurrency(amount: number, currency = '$'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currency}0.00`;
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function calculateSMA(candles: Candle[], period = 10): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += candles[i - j].close;
      }
      result.push(sum / period);
    }
  }
  return result;
}

export function calculateEMA(candles: Candle[], period = 21): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prevEma: number | null = null;

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += candles[i - j].close;
      }
      prevEma = sum / period;
      result.push(prevEma);
    } else {
      prevEma = candles[i].close * k + (prevEma as number) * (1 - k);
      result.push(prevEma);
    }
  }
  return result;
}

export function calculateBollingerBands(
  candles: Candle[],
  period = 20,
  stdDevMultiplier = 2
): { upper: (number | null)[]; lower: (number | null)[]; middle: (number | null)[] } {
  const middle = calculateSMA(candles, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    const mid = middle[i];
    if (mid === null || i < period - 1) {
      upper.push(null);
      lower.push(null);
    } else {
      let varianceSum = 0;
      for (let j = 0; j < period; j++) {
        varianceSum += Math.pow(candles[i - j].close - mid, 2);
      }
      const sd = Math.sqrt(varianceSum / period);
      upper.push(mid + sd * stdDevMultiplier);
      lower.push(mid - sd * stdDevMultiplier);
    }
  }

  return { upper, lower, middle };
}

export function calculateRSI(candles: Candle[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (candles.length < period + 1) {
    return candles.map(() => null);
  }

  const changes: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    changes.push(candles[i].close - candles[i - 1].close);
  }

  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < period; i++) {
    const chg = changes[i];
    if (chg >= 0) avgGain += chg;
    else avgLoss += Math.abs(chg);
  }
  avgGain /= period;
  avgLoss /= period;

  result.push(...new Array(period).fill(null));
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push(100 - 100 / (1 + rs));

  for (let i = period; i < changes.length; i++) {
    const chg = changes[i];
    const gain = chg >= 0 ? chg : 0;
    const loss = chg < 0 ? Math.abs(chg) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push(100 - 100 / (1 + rs));
  }

  return result;
}

export function calculateMACD(
  candles: Candle[],
  fast = 12,
  slow = 26,
  signal = 9
): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } {
  const emaFast = calculateEMA(candles, fast);
  const emaSlow = calculateEMA(candles, slow);

  const macdLine: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    const f = emaFast[i];
    const s = emaSlow[i];
    if (f !== null && s !== null) {
      macdLine.push(f - s);
    } else {
      macdLine.push(null);
    }
  }

  const signalLine: (number | null)[] = [];
  const k = 2 / (signal + 1);
  let prevSignal: number | null = null;
  const validMacdIndices = macdLine.map((v, idx) => (v !== null ? idx : -1)).filter((idx) => idx !== -1);

  let validCount = 0;
  let sumFirstSignal = 0;

  for (let i = 0; i < macdLine.length; i++) {
    const m = macdLine[i];
    if (m === null) {
      signalLine.push(null);
    } else {
      validCount++;
      if (validCount < signal) {
        sumFirstSignal += m;
        signalLine.push(null);
      } else if (validCount === signal) {
        sumFirstSignal += m;
        prevSignal = sumFirstSignal / signal;
        signalLine.push(prevSignal);
      } else {
        prevSignal = m * k + (prevSignal as number) * (1 - k);
        signalLine.push(prevSignal);
      }
    }
  }

  const histogram: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    const m = macdLine[i];
    const sig = signalLine[i];
    if (m !== null && sig !== null) {
      histogram.push(m - sig);
    } else {
      histogram.push(null);
    }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}

export function calculateStochastic(
  candles: Candle[],
  kPeriod = 14,
  dPeriod = 3
): { k: (number | null)[]; d: (number | null)[] } {
  const rawK: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < kPeriod - 1) {
      rawK.push(null);
    } else {
      let highestHigh = -Infinity;
      let lowestLow = Infinity;
      for (let j = 0; j < kPeriod; j++) {
        const c = candles[i - j];
        if (c.high > highestHigh) highestHigh = c.high;
        if (c.low < lowestLow) lowestLow = c.low;
      }
      const range = highestHigh - lowestLow;
      if (range === 0) {
        rawK.push(50);
      } else {
        const currentClose = candles[i].close;
        rawK.push(((currentClose - lowestLow) / range) * 100);
      }
    }
  }

  const d: (number | null)[] = [];
  for (let i = 0; i < rawK.length; i++) {
    if (i < kPeriod - 1 + dPeriod - 1) {
      d.push(null);
    } else {
      let sum = 0;
      let valid = true;
      for (let j = 0; j < dPeriod; j++) {
        const val = rawK[i - j];
        if (val === null) {
          valid = false;
          break;
        }
        sum += val;
      }
      d.push(valid ? sum / dPeriod : null);
    }
  }

  return { k: rawK, d };
}

export function toHeikinAshi(candles: Candle[]): Candle[] {
  if (candles.length === 0) return [];
  const haCandles: Candle[] = [];

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const haClose = (c.open + c.high + c.low + c.close) / 4;
    let haOpen: number;

    if (i === 0) {
      haOpen = (c.open + c.close) / 2;
    } else {
      haOpen = (haCandles[i - 1].open + haCandles[i - 1].close) / 2;
    }

    const haHigh = Math.max(c.high, haOpen, haClose);
    const haLow = Math.min(c.low, haOpen, haClose);

    haCandles.push({
      time: c.time,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
      volume: c.volume
    });
  }

  return haCandles;
}
