'use client'

import { motion } from 'framer-motion'

interface StepConnectorProps {
  orientation: 'horizontal' | 'vertical'
  prefersReducedMotion?: boolean
}

export function StepConnector({
  orientation,
  prefersReducedMotion = false,
}: StepConnectorProps) {
  if (orientation === 'horizontal') {
    return (
      <div className="hidden lg:flex items-center justify-center w-8 relative">
        <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500/50 to-blue-500/50 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border-r-2 border-t-2 border-purple-500 rotate-45" />
          </div>

          {!prefersReducedMotion && (
            <motion.div
              className="absolute w-2 h-2 bg-purple-400 rounded-full blur-sm"
              animate={{
                x: [0, 64, 64, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.2, 0.8, 1],
              }}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center gap-1.5 py-4 lg:hidden">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
    </div>
  )
}
