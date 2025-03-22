'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search startups by name, industry, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
} 