'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import VideoShowcase from '@/components/video-showcase'
import KeyFeatures from '@/components/key-features'
import FAQSection from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { HowToCreateSection } from '@/components/how-to-create'
import HorizontalVideoScroll from '@/components/horizontal-video-scroll'

export default function HomePage() {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)

		const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handler)
		return () => mediaQuery.removeEventListener('change', handler)
	}, [])

	const getAnimationProps = (defaultProps: any) => {
		if (prefersReducedMotion) {
			return {
				initial: { opacity: 1 },
				animate: { opacity: 1 },
				transition: { duration: 0 },
			}
		}
		return defaultProps
	}

	return (
		<main className="min-h-screen bg-[#0a0a0a]">
			<Navbar />

			<section className="pt-40 pb-20 px-6 relative overflow-hidden bg-[#0a0a0a]">
				<div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-40" />
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />

				<div className="max-w-7xl mx-auto relative">
					<motion.div
						className="text-center max-w-5xl mx-auto"
						{...getAnimationProps({
							initial: { opacity: 0, y: 40 },
							animate: { opacity: 1, y: 0 },
							transition: {
								duration: 0.8,
								ease: [0.16, 1, 0.3, 1],
								delay: 0.2,
							},
						})}>
						<motion.h1
							className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
							{...getAnimationProps({
								initial: { opacity: 0, y: 20 },
								animate: { opacity: 1, y: 0 },
								transition: {
									duration: 0.6,
									delay: 0.3,
									ease: [0.16, 1, 0.3, 1],
								},
							})}>
							<span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
								Synthatar AI Studio
						</span>
						<br />
						for Creators, Brands & Developers
						<span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
							</span>
						</motion.h1>

						<motion.p
							className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed font-medium"
							{...getAnimationProps({
								initial: { opacity: 0, y: 20 },
								animate: { opacity: 1, y: 0 },
								transition: {
									duration: 0.6,
									delay: 0.45,
									ease: [0.16, 1, 0.3, 1],
								},
							})}>
							Transform text into engaging talking head videos without cameras,
							actors, or studios. Join thousands of creators producing content
							10x faster.
						</motion.p>

						<motion.div
							className="flex justify-center items-center"
							{...getAnimationProps({
								initial: { opacity: 0, y: 20 },
								animate: { opacity: 1, y: 0 },
								transition: {
									duration: 0.6,
									delay: 0.5,
									ease: [0.16, 1, 0.3, 1],
								},
							})}>
							<motion.div
								whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
								whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}>
								<Link href="/pricing">
									<Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-full px-8 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transition-all">
										<span className="flex items-center gap-2">
											Get Started
											<svg
												className="w-5 h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 7l5 5m0 0l-5 5m5-5H6"
												/>
											</svg>
										</span>
									</Button>
								</Link>
							</motion.div>
						</motion.div>

						<motion.div
							className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-gray-300 text-sm"
							{...getAnimationProps({
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								transition: { delay: 0.8 },
							})}>
							<div className="flex items-center gap-2">
								<svg
									className="w-5 h-5 text-purple-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true">
									<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
								</svg>
								<span>Trusted by 10,000+ creators</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-yellow-400" aria-label="5 star rating">★★★★★</span>
								<span>4.9/5 from 2,340+ reviews</span>
							</div>
							<div className="flex items-center gap-2">
								<svg
									className="w-5 h-5 text-green-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true">
									<path
										fillRule="evenodd"
										d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										clipRule="evenodd"
									/>
								</svg>
								<span>Enterprise-grade security</span>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			<HorizontalVideoScroll prefersReducedMotion={prefersReducedMotion} />

			<VideoShowcase />

			<HowToCreateSection prefersReducedMotion={prefersReducedMotion} />

			<KeyFeatures />

			<FAQSection />

			<Footer />
		</main>
	)
}
