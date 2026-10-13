import { Asset, Candle } from '../types/trading';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'eur_chf_otc',
    name: 'EUR / CHF (OTC)',
    symbol: 'EUR/CHF OTC',
    category: 'Forex OTC',
    payout: 85,
    currentPrice: 0.94125,
    decimalPlaces: 5,
    volatility: 0.00018,
    change24h: 0.45,
    baseCurrency: 'EUR',
    quoteCurrency: 'CHF',
    flag: '🇪🇺'
  },
  {
    id: 'eur_usd_otc',
    name: 'EUR / USD (OTC)',
    symbol: 'EUR/USD OTC',
    category: 'Forex OTC',
    payout: 93,
    currentPrice: 1.08640,
    decimalPlaces: 5,
    volatility: 0.00022,
    change24h: 1.12,
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    flag: '🇪🇺'
  },
  {
    id: 'gbp_usd_otc',
    name: 'GBP / USD (OTC)',
    symbol: 'GBP/USD OTC',
    category: 'Forex OTC',
    payout: 89,
    currentPrice: 1.29450,
    decimalPlaces: 5,
    volatility: 0.00025,
    change24h: -0.32,
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    flag: '🇬🇧'
  },
  {
    id: 'usd_jpy_otc',
    name: 'USD / JPY (OTC)',
    symbol: 'USD/JPY OTC',
    category: 'Forex OTC',
    payout: 88,
    currentPrice: 154.320,
    decimalPlaces: 3,
    volatility: 0.045,
    change24h: 0.68,
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    flag: '🇺🇸'
  },
  {
    id: 'btc_usd',
    name: 'Bitcoin (Crypto)',
    symbol: 'BTC/USD',
    category: 'Crypto',
    payout: 90,
    currentPrice: 68450.00,
    decimalPlaces: 2,
    volatility: 12.5,
    change24h: 3.84,
    baseCurrency: 'BTC',
    quoteCurrency: 'USD',
    flag: '🪙'
  },
  {
    id: 'eth_usd',
    name: 'Ethereum (Crypto)',
    symbol: 'ETH/USD',
    category: 'Crypto',
    payout: 87,
    currentPrice: 3520.40,
    decimalPlaces: 2,
    volatility: 2.1,
    change24h: 2.15,
    baseCurrency: 'ETH',
    quoteCurrency: 'USD',
    flag: '💎'
  },
  {
    id: 'gold_otc',
    name: 'Gold / USD (OTC)',
    symbol: 'XAU/USD OTC',
    category: 'Commodities',
    payout: 86,
    currentPrice: 2684.50,
    decimalPlaces: 2,
    volatility: 1.15,
    change24h: 0.85,
    baseCurrency: 'XAU',
    quoteCurrency: 'USD',
    flag: '🏆'
  },
  {
    id: 'silver_otc',
    name: 'Silver / USD (OTC)',
    symbol: 'XAG/USD OTC',
    category: 'Commodities',
    payout: 84,
    currentPrice: 31.85,
    decimalPlaces: 3,
    volatility: 0.035,
    change24h: -0.42,
    baseCurrency: 'XAG',
    quoteCurrency: 'USD',
    flag: '🥈'
  },
  {
    id: 'apple_otc',
    name: 'Apple Inc (OTC)',
    symbol: 'AAPL OTC',
    category: 'Stocks OTC',
    payout: 82,
    currentPrice: 232.40,
    decimalPlaces: 2,
    volatility: 0.28,
    change24h: 1.55,
    baseCurrency: 'AAPL',
    quoteCurrency: 'USD',
    flag: '🍎'
  },
  {
    id: 'tesla_otc',
    name: 'Tesla Inc (OTC)',
    symbol: 'TSLA OTC',
    category: 'Stocks OTC',
    payout: 85,
    currentPrice: 218.60,
    decimalPlaces: 2,
    volatility: 0.65,
    change24h: -1.80,
    baseCurrency: 'TSLA',
    quoteCurrency: 'USD',
    flag: '⚡'
  }
];

export function generateHistoricalCandles(
  asset: Asset,
  timeframeSeconds = 60,
  count = 180
): Candle[] {
  const candles: Candle[] = [];
  const now = Math.floor(Date.now() / 1000) * 1000;
  const stepMs = timeframeSeconds * 1000;
  const startTime = now - count * stepMs;

  let currentClose = asset.currentPrice;
  const volatility = asset.volatility || currentClose * 0.0003;

  for (let i = 0; i < count; i++) {
    const candleTime = startTime + i * stepMs;
    // Generate realistic random-walk candle
    const delta = (Math.random() - 0.495) * volatility * 2.2;
    const open = currentClose;
    const close = Number((open + delta).toFixed(asset.decimalPlaces));
    const wickHigh = Math.random() * volatility * 1.5;
    const wickLow = Math.random() * volatility * 1.5;

    const high = Number((Math.max(open, close) + wickHigh).toFixed(asset.decimalPlaces));
    const low = Number((Math.min(open, close) - wickLow).toFixed(asset.decimalPlaces));

    candles.push({
      time: candleTime,
      open,
      high,
      low,
      close,
      volume: Math.floor(100 + Math.random() * 800)
    });

    currentClose = close;
  }

  return candles;
}
