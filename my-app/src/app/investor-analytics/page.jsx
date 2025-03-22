'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import InvestorSidebar from "@/components/investor/InvestorSidebar"
import { Heart, ExternalLink, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

// Mock data - replace with real data from your backend
const TRACKED_STARTUPS = [
  {
    id: 1,
    name: "TechFlow AI",
    industry: "AI/ML",
    stage: "Seed",
    lastViewed: "2024-03-15",
    description: "AI-powered workflow automation platform",
    highlights: [
      "500+ beta users",
      "97% customer satisfaction",
      "3x MoM growth"
    ],
    isFavorite: true
  },
  // Add more startups...
]

export default function InvestorAnalyticsPage() {
  const [filter, setFilter] = useState('all') // 'all' | 'favorites'
  
  const filteredStartups = filter === 'favorites' 
    ? TRACKED_STARTUPS.filter(s => s.isFavorite)
    : TRACKED_STARTUPS

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        <InvestorSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Tracked Startups</h1>
            <div className="space-x-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'favorites' ? 'default' : 'outline'}
                onClick={() => setFilter('favorites')}
              >
                Favorites
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStartups.map((startup) => (
              <Card key={startup.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{startup.name}</h3>
                    <p className="text-gray-600">{startup.industry} • {startup.stage}</p>
                  </div>
                  <Heart 
                    className={`w-5 h-5 ${startup.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </div>

                <p className="text-gray-600 mb-4">{startup.description}</p>

                <div className="space-y-2 mb-4">
                  {startup.highlights.map((highlight, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {highlight}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Last viewed: {startup.lastViewed}
                  </div>
                  <Link href={`/startups/${startup.id}`}>
                    <Button variant="ghost" size="sm">
                      View Details
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 