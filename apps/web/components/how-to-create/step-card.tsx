'use client'

import { motion } from 'framer-motion'
import { StepBadge } from './step-badge'
import { cn } from '@/lib/utils'

interface StepCardProps {
  stepNumber: 1 | 2 | 3
  title: string
  description: string
  visual: React.ReactNode
  delay?: number
  className?: string
  prefersReducedMotion?: boolean
}

export function StepCard({
  stepNumber,
  title,
  description,
  visual,
  delay = 0,
  className,
  prefersReducedMotion = false,
}: StepCardProps) {
  const animationProps = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 40, scale: 0.95 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        whileHover: { y: -8, zIndex: 10 },
        transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
        viewport: { once: true },
      }

  return (
    <motion.div
      className={cn(
        'relative bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-purple-500/15 hover:border-purple-500/35 transition-all duration-400 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(168,85,247,0.15),0_0_80px_rgba(168,85,247,0.1)]',
        className
      )}
      style={{ zIndex: 1 }}
      {...animationProps}
    >
      <StepBadge number={stepNumber} prefersReducedMotion={prefersReducedMotion} />

      <div className="pt-8">
        <h3 className="text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-base md:text-base lg:text-lg text-gray-300 leading-relaxed mb-6">
          {description}
        </p>

        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 md:p-8 border border-purple-500/30">
          {visual}
        </div>
      </div>
    </motion.div>
  )
}
