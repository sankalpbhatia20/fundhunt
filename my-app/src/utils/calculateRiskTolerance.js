export function calculateRiskTolerance(answers) {
  let riskScore = 0;
  const weights = {
    4: { None: 1, Limited: 2, Good: 3, Extensive: 4 },
    5: { "Preserve capital": 1, Income: 2, "Income and Growth": 3, Growth: 4, "Aggressive Growth": 5 },
    6: { "0-2 years": 1, "3-5 years": 2, "6-10 years": 3, "11-20 years": 4, "20+ years": 5 },
    7: { "Sell all my investments": 1, "Sell some of my investments": 2, "Hold on to my investments": 3, "Buy more investments": 4 },
    8: { Daily: 1, Weekly: 2, Monthly: 3, Quarterly: 4, Annually: 5 },
    9: { "Less than 25%": 1, "25-50%": 2, "50-75%": 3, "More than 75%": 4 },
    10: { "Panic and sell everything": 1, "Sell some investments": 2, "Do nothing and wait it out": 3, "See it as an opportunity to buy more": 4 },
    11: { "Very conservative": 1, "Moderately conservative": 2, Balanced: 3, "Moderately aggressive": 4, "Very aggressive": 5 },
    12: { "No risk": 1, "Below-average risk": 2, "Average risk": 3, "Above-average risk": 4, "Substantial risk": 5 },
    14:
{ Unstable: 1, "Somewhat stable": 2, Stable: 3, "Very stable": 4 }
  };

  Object.entries(answers).forEach(([questionId, answer]) => {
    const id = parseInt(questionId);
    if (weights[id]) {
      riskScore += weights[id][answer] || 0;
    } else if (id === 1) {
      // Age: younger = higher risk tolerance
      riskScore += Math.max(1, 6 - Math.floor(parseInt(answer) / 10));
    } else if (id === 2) {
      // Income: higher = higher risk tolerance
      riskScore += Math.min(5, Math.floor(parseInt(answer) / 20000));
    } else if (id === 3) {
      // Savings rate: higher = higher risk tolerance
      riskScore += Math.min(5, Math.floor(parseInt(answer) / 5));
    } else if (id === 13) {
      // Expected return: higher = higher risk tolerance
      riskScore += Math.min(5, Math.floor(parseInt(answer) / 2));
    } else if (id === 15) {
      // Net worth: higher = higher risk tolerance
      riskScore += Math.min(5, Math.floor(Math.log10(parseInt(answer))));
    }
  });

  const maxScore = Object.keys(weights).length * 5 + 25; // 25 for the 5 numeric questions
  const riskPercentage = (riskScore / maxScore) * 100;

  let riskTolerance;
  if (riskPercentage < 20) riskTolerance = "Very Low";
  else if (riskPercentage < 40) riskTolerance = "Low";
  else if (riskPercentage < 60) riskTolerance = "Moderate";
  else if (riskPercentage < 80) riskTolerance = "High";
  else riskTolerance = "Very High";

  return {
    riskScore,
    riskPercentage,
    riskTolerance,
  };
}

