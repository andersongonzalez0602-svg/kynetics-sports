import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'How does the prediction model work?',
    a: 'Our Kynetics Engine™ analyzes over 10,000 data points per game including player performance, historical matchups, team momentum, and more to calculate win probabilities.'
  },
  {
    q: 'How accurate are the predictions?',
    a: 'Our AI maintains an average accuracy of 82% across all NBA predictions. Accuracy is measured daily and reported transparently on the homepage.'
  },
  {
    q: 'Is this a betting platform?',
    a: 'No. Kynetics Sports is for entertainment purposes only. We provide data-driven insights and predictions but do not facilitate any form of betting.'
  },
  {
    q: 'How often is data updated?',
    a: 'Game predictions are updated daily before each matchup. Live game statuses are updated in real-time during games.'
  },
  {
    q: 'Can I participate in community voting?',
    a: 'Yes! Anyone can vote on game outcomes. Community sentiment is displayed alongside our AI predictions for every matchup.'
  },
]

const FAQ = () => {
  const [open, setOpen] = useState(null)

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-red font-bold text-sm tracking-widest uppercase mb-3">Support & Help</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500">Everything you need to know about our methodology.</p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-bold text-gray-800 pr-4">{faq.q}</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  {open === i ? (
                    <Minus className="w-4 h-4 text-navy" />
                  ) : (
                    <Plus className="w-4 h-4 text-navy" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
