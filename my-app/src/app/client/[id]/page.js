'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import axios from 'axios';
import { Download } from 'lucide-react'

// Mock client data with more details
const mockClients = {
  1: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    lastUpdate: '2024-01-15',
    nextReview: '2024-04-15',
    advisor: 'Sarah Wilson',
    riskScore: 65,
    riskAssessment: {
      age: 35,
      income: 75000,
      savingsRate: 20,
      riskTolerance: 'Moderate',
      financialGoals: 'Retirement and children\'s education',
      existingInvestments: 'Yes, 401(k) and some stocks',
      investmentHorizon: '20-30 years',
      marketFluctuations: 'Somewhat comfortable',
      debt: 'Mortgage and car loan',
      employmentStatus: 'Employed full-time'
    }
  }
}

// Enhanced stock recommendations with allocations
const PORTFOLIO_RECOMMENDATIONS = {
  conservative: [
    {
      symbol: 'HDFCBANK.NS',
      allocation: 25,
      description: 'Large-cap banking stock with stable returns',
      rationale: 'Strong fundamentals and consistent dividend history'
    },
    {
      symbol: 'TCS.NS',
      allocation: 20,
      description: 'Blue-chip IT services company',
      rationale: 'Low volatility and strong cash flows'
    },
    {
      symbol: 'ITC.NS',
      allocation: 20,
      description: 'FMCG and diversified business',
      rationale: 'High dividend yield and defensive stock'
    },
    {
      symbol: 'NESTLEIND.NS',
      allocation: 20,
      description: 'Consumer staples leader',
      rationale: 'Recession-resistant business model'
    },
    {
      symbol: 'HINDUNILVR.NS',
      allocation: 15,
      description: 'FMCG market leader',
      rationale: 'Strong brand portfolio and stable earnings'
    }
  ],
  moderate: [
    {
      symbol: 'RELIANCE.NS',
      allocation: 25,
      description: 'Diversified conglomerate',
      rationale: 'Mix of growth and value'
    },
    {
      symbol: 'INFY.NS',
      allocation: 20,
      description: 'IT services major',
      rationale: 'Growth potential with moderate risk'
    },
    {
      symbol: 'BHARTIARTL.NS',
      allocation: 20,
      description: 'Telecom sector leader',
      rationale: 'Strong market position with growth prospects'
    },
    {
      symbol: 'KOTAKBANK.NS',
      allocation: 20,
      description: 'Private sector bank',
      rationale: 'Quality banking franchise'
    },
    {
      symbol: 'LT.NS',
      allocation: 15,
      description: 'Infrastructure and engineering',
      rationale: 'Cyclical growth opportunities'
    }
  ],
  aggressive: [
    {
      symbol: 'TATAMOTORS.NS',
      allocation: 25,
      description: 'Automotive manufacturer',
      rationale: 'High growth potential in EV space'
    },
    {
      symbol: 'ADANIENT.NS',
      allocation: 20,
      description: 'Infrastructure conglomerate',
      rationale: 'High growth, high risk profile'
    },
    {
      symbol: 'ZOMATO.NS',
      allocation: 20,
      description: 'Food delivery platform',
      rationale: 'New-age business with growth potential'
    },
    {
      symbol: 'PAYTM.NS',
      allocation: 20,
      description: 'Digital payments leader',
      rationale: 'Fintech growth story'
    },
    {
      symbol: 'POLICYBZR.NS',
      allocation: 15,
      description: 'Insurtech platform',
      rationale: 'High-growth insurance sector play'
    }
  ]
};

// Add this component for detailed stock metrics
const StockMetrics = ({ data, allocation }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
      <div className="p-2 bg-gray-50 rounded">
        <p className="text-gray-500">Beta (1Y)</p>
        <p className="font-semibold">{data.beta?.toFixed(2) || 'N/A'}</p>
      </div>
      <div className="p-2 bg-gray-50 rounded">
        <p className="text-gray-500">Volatility (1Y)</p>
        <p className="font-semibold">{data.standardDeviation?.toFixed(2)}%</p>
      </div>
      <div className="p-2 bg-gray-50 rounded">
        <p className="text-gray-500">Sharpe Ratio</p>
        <p className="font-semibold">{data.sharpeRatio?.toFixed(2)}</p>
      </div>
      <div className="p-2 bg-gray-50 rounded">
        <p className="text-gray-500">P/E Ratio</p>
        <p className="font-semibold">{data.trailingPE?.toFixed(2) || 'N/A'}</p>
      </div>
      <div className="p-2 bg-gray-50 rounded">
        <p className="text-gray-500">Dividend Yield</p>
        <p className="font-semibold">{data.dividendYield ? (data.dividendYield * 100).toFixed(2) + '%' : 'N/A'}</p>
      </div>
      <div className="p-2 bg-gray-50 rounded">
        <p className="text-gray-500">Allocation</p>
        <p className="font-semibold text-blue-600">{allocation}%</p>
      </div>
    </div>
  );
};

// Calculate expected return based on risk score
const getExpectedReturn = (riskScore) => {
  // Conservative: 8-12%, Moderate: 12-15%, Aggressive: 15-18%
  if (riskScore < 40) return (8 + (riskScore/40) * 4).toFixed(1);
  if (riskScore < 70) return (12 + ((riskScore-40)/30) * 3).toFixed(1);
  return (15 + ((riskScore-70)/30) * 3).toFixed(1);
};

// Calculate portfolio beta based on stock data and risk category
const getPortfolioBeta = (stockData, riskCategory) => {
  if (Object.keys(stockData).length === 0) return 'N/A';
  
  const recommendations = PORTFOLIO_RECOMMENDATIONS[riskCategory];
  let weightedBeta = 0;
  
  recommendations.forEach(rec => {
    const stock = stockData[rec.symbol];
    if (stock && stock.beta) {
      weightedBeta += (stock.beta * (rec.allocation / 100));
    }
  });
  
  return weightedBeta.toFixed(2);
};

// Calculate portfolio volatility based on risk score
const getPortfolioVolatility = (riskScore) => {
  // Conservative: 10-15%, Moderate: 15-20%, Aggressive: 20-25%
  if (riskScore < 40) return (10 + (riskScore/40) * 5).toFixed(1);
  if (riskScore < 70) return (15 + ((riskScore-40)/30) * 5).toFixed(1);
  return (20 + ((riskScore-70)/30) * 5).toFixed(1);
};

export default function ClientRiskAssessment() {
  const { id } = useParams()
  const router = useRouter()
  const [client, setClient] = useState(null)
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setClient(mockClients[id])
  }, [id])

  // Add this function to determine risk category
  const getRiskCategory = (riskScore) => {
    if (riskScore < 40) return 'conservative';
    if (riskScore < 70) return 'moderate';
    return 'aggressive';
  };

  // Add this useEffect to fetch stock data
  useEffect(() => {
    const fetchStockData = async () => {
      if (!client) return;
      
      const riskCategory = getRiskCategory(client.riskScore);
      const stocks = PORTFOLIO_RECOMMENDATIONS[riskCategory];
      
      try {
        const stockPromises = stocks.map(async (stock) => {
          const response = await axios.get(`/api/stock/${stock.symbol}`); // You'll need to create this API endpoint
          return response.data;
        });
        
        const results = await Promise.all(stockPromises);
        const stockDataMap = {};
        results.forEach((data, index) => {
          stockDataMap[stocks[index].symbol] = data;
        });
        
        setStockData(stockDataMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [client]);

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading client data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold mb-2">{client.name}</h1>
            <p className="text-gray-600">Client Profile and Risk Assessment</p>
          </div>
          <div className="space-x-4">
            <Button variant="outline">Edit Profile</Button>
            <Button>Send New Assessment</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Client Overview</CardTitle>
              <CardDescription>Basic information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{client.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Last Assessment</label>
                <p className="font-medium">{client.lastUpdate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Next Review</label>
                <p className="font-medium text-blue-600">{client.nextReview}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Financial Advisor</label>
                <p className="font-medium">{client.advisor}</p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Score Card */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Score</CardTitle>
              <CardDescription>Overall risk tolerance evaluation</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle
                    className="text-gray-200"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-blue-600"
                    strokeWidth="12"
                    strokeDasharray={350}
                    strokeDashoffset={350 - (350 * client.riskScore) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <span className="absolute text-2xl font-bold">{client.riskScore}%</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">Moderate Risk Tolerance</p>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for this client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Generate Report
              </Button>
              <Button className="w-full" variant="outline">
                Schedule Review
              </Button>
              <Button className="w-full" variant="outline">
                Update Goals
              </Button>
            </CardContent>
          </Card>

          {/* Detailed Assessment Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Detailed Risk Assessment</CardTitle>
              <CardDescription>Comprehensive evaluation of client's risk profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(client.riskAssessment).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <dt className="text-sm text-gray-500 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </dt>
                    <dd className="font-medium">{value}</dd>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Main Portfolio Allocation Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Portfolio Allocation</CardTitle>
              <CardDescription>Based on {client.riskScore}% risk tolerance</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Stocks', value: client.riskScore },
                      { name: 'Bonds', value: 85 - (client.riskScore * 0.7) },
                      { name: 'Cash', value: 15 - (client.riskScore * 0.3) },
                      { name: 'Alternative', value: client.riskScore * 0.2 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.2;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#333"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {`${name} (${value.toFixed(1)}%)`}
                        </text>
                      );
                    }}
                  >
                    {['#0088FE', '#00C49F', '#FFBB28', '#FF8042'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stock Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Allocation Breakdown</CardTitle>
              <CardDescription>Detailed view of stock portfolio composition</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Large Cap', value: 50, description: 'Well-established companies' },
                      { name: 'Mid Cap', value: 30, description: 'Growing companies' },
                      { name: 'Small Cap', value: 20, description: 'Emerging companies' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.2;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#333"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {`${name} (${value}%)`}
                        </text>
                      );
                    }}
                  >
                    {['#0088FE', '#4169E1', '#1E90FF'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 rounded shadow-lg border">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">{data.description}</p>
                            <p className="text-sm font-medium text-blue-600">{data.value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bond Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Bond Allocation Breakdown</CardTitle>
              <CardDescription>Detailed view of bond portfolio composition</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Government', value: 40, description: 'Low-risk federal securities' },
                      { name: 'Corporate', value: 30, description: 'Company-issued debt' },
                      { name: 'Municipal', value: 20, description: 'Tax-advantaged local govt bonds' },
                      { name: 'High Yield', value: 10, description: 'Higher risk, higher return bonds' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.2;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#333"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {`${name} (${value}%)`}
                        </text>
                      );
                    }}
                  >
                    {['#00C49F', '#3CB371', '#98FB98', '#90EE90'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 rounded shadow-lg border">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">{data.description}</p>
                            <p className="text-sm font-medium text-green-600">{data.value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expected Returns Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Projected Returns (10 Years)</CardTitle>
              <CardDescription>Historical performance simulation</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { year: '2024', conservative: 100, moderate: 100, aggressive: 100 },
                    { year: '2025', conservative: 103, moderate: 106, aggressive: 110 },
                    { year: '2026', conservative: 106, moderate: 114, aggressive: 122 },
                    { year: '2027', conservative: 109, moderate: 122, aggressive: 135 },
                    { year: '2028', conservative: 112, moderate: 130, aggressive: 150 },
                    { year: '2029', conservative: 115, moderate: 139, aggressive: 167 },
                    { year: '2030', conservative: 118, moderate: 148, aggressive: 185 },
                    { year: '2031', conservative: 121, moderate: 158, aggressive: 205 },
                    { year: '2032', conservative: 124, moderate: 169, aggressive: 227 },
                    { year: '2033', conservative: 127, moderate: 180, aggressive: 252 }
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="conservative" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="moderate" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="aggressive" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk vs Return Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Risk vs Return Analysis</CardTitle>
              <CardDescription>Expected outcomes for different strategies</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis type="number" dataKey="risk" name="Risk %" domain={[0, 100]} />
                  <YAxis type="number" dataKey="return" name="Return %" domain={[0, 20]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter
                    data={[
                      { risk: 20, return: 4, name: 'Conservative' },
                      { risk: 45, return: 8, name: 'Moderate' },
                      { risk: client.riskScore, return: client.riskScore * 0.15, name: 'Your Profile' },
                      { risk: 80, return: 15, name: 'Aggressive' }
                    ]}
                    fill="#8884d8"
                  >
                    {/* Highlight client's position */}
                    {(entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Your Profile' ? '#ff0000' : '#8884d8'}
                        r={entry.name === 'Your Profile' ? 8 : 6}
                      />
                    )}
                  </Scatter>
                  <Legend />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Historical Volatility Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Historical Volatility</CardTitle>
              <CardDescription>Monthly returns variation</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Jan', conservative: 1, moderate: 2, aggressive: 3 },
                    { month: 'Feb', conservative: -0.5, moderate: -1, aggressive: -2 },
                    { month: 'Mar', conservative: 0.8, moderate: 1.5, aggressive: 2.5 },
                    { month: 'Apr', conservative: 1.2, moderate: 2.2, aggressive: 3.5 },
                    { month: 'May', conservative: -0.3, moderate: -0.8, aggressive: -1.5 },
                    { month: 'Jun', conservative: 0.5, moderate: 1.2, aggressive: 2 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="conservative" stroke="#8884d8" />
                  <Line type="monotone" dataKey="moderate" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="aggressive" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Asset Class Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Class Performance</CardTitle>
              <CardDescription>5-year historical returns by asset class</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { year: '2019', stocks: 31.5, bonds: 8.7, realestate: 25.8, commodities: 17.6 },
                    { year: '2020', stocks: 18.4, bonds: 7.5, realestate: -5.3, commodities: -3.1 },
                    { year: '2021', stocks: 28.7, bonds: -1.5, realestate: 41.3, commodities: 27.1 },
                    { year: '2022', stocks: -18.1, bonds: -13.0, realestate: -25.1, commodities: 16.1 },
                    { year: '2023', stocks: 24.2, bonds: 5.5, realestate: 12.2, commodities: -7.8 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stocks" fill="#8884d8" name="Stocks" />
                  <Bar dataKey="bonds" fill="#82ca9d" name="Bonds" />
                  <Bar dataKey="realestate" fill="#ffc658" name="Real Estate" />
                  <Bar dataKey="commodities" fill="#ff8042" name="Commodities" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Portfolio Diversification Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Diversification Impact</CardTitle>
              <CardDescription>Risk reduction through diversification</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { assets: 1, risk: 28 },
                    { assets: 2, risk: 25 },
                    { assets: 4, risk: 21 },
                    { assets: 6, risk: 18 },
                    { assets: 8, risk: 16 },
                    { assets: 10, risk: 15 },
                    { assets: 12, risk: 14.5 },
                    { assets: 15, risk: 14 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="assets" label={{ value: 'Number of Assets', position: 'bottom' }} />
                  <YAxis label={{ value: 'Portfolio Risk %', angle: -90, position: 'left' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="risk" stroke="#8884d8" dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Stocks Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recommended Portfolio Allocation</CardTitle>
            <CardDescription>
              Personalized stock recommendations based on your {client.riskScore}% risk profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium">Risk Profile: {getRiskCategory(client.riskScore)}</h3>
                    <p className="text-sm text-gray-500">Recommended allocation strategy</p>
                  </div>
                  <Button variant="outline" onClick={() => {/* Add download report function */}}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>

                {/* Portfolio Summary */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Expected Return</p>
                        <p className="text-xl font-bold text-green-600">
                          {getExpectedReturn(client.riskScore)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Portfolio Beta</p>
                        <p className="text-xl font-bold">
                          {getPortfolioBeta(stockData, getRiskCategory(client.riskScore))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Portfolio Volatility</p>
                        <p className="text-xl font-bold text-orange-600">
                          {getPortfolioVolatility(client.riskScore)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stock Recommendations */}
                <div className="space-y-6">
                  {Object.entries(stockData).map(([symbol, data]) => {
                    const recommendation = PORTFOLIO_RECOMMENDATIONS[getRiskCategory(client.riskScore)]
                      .find(r => r.symbol === symbol);
                    
                    return (
                      <motion.div
                        key={symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-lg">{data.longName || symbol}</h3>
                            <p className="text-sm text-gray-500">{recommendation.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{data.regularMarketPrice?.toFixed(2)}</p>
                            <p className={`text-sm ${data.regularMarketChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {data.regularMarketChangePercent?.toFixed(2)}%
                            </p>
                          </div>
                        </div>

                        {/* Price Chart */}
                        <div className="h-32 mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.historicalPrices}>
                              <Line 
                                type="monotone" 
                                dataKey="close" 
                                stroke="#2563eb" 
                                strokeWidth={2} 
                                dot={false} 
                              />
                              <XAxis dataKey="date" hide />
                              <YAxis hide domain={['dataMin', 'dataMax']} />
                              <Tooltip />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        <StockMetrics data={data} allocation={recommendation.allocation} />
                        
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Investment Rationale: </span>
                            {recommendation.rationale}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}