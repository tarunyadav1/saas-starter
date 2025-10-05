'use client'

import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'

interface UploadVisualProps {
  prefersReducedMotion?: boolean
}

export function UploadVisual({ prefersReducedMotion = false }: UploadVisualProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[240px]">
      <motion.div
        className="relative w-40 h-40 mb-6"
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full opacity-75"
          style={{
            background: 'conic-gradient(from 0deg, #a855f7, #ec4899, #3b82f6, #a855f7)',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  rotate: 360,
                }
          }
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }
          }
        />

        <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
          <Upload className="w-14 h-14 text-purple-300" />
        </div>
      </motion.div>

      <motion.div
        className="bg-purple-500 text-white rounded-lg px-6 py-3 flex items-center gap-2 cursor-default select-none"
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        role="presentation"
        aria-hidden="true"
      >
        <Upload className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm font-medium">Upload Photo</span>
      </motion.div>
    </div>
  )
}
