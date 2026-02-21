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
import TermsPage from '@/components/legal/TermsPage'
import PrivacyPage from '@/components/legal/PrivacyPage'
import CookiePage from '@/components/legal/CookiePage'
import DisclaimerPage from '@/components/legal/DisclaimerPage'
import ResponsibleGamingPage from '@/components/legal/ResponsibleGamingPage'
import CookieBanner from '@/components/CookieBanner'

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
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiePage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/responsible-gaming" element={<ResponsibleGamingPage />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </AuthProvider>
  )
}

export default App
