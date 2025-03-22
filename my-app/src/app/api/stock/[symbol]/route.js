import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request, { params }) {
  try {
    const { symbol } = params;
    const [quote, historicalData] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.historical(symbol, {
        period1: '1y',
        interval: '1d'
      })
    ]);

    // Calculate additional metrics
    const prices = historicalData.map(item => item.close);
    const returns = prices.slice(1).map((price, i) => 
      (price - prices[i]) / prices[i]
    );

    const standardDeviation = calculateStandardDeviation(returns) * Math.sqrt(252); // Annualized
    const sharpeRatio = calculateSharpeRatio(returns, 0.05); // Assuming 5% risk-free rate

    return NextResponse.json({
      ...quote,
      historicalPrices: historicalData.map(item => ({
        date: item.date,
        close: item.close
      })),
      standardDeviation,
      sharpeRatio
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

// Helper functions for calculations
function calculateStandardDeviation(returns) {
  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b) / returns.length);
}

function calculateSharpeRatio(returns, riskFreeRate) {
  const meanReturn = returns.reduce((a, b) => a + b) / returns.length;
  const stdDev = calculateStandardDeviation(returns);
  return (meanReturn - riskFreeRate) / stdDev;
} 