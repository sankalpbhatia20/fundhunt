'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function ShortlistedStartups() {
  // This would come from your global state management or API
  const [shortlistedStartups, setShortlistedStartups] = useState([])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shortlisted Investments</h1>
          
          {shortlistedStartups.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600 mb-4">You haven't shortlisted any startups yet.</p>
              <Link href="/startups">
                <Button>Browse Startups</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortlistedStartups.map((startup) => (
                <Card key={startup.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{startup.name}</h3>
                      <p className="text-gray-600">{startup.industry} • {startup.stage}</p>
                    </div>
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
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
                      Shortlisted on: {startup.shortlistedDate}
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
          )}
        </div>
      </div>
    </>
  )
} 