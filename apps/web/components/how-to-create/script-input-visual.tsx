'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ScriptInputVisualProps {
  prefersReducedMotion?: boolean
}

export function ScriptInputVisual({ prefersReducedMotion = false }: ScriptInputVisualProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'audio'>('text')

  return (
    <div className="flex flex-col min-h-[240px]">
      <div className="flex gap-2 mb-4">
        <motion.button
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
            focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
            activeTab === 'text'
              ? 'bg-white text-purple-600'
              : 'bg-purple-500/30 text-purple-300 hover:bg-purple-500/40'
          }`}
          onClick={() => setActiveTab('text')}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        >
          Text to Audio
        </motion.button>
        <motion.button
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
            focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
            activeTab === 'audio'
              ? 'bg-white text-purple-600'
              : 'bg-purple-500/30 text-purple-300 hover:bg-purple-500/40'
          }`}
          onClick={() => setActiveTab('audio')}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        >
          Import Audio
        </motion.button>
      </div>

      <div className="flex-1 bg-black/40 rounded-xl p-4 border border-purple-500/30 focus-within:border-purple-500/60 transition-colors">
        <textarea
          className="w-full h-full bg-transparent text-gray-200 text-sm resize-none outline-none placeholder-gray-500 min-h-[80px] cursor-default"
          placeholder="Enter your script here. Under 15s recommended for best results."
          aria-label="Script input preview"
          disabled
          tabIndex={-1}
          value=""
          readOnly
        />
      </div>

      <div className="flex gap-1 h-12 items-end mt-4">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full min-w-[2px]"
            style={{ willChange: 'height' }}
            animate={
              prefersReducedMotion
                ? { height: '40%' }
                : {
                    height: ['20%', '80%', '40%', '60%'],
                  }
            }
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }
            }
          />
        ))}
      </div>
    </div>
  )
}
