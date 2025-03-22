'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StartupCard from "@/components/startup/StartupCard"
import Navbar from '@/components/layout/Navbar'
import { Search, Filter } from 'lucide-react'
import { INDUSTRIES, FUNDING_STAGES } from '@/lib/constants'

export default function StartupDirectory() {
  const [startups, setStartups] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    industry: 'all',
    fundingStage: 'all',
    search: ''
  })

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/startups')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch startups')
      }
      
      if (data.success) {
        console.log('Fetched startups:', data.startups.length) // Debug log
        setStartups(data.startups)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Failed to fetch startups:', error)
      setStartups([])
    } finally {
      setLoading(false)
    }
  }

  const filteredStartups = startups.filter(startup => {
    const matchesIndustry = filters.industry === 'all' || startup.industry === filters.industry
    const matchesFundingStage = filters.fundingStage === 'all' || startup.fundingStage === filters.fundingStage
    const matchesSearch = !filters.search || 
      startup.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
      startup.description.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesIndustry && matchesFundingStage && matchesSearch
  })

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Discover Promising Startups</h1>
            <p className="text-xl text-gray-600">
              Browse through our curated list of innovative startups
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search startups..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <Select
              value={filters.industry}
              onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.fundingStage}
              onValueChange={(value) => setFilters(prev => ({ ...prev, fundingStage: value }))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Funding Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {FUNDING_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading startups...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map((startup) => (
                <StartupCard key={startup._id} startup={startup} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
} 