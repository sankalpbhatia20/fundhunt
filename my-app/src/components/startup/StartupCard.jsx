'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'
import { Play, Heart, Share } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

// Dynamically import ReactPlayer with no SSR
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

export default function StartupCard({ startup }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      duration: 2000
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video w-full relative bg-gray-100">
          {startup.videoPitch ? (
            <ReactPlayer
              url={startup.videoPitch}
              width="100%"
              height="100%"
              controls
              light={true}
              onReady={() => setIsVideoLoaded(true)}
              fallback={
                <div className="flex items-center justify-center h-full">
                  <Play className="w-12 h-12 text-gray-400" />
                </div>
              }
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No video available</p>
            </div>
          )}
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{startup.companyName}</CardTitle>
              <CardDescription>{startup.tagline}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleFavorite}
                className={isFavorited ? "text-red-500" : ""}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Industry</p>
                <p>{startup.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Funding Stage</p>
                <p>{startup.fundingStage}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Seeking</p>
              <p className="font-semibold">${parseInt(startup.fundingAmount).toLocaleString()}</p>
            </div>
            {startup.highlights && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Highlights</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {startup.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button 
              className="w-full"
              onClick={() => router.push(`/startups/${startup._id}`)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 