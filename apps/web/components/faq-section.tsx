'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is Neura and how does it work?',
    answer: 'Neura is an advanced AI-powered platform that helps you transform your ideas into reality. Using cutting-edge artificial intelligence, we provide intelligent solutions for content creation, automation, and creative workflows. Simply upload your content, customize your preferences, and let our AI do the heavy lifting.',
  },
  {
    question: 'How long does it take to generate content?',
    answer: 'Most content is generated within minutes. Simple projects typically take 2-5 minutes, while more complex creations may take up to 15 minutes. Enterprise users with larger projects can expect processing times based on project complexity. You\'ll receive real-time updates throughout the generation process.',
  },
  {
    question: 'What file formats do you support?',
    answer: 'Neura supports a wide range of file formats including images (JPG, PNG, GIF, WebP), videos (MP4, MOV, AVI), audio files (MP3, WAV, AAC), and documents (PDF, TXT, DOC). For the best results, we recommend using high-quality source materials in standard formats.',
  },
  {
    question: 'Can I use the generated content commercially?',
    answer: 'Yes! All content generated with a paid subscription is yours to use commercially. Basic plan users have standard commercial rights, while Pro and Enterprise users enjoy extended licensing with no attribution required. Free trial content can be used for personal and testing purposes only.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Absolutely! We offer a 14-day free trial with no credit card required. You\'ll get access to core features and can create up to 10 projects during your trial period. This gives you plenty of time to explore the platform and see if it\'s the right fit for your needs.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We provide comprehensive support across all plans. Basic plan users have access to email support and our knowledge base. Pro users enjoy priority email support with faster response times. Enterprise customers get dedicated account management, priority phone support, and custom onboarding assistance.',
  },
  {
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, giving you instant access to new features. When downgrading, the changes will apply at the end of your current billing cycle, so you can continue enjoying your current plan\'s benefits until then. No penalties or fees for plan changes.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied with Neura within the first 30 days, contact our support team for a full refund. For annual plans, refunds are prorated after the first 30 days based on unused months.',
  },
];

export default function FAQSection() {
  return (
    <motion.section
      id="faq"
      className="py-20 lg:py-32 bg-[#0a0a0a] relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />

      <div className="max-w-4xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-sm font-medium text-purple-200 mb-6"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>FAQ</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about Neura. Can't find the answer you're
            looking for? Feel free to{' '}
            <a
              href="#contact"
              className="text-purple-400 hover:text-purple-300 transition-colors underline"
            >
              contact us
            </a>
            .
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-white hover:text-purple-400 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-gray-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-6">Still have questions?</p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-full hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Get in Touch</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}
