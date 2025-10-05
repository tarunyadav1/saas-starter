'use client'

import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'

interface VideoPreviewVisualProps {
  prefersReducedMotion?: boolean
}

export function VideoPreviewVisual({ prefersReducedMotion = false }: VideoPreviewVisualProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[240px]">
      <motion.div
        className="relative group mb-6"
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-[9/16] w-[200px] bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-2xl overflow-hidden border-2 border-purple-400/30 shadow-2xl shadow-purple-500/20">
          <div className="absolute inset-0 bg-black/10" />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </motion.div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
                initial={{ width: '0%' }}
                animate={
                  prefersReducedMotion
                    ? { width: '60%' }
                    : {
                        width: ['0%', '100%', '100%', '0%'],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }
                }
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg px-8 py-3 flex items-center gap-2 font-medium shadow-lg shadow-purple-500/30 w-full justify-center cursor-default select-none"
        whileHover={
          prefersReducedMotion
            ? {}
            : {
                scale: 1.05,
              }
        }
        role="presentation"
        aria-hidden="true"
      >
        <Sparkles className="w-5 h-5" aria-hidden="true" />
        <span>Generate Video</span>
      </motion.div>
    </div>
  )
}
