'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowRight, Star, Shield, ChartBar, Play, Users, TrendingUp, LineChart } from 'lucide-react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

const StartupCard = dynamic(() => import('@/components/startup/StartupCard'), { ssr: false })

const STATS = [
  { icon: Users, value: '500+', label: 'Active Investors' },
  { icon: TrendingUp, value: '$25M+', label: 'Total Investments' },
  { icon: LineChart, value: '30%', label: 'Avg. Returns' }
]

const FEATURED_STARTUPS = [
  {
    id: 1,
    companyName: "TechFlow AI",
    tagline: "AI-powered workflow automation",
    description: "Revolutionizing business processes with intelligent automation",
    industry: "AI/ML",
    fundingStage: "Seed",
    fundingAmount: "2000000",
    videoPitch: "https://youtube.com/demo1",
    teamSize: "10-20",
    location: "San Francisco, CA",
    monthlyRevenue: "50000",
    growth: "15%",
    highlights: ["500+ beta users", "97% customer satisfaction", "3x MoM growth"]
  }
]

const PROCESS_STEPS = {
  startups: [
    { title: "Create Your Profile", description: "Showcase your startup with a compelling pitch deck and video" },
    { title: "Get Discovered", description: "Connect with verified investors actively looking for opportunities" },
    { title: "Secure Funding", description: "Close deals and get the capital you need to grow" }
  ],
  investors: [
    { title: "Access Deal Flow", description: "Browse curated startups that match your investment criteria" },
    { title: "Due Diligence", description: "Review comprehensive data and founder assessments" },
    { title: "Invest & Track", description: "Manage your portfolio and track performance in one place" }
  ]
}

const features = [
  {
    title: "Startup Discovery",
    description: "Find promising startups across various industries and stages",
    icon: "🔍"
  },
  {
    title: "Video Pitches",
    description: "Watch 2-minute video pitches from founders directly",
    icon: "🎥"
  },
  {
    title: "Detailed Profiles",
    description: "Access comprehensive startup information and metrics",
    icon: "📊"
  },
  {
    title: "Direct Contact",
    description: "Connect with founders through our secure platform",
    icon: "✉️"
  },
  {
    title: "Deal Flow",
    description: "Manage and track potential investment opportunities",
    icon: "📈"
  },
  {
    title: "Due Diligence",
    description: "Access detailed company documents and financials",
    icon: "📋"
  }
]

const investorPlans = [
  {
    name: "Hobby Investor",
    price: "$0",
    period: "forever",
    features: [
      "View 10 most recent startups",
      "Basic startup information",
      "No video access",
      "No filtering options",
      "No founder contact",
      "Community support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "VC Starter",
    price: "$49",
    period: "per month",
    yearlyPrice: "$499/year",
    yearlyDiscount: "Save $89",
    features: [
      "Full startup directory access",
      "Basic startup filtering",
      "Direct founder contact",
      "Message up to 5 startups/month",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Investing",
    popular: false
  },
  {
    name: "VC Pro",
    price: "$199",
    period: "per month",
    yearlyPrice: "$1,999/year",
    yearlyDiscount: "Save $389",
    features: [
      "Everything in VC Starter",
      "Full video pitch access",
      "Founder psychometric insights",
      "Advanced startup filtering",
      "Priority startup access",
      "Unlimited startup messages",
      "Priority support",
    ],
    cta: "Get Pro Access",
    popular: true
  }
]

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Angel Investor",
    image: "/testimonials/investor1.jpg",
    quote: "FundHunt has transformed how I discover and evaluate startup opportunities."
  },
  {
    name: "David Park",
    role: "Startup Founder",
    image: "/testimonials/founder1.jpg",
    quote: "Within weeks of listing on FundHunt, we connected with three serious investors."
  },
  {
    name: "Michael Ross",
    role: "VC Partner",
    image: "/testimonials/investor2.jpg",
    quote: "The founder assessment tools help us make informed investment decisions faster."
  }
]

// Define pricing features
const freeTierFeatures = [
  "Basic startup listings",
  "Public information access",
  "Shortlist startups",
  "Basic search filters",
  "Monthly newsletter"
];

const proTierFeatures = [
  "Everything in Free tier",
  "Full video pitch access",
  "Founder psychometric insights",
  "Advanced startup filtering",
  "Priority startup access",
  "Unlimited startup messages",
  "Due diligence reports",
  "Priority support",
  "Custom deal flow"
];

export default function Home() {
  const router = useRouter()
  const [latestStartups, setLatestStartups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestStartups()
  }, [])

  const fetchLatestStartups = async () => {
    try {
      const response = await fetch('/api/startups')
      const data = await response.json()
      
      if (data.success) {
        // Take only the first 3 startups
        setLatestStartups(data.startups.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch startups:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div 
                className="inline-block mb-6 px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-blue-100">🚀 Trusted by 500+ investors worldwide</span>
              </motion.div>

              <motion.h1 
                className="text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Where Great Startups Meet 
                <span className="block mt-2">Strategic Investors</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Join our exclusive platform where innovative startups meet strategic investors. 
                Discover opportunities, make connections, and drive growth.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-6 mb-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  size="lg"
                  className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                  onClick={() => router.push('/auth/signin')}
                >
                  List Your Startup
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  className="text-lg px-8 py-6 bg-blue-600/20 backdrop-blur-sm border-2 border-white/40 hover:bg-blue-600/30 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                  onClick={() => {
                    document.getElementById('pricing')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    })
                  }}
                >
                  Join as Investor
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {STATS.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <stat.icon className="w-8 h-8 text-blue-200 mb-3 mx-auto" />
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-blue-200">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.span 
                className="inline-block text-blue-600 font-medium mb-4 px-4 py-1 rounded-full bg-blue-50 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Latest Opportunities
              </motion.span>
              <motion.h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Featured Startup Listings
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Discover our most promising investment opportunities, carefully curated for our investor community
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {loading ? (
                <p>Loading latest startups...</p>
              ) : (
                latestStartups.map((startup, index) => (
                  <motion.div
                    key={startup._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StartupCard startup={startup} />
                  </motion.div>
                ))
              )}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => router.push('/startups')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                View All Startups
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white" id="pricing">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.span 
                className="inline-block text-blue-600 font-medium mb-4 px-4 py-1 rounded-full bg-blue-50 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Simple Pricing
              </motion.span>
              <motion.h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Choose Your Investment Journey
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Start with our free plan or unlock premium features to maximize your investment potential
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="relative border-2 hover:border-blue-200 transition-all duration-200 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <CardHeader className="relative">
                    <CardTitle className="text-2xl">Free Forever</CardTitle>
                    <CardDescription>Perfect for getting started</CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-bold">$0</span>
                      <span className="text-gray-600 ml-2">forever</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-4">
                      {freeTierFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Star className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-8 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => router.push('/auth/signin')}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="relative border-2 border-blue-600 transition-all duration-200 overflow-hidden group transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                    Most Popular
                  </div>
                  <CardHeader className="relative">
                    <CardTitle className="text-2xl">Professional</CardTitle>
                    <CardDescription>For seasoned investors</CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-bold">$199</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-4">
                      {proTierFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Shield className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                      onClick={() => router.push('/auth/signin')}
                    >
                      Start Free Trial
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}