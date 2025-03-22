'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Share, TrendingUp, Users, DollarSign, MapPin, Calendar, Lock, Play } from 'lucide-react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import { LinkedinIcon } from '@/components/icons/LinkedinIcon'
import { useToast } from "@/components/ui/use-toast"

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

export default function StartupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [startup, setStartup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStartupDetails()
  }, [params.id])

  const fetchStartupDetails = async () => {
    try {
      console.log('Fetching startup with ID:', params.id)
      const response = await fetch(`/api/startups/${params.id}`)
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Fetched data:', data)
      if (data.success) {
        setStartup(data.startup)
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to fetch startup details:', error)
      toast({
        title: "Error",
        description: "Failed to load startup details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const membershipTier = 'pro' // Default to 'pro' for now

  const canAccess = (feature) => {
    switch (feature) {
      case 'video':
        return membershipTier === 'pro'
      case 'foundingTeam':
        return ['starter', 'pro'].includes(membershipTier)
      case 'pastInvestors':
        return membershipTier === 'pro'
      case 'founderPsychometrics':
        return membershipTier === 'pro'
      default:
        return false
    }
  }

  const LockedContent = ({ feature, description }) => (
    <div className="text-center p-6 border border-dashed rounded-lg">
      <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p className="text-sm text-gray-500">{description}</p>
      <Button variant="outline" className="mt-4">
        Upgrade Now
      </Button>
    </div>
  )

  const renderHighlights = (highlights) => {
    if (!highlights || !Array.isArray(highlights)) return null;
    return (
      <ul className="list-disc list-inside space-y-2">
        {highlights.map((highlight, index) => (
          <li key={index} className="text-gray-600">{highlight}</li>
        ))}
      </ul>
    );
  };

  const renderPastInvestors = (investors) => {
    if (!investors || !Array.isArray(investors)) return null;
    return (
      <div className="space-y-6">
        {investors.map((investor, index) => (
          <div key={index} className={index !== 0 ? "pt-4 border-t" : ""}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{investor.name}</p>
                <p className="text-sm text-gray-500">{investor.firm}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${investor.amount?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{investor.round}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{investor.portfolio}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderFounders = (founders) => {
    if (!founders || !Array.isArray(founders)) return null;
    return (
      <div className="space-y-6">
        {founders.map((founder, index) => (
          <div key={index} className={index !== 0 ? "pt-4 border-t" : ""}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{founder.name}</p>
                <p className="text-sm text-gray-500">{founder.role}</p>
              </div>
              <a 
                href={founder.linkedinUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-600 mt-2">{founder.background}</p>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4">
            Loading...
          </div>
        </div>
      </>
    )
  }

  if (!startup) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4">
            Startup not found
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Video Pitch */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Pitch Video</h2>
                {canAccess('video') ? (
                  <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                    <ReactPlayer
                      url={startup.videoPitch}
                      width="100%"
                      height="100%"
                      controls
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                      {/* Blurred thumbnail with gradient overlay */}
                      <div className="absolute inset-0 backdrop-blur-md">
                        <ReactPlayer
                          url={startup.videoPitch}
                          width="100%"
                          height="100%"
                          light={true}
                          playIcon={<></>}
                        />
                      </div>
                      {/* Content overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80 flex flex-col items-center justify-center p-6 text-center">
                        <Play className="w-16 h-16 text-white/80 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">2-Minute Pitch Video</h3>
                        <p className="text-white/80 mb-6 max-w-md">
                          Watch the founder explain their vision, business model, and growth strategy
                        </p>
                        <Button 
                          onClick={() => router.push('/#pricing')}
                          className="bg-white text-blue-600 hover:bg-blue-50"
                        >
                          Upgrade to Pro to Watch
                          <Lock className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* About the Company - Always visible */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">About the Company</h3>
                <p className="text-gray-600 whitespace-pre-line">{startup.detailedDescription}</p>
              </Card>

              {/* Key Metrics - Always visible */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Key Metrics</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                    <p className="font-medium">${startup.monthlyRevenue || '0'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Growth Rate</p>
                    <p className="font-medium text-green-600">+{startup.monthlyGrowth || '0'}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Investors</p>
                    <p className="font-medium">{startup.currentInvestorCount || '0'}</p>
                  </div>
                </div>
              </Card>

              {/* Founder Psychometric Analysis - Pro only */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Founder Psychometric Analysis</h3>
                {canAccess('founderPsychometrics') ? (
                  <div className="space-y-6">
                    {startup.founderDetails && (
                      <div>
                        <p className="font-medium mb-3">{startup.founderDetails.name} - {startup.founderDetails.role}</p>
                        {startup.founderDetails.psychometrics && (
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(startup.founderDetails.psychometrics).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="text-gray-500 capitalize block">{key.replace('_', ' ')}</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <LockedContent 
                    feature="founderPsychometrics"
                    description="Upgrade to Pro to access detailed founder personality assessments and leadership style analysis"
                  />
                )}
              </Card>

              {/* Past Investors - Pro only */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Past Investors</h3>
                {canAccess('pastInvestors') ? (
                  renderPastInvestors(startup.pastInvestors)
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <Lock className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-2">Previous investment rounds and investor details are available for Pro members</p>
                    <Button 
                      onClick={() => router.push('/#pricing')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Investment Details - Always visible */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Investment Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Funding Stage</p>
                    <p className="font-medium">{startup.fundingStage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Raising</p>
                    <p className="font-medium">${parseInt(startup.fundingAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{startup.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Founded</p>
                    <p className="font-medium">{startup.founded}</p>
                  </div>
                </div>
              </Card>

              {/* Highlights - Always visible */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Highlights</h3>
                {renderHighlights(startup.highlights)}
              </Card>

              {/* Founding Team - Starter and Pro only */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Founding Team</h3>
                {canAccess('foundingTeam') ? (
                  <div className="space-y-6">
                    {startup.founderDetails && (
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{startup.founderDetails.name}</p>
                            <p className="text-sm text-gray-500">{startup.founderDetails.role}</p>
                          </div>
                          {startup.founderDetails.linkedinUrl && (
                            <a 
                              href={startup.founderDetails.linkedinUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <LinkedinIcon className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{startup.founderDetails.background}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <LockedContent 
                    feature="foundingTeam"
                    description="Upgrade to VC Starter or Pro to view founding team details and contact information"
                  />
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 