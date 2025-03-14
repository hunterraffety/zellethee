import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import { ToastProvider } from './components/ToastProvider'
import { QueryProvider } from './components/QueryProvider'
import { LoadingProvider } from './components/LoadingContext'
import { LoadingBar } from './components/LoadingBar'

export const metadata: Metadata = {
  title: 'Custom Onboarding Flow',
  description: 'a next.js application with modern features',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white min-h-screen">
        <div className="fixed inset-0 opacity-[0.03] z-0 pointer-events-none"></div>
        <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl opacity-30 z-0 pointer-events-none"></div>
        <div className="fixed -bottom-20 -right-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl opacity-30 z-0 pointer-events-none"></div>

        <QueryProvider>
          <LoadingProvider>
            <ToastProvider />
            <LoadingBar />
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen relative z-10">
              {children}
            </main>
          </LoadingProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
