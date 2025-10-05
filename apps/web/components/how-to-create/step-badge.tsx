'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface StepBadgeProps {
  number: 1 | 2 | 3
  prefersReducedMotion?: boolean
}

export function StepBadge({ number, prefersReducedMotion = false }: StepBadgeProps) {
  const [hasEntered, setHasEntered] = useState(false)

  return (
    <motion.div
      className="absolute -top-3 -left-3 w-16 h-16 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/40 border-2 border-white/10 z-10"
      initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
      whileInView={
        prefersReducedMotion
          ? {}
          : {
              scale: 1,
              rotate: 0,
              transition: {
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              },
            }
      }
      animate={
        prefersReducedMotion || !hasEntered
          ? {}
          : {
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.4)',
                '0 0 40px rgba(168, 85, 247, 0.6)',
                '0 0 20px rgba(168, 85, 247, 0.4)',
              ],
            }
      }
      transition={
        prefersReducedMotion || !hasEntered
          ? {}
          : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      }
      whileHover={prefersReducedMotion ? {} : { rotate: 5, scale: 1.1 }}
      viewport={{ once: true }}
      onAnimationComplete={() => setHasEntered(true)}
    >
      {number}
    </motion.div>
  )
}
