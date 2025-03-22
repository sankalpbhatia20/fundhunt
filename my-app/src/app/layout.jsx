import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FundHunt',
  description: 'Connect Startups with Investors',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}