import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Flame, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const featureIcons = [Brain, Flame, Users]

const Features = () => {
  const { t } = useTranslation()
  const features = t('features.items', { returnObjects: true })

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-cyan italic mb-4">
            {t('features.title')}
          </h2>
          <div className="w-16 h-1 bg-cyan mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {Array.isArray(features) && features.map((feat, i) => {
            const Icon = featureIcons[i] || Brain
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-cyan/10 rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-cyan" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
