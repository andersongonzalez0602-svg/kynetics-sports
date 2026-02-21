import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import StatsBar from '@/components/StatsBar'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import MascotsSection from '@/components/MascotsSection'
import CallToAction from '@/components/CallToAction'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import NBAPage from '@/components/NBAPage'

function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <Features />
      <MascotsSection />
      <CallToAction />
      <FAQ />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nba" element={<NBAPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
