'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  imagePosition: 'left' | 'right';
  imageUrl: string;
}

const features: Feature[] = [
  {
    title: 'Both body and lip sync with the speech',
    description: 'Both body movements and lip sync with audio, creating a natural speaking effect, perfect for close-ups and side angles.',
    imagePosition: 'right',
    imageUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=Body+%26+Lip+Sync'
  },
  {
    title: 'Control character movements with prompts',
    description: 'Use prompts to control character movements and perform actions while speaking.',
    imagePosition: 'left',
    imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Movement+Control'
  },
  {
    title: 'Supports speech for animals and non-human avatars',
    description: 'Not just realistic photos, but also various artistic styles, including animals, toys, and anthropomorphic characters.',
    imagePosition: 'right',
    imageUrl: 'https://placehold.co/600x400/a855f7/ffffff?text=Animals+%26+Characters'
  },
  {
    title: 'Supports ultra-long durations',
    description: 'By default, it supports video compositions up to 2 minutes long. Enterprise customers can unlock the ability to create unlimited-length videos.',
    imagePosition: 'left',
    imageUrl: 'https://placehold.co/600x400/c084fc/ffffff?text=Ultra-Long+Videos'
  }
];

export default function KeyFeatures() {
  return (
    <section className="py-20 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          Key Features of Topview Avatar 4
        </motion.h2>

        <div className="space-y-20 lg:space-y-32">
          {features.map((feature, index) => (
            <FeatureBlock
              key={index}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureBlock({ feature, index }: { feature: Feature; index: number }) {
  const isImageRight = feature.imagePosition === 'right';

  return (
    <motion.div
      className={`flex flex-col ${isImageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="flex-1 w-full">
        <motion.div
          className="relative aspect-[4/3] w-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <img
            src={feature.imageUrl}
            alt={feature.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>
      </div>

      <div className="flex-1 w-full space-y-6">
        <motion.h3
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
          initial={{ opacity: 0, x: isImageRight ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          viewport={{ once: true }}
        >
          {feature.title}
        </motion.h3>

        <motion.p
          className="text-base md:text-lg text-gray-400 leading-relaxed"
          initial={{ opacity: 0, x: isImageRight ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1]
          }}
          viewport={{ once: true }}
        >
          {feature.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, x: isImageRight ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1]
          }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <Button
              variant="outline"
              className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-medium group"
            >
              <span className="flex items-center gap-2">
                Get Free Start Now
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
