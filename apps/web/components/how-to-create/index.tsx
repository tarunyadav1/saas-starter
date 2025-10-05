'use client'

import { motion } from 'framer-motion'
import { StepCard } from './step-card'
import { StepConnector } from './step-connector'
import { UploadVisual } from './upload-visual'
import { ScriptInputVisual } from './script-input-visual'
import { VideoPreviewVisual } from './video-preview-visual'
import { HowToCreateErrorBoundary } from './error-boundary'

interface HowToCreateSectionProps {
  prefersReducedMotion?: boolean
}

export function HowToCreateSection({
  prefersReducedMotion = false,
}: HowToCreateSectionProps) {
  const sectionAnimationProps = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      }
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        viewport: { once: true, margin: '-100px' },
      }

  const titleAnimationProps = (delay: number) =>
    prefersReducedMotion
      ? {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
        }
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        }

  return (
    <HowToCreateErrorBoundary>
      <motion.section
        className="relative py-16 md:py-20 lg:py-24 px-6 bg-black overflow-hidden"
        {...sectionAnimationProps}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black opacity-70" aria-hidden="true" />

        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse animation-delay-2000" aria-hidden="true" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <motion.div {...titleAnimationProps(0)} className="inline-block mb-4">
              <span className="text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Simple 3-Step Process
              </span>
            </motion.div>

            <motion.h2
              {...titleAnimationProps(0.1)}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Create Your Avatar
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                In Minutes
              </span>
            </motion.h2>

            <motion.p
              {...titleAnimationProps(0.2)}
              className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed"
            >
              No technical skills required. Just upload, script, and generate professional AI videos
              in three simple steps.
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 md:gap-8 lg:gap-0">
            <StepCard
              stepNumber={1}
              title="Upload or AI Design a Photo of You"
              description="Upload a picture to create your avatar. Choose from realistic headshots, professional portraits, or animated characters."
              delay={0.1}
              visual={<UploadVisual prefersReducedMotion={prefersReducedMotion} />}
              className="lg:flex-1 lg:max-w-[380px]"
              prefersReducedMotion={prefersReducedMotion}
            />

            <StepConnector orientation="horizontal" prefersReducedMotion={prefersReducedMotion} />
            <StepConnector orientation="vertical" prefersReducedMotion={prefersReducedMotion} />

            <StepCard
              stepNumber={2}
              title="Add Your Script"
              description="Paste your text script or upload an audio file. Your avatar will speak your words with natural lip-sync."
              delay={0.2}
              visual={<ScriptInputVisual prefersReducedMotion={prefersReducedMotion} />}
              className="lg:flex-1 lg:max-w-[380px]"
              prefersReducedMotion={prefersReducedMotion}
            />

            <StepConnector orientation="horizontal" prefersReducedMotion={prefersReducedMotion} />
            <StepConnector orientation="vertical" prefersReducedMotion={prefersReducedMotion} />

            <StepCard
              stepNumber={3}
              title="Generate and Download Your Avatar Video"
              description="Your AI video will be ready in minutes. Preview it, then save and download in high resolution."
              delay={0.3}
              visual={<VideoPreviewVisual prefersReducedMotion={prefersReducedMotion} />}
              className="lg:flex-1 lg:max-w-[380px]"
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        </div>
      </motion.section>
    </HowToCreateErrorBoundary>
  )
}
