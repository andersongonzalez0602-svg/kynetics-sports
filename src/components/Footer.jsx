import React from 'react'
import { Link } from 'react-router-dom'
import { Twitter, Instagram, Globe, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t, i18n } = useTranslation()

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
              {t('footer.tagline')}
            </p>
            <p className="text-blue-200/60 text-sm mb-6">
              {t('footer.subTagline')}
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
            <h4 className="text-cyan font-bold text-sm uppercase tracking-wider mb-4">{t('footer.platform')}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/nba" className="text-blue-200/60 text-sm hover:text-white transition-colors">{t('footer.nbaGames')}</Link>
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">{t('footer.myStreak')}</a>
              <a href="#" className="text-blue-200/60 text-sm hover:text-white transition-colors">{t('footer.leaderboard')}</a>
              <Link to="/responsible-gaming" className="text-blue-200/60 text-sm hover:text-white transition-colors">{t('footer.responsibleGaming')}</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-cyan font-bold text-sm uppercase tracking-wider mb-4">{t('footer.legal')}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/privacy" className="text-blue-200/60 text-sm hover:text-white transition-colors">{t('footer.privacy')}</Link>
              <Link to="/terms" className="text-blue-200/60 text-sm hover:text-white transition-colors">{t('footer.terms')}</Link>
              <Link to="/cookies" className="text-blue-200/60 text-sm hover:text-white transition-colors">{t('footer.cookies')}</Link>
              <Link to="/disclaimer" className="text-blue-200/60 text-sm hover:text-white transition-colors">{t('footer.disclaimer')}</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cyan font-bold text-sm uppercase tracking-wider mb-4">{t('footer.contact')}</h4>
            <p className="text-blue-200/60 text-sm mb-2">{t('footer.questions')}</p>
            <a href="mailto:kyneticssports@gmail.com" className="text-white font-bold text-lg flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" />
              kyneticssports@gmail.com
            </a>
            <p className="text-cyan text-xs mb-4">{t('footer.responseTime')}</p>
            <a href="mailto:kyneticssports@gmail.com" className="inline-block border border-white/30 text-white px-5 py-2 rounded text-sm font-medium hover:bg-white/10 transition-colors">
              {t('footer.sendMessage')}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-blue-200/40 text-sm">{t('footer.copyright')}</p>
          <p className="text-blue-200/40 text-sm text-center">{t('footer.entertainmentNotice')}</p>
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={() => { i18n.changeLanguage('en'); window.localStorage.setItem('lang', 'en') }}
              className={i18n.language === 'en' ? 'text-cyan font-bold' : 'text-blue-200/40 hover:text-white'}
            >
              {t('footer.langEn')}
            </button>
            <span className="text-blue-200/40">|</span>
            <button
              type="button"
              onClick={() => { i18n.changeLanguage('es'); window.localStorage.setItem('lang', 'es') }}
              className={i18n.language === 'es' ? 'text-cyan font-bold' : 'text-blue-200/40 hover:text-white'}
            >
              {t('footer.langEs')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
