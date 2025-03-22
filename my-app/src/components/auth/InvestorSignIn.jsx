'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { FcGoogle } from 'react-icons/fc'

export default function InvestorSignIn() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', {
        callbackUrl: '/investor-dashboard',
        redirect: true
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        role: 'investor'
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive"
        })
      } else {
        router.push('/investor-dashboard')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Join as Investor
          </CardTitle>
          <CardDescription className="text-gray-500">
            Access exclusive startup opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-12 text-lg font-medium border-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <FcGoogle className="w-6 h-6 mr-2" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-center text-gray-500">
            New to FundHunt?{' '}
            <Button variant="link" className="p-0 font-semibold text-blue-600" onClick={() => router.push('/auth/investor/signup')}>
              Create an account
            </Button>
          </div>
          <Button variant="link" className="text-sm text-gray-500" onClick={() => router.push('/auth/forgot-password')}>
            Forgot your password?
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 