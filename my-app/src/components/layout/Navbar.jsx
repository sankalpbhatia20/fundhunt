'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { Menu, X, ChevronDown, Briefcase, Heart, User, ArrowRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20)
    })
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                FundHunt
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/startups" passHref>
              <Button variant="ghost" className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Startups
              </Button>
            </Link>
            <Link href="/shortlisted" passHref>
              <Button variant="ghost" className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Shortlisted
              </Button>
            </Link>
            
            {/* Sign In Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link 
                    href="/#pricing" 
                    className="flex items-center"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Join as Investor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/founder" className="flex items-center">
                    Sign in as Founder
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/startups" className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Browse Startups
              </Link>
              <Link href="/shortlisted" className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Shortlisted
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/auth/investor" className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Sign in as Investor
                </Link>
                <Link href="/auth/founder" className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Sign in as Founder
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
} 