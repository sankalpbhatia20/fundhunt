'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>
              {error === 'Configuration' 
                ? 'There is a problem with the server configuration.'
                : 'An error occurred during authentication.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 