import React from 'react'
import { Link } from 'react-router-dom'
import { Twitter, Instagram, Globe, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-6 h-6 text-cyan" />
              <span className="font-display text-xl font-extrabold">KYNETICS SPORTS</span>
            </div>
            <p className="text-cyan text-xs font-bold tracking-wider uppercase mb-3">
              NBA Predictions Powered by AI
            </p>
            <p className="text-blue-200/60 text-sm mb-6">
              The smarter way to follow the NBA.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Icon className="w-4 h-4 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-cyan font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/nba" className="text-blue-200/60 text-sm hover:text-white transition-colors">NBA Games</Link>
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">My Streak</a>
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">Leaderboard</a>
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">How It Works</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-cyan font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cyan font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <p className="text-blue-200/60 text-sm mb-2">Questions or feedback?</p>
            <a href="mailto:hello@kynetics.ai" className="text-white font-bold text-lg flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" />
              hello@kynetics.ai
            </a>
            <p className="text-cyan text-xs mb-4">Response within 24 hours</p>
            <a href="mailto:hello@kynetics.ai" className="inline-block border border-white/30 text-white px-5 py-2 rounded text-sm font-medium hover:bg-white/10 transition-colors">
              Send Message
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-blue-200/40 text-sm">© 2026 Kynetics Sports AI</p>
          <p className="text-blue-200/40 text-sm">For entertainment purposes only.</p>
          <div className="flex gap-3 text-sm">
            <span className="text-cyan font-bold cursor-pointer">EN</span>
            <span className="text-blue-200/40">|</span>
            <span className="text-blue-200/40 cursor-pointer hover:text-white">ES</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
