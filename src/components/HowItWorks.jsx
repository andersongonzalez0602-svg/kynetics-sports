import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const HowItWorks = () => {
  const { t } = useTranslation()
  const steps = t('howItWorks.steps', { returnObjects: true })

  return (
    <section className="bg-blue-50/30 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-white border border-blue-100 text-navy px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-6">
              {t('howItWorks.tag')}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              {t('howItWorks.title')}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              {t('howItWorks.body')}
            </p>
            <Link to="/nba" className="inline-flex items-center gap-2 text-navy font-bold hover:gap-3 transition-all">
              {t('howItWorks.cta')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right - Steps */}
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-navy flex items-center justify-center text-sm font-black shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
