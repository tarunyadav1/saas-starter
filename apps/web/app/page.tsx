'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Upload, Sparkles } from 'lucide-react'
import {
	motion,
	AnimatePresence,
	useScroll,
	useMotionValueEvent,
	useSpring,
} from 'framer-motion'
import Navbar from '@/components/navbar'
import VideoShowcase from '@/components/video-showcase'
import KeyFeatures from '@/components/key-features'
import FAQSection from '@/components/faq-section'

export default function HomePage() {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
	const { scrollY } = useScroll()

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
								Create Professional AI Avatar Videos in Minutes
							</span>
						</motion.h1>

						<motion.p
							className="text-base md:text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
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

					<motion.div
						className="mt-20"
						{...getAnimationProps({
							initial: { opacity: 0, y: 60 },
							animate: { opacity: 1, y: 0 },
							transition: {
								duration: 0.8,
								delay: 0.7,
								ease: [0.16, 1, 0.3, 1],
							},
						})}>
						<motion.div
							className="max-w-5xl mx-auto"
							whileHover={
								!prefersReducedMotion
									? {
											y: -5,
										}
									: {}
							}
							transition={{ duration: 0.3, ease: 'easeOut' }}>
							<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
								<div className="bg-gray-800 px-6 py-4 flex items-center gap-2 border-b border-gray-700">
									<div className="flex gap-2" role="presentation">
										<div className="w-3 h-3 rounded-full bg-red-500" aria-hidden="true"></div>
										<div className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true"></div>
										<div className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true"></div>
									</div>
									<div className="flex-1 flex justify-center">
										<div className="bg-gray-900 rounded-lg px-4 py-1 text-sm text-gray-300 flex items-center gap-2">
											<svg
												className="w-4 h-4 text-green-400"
												fill="currentColor"
												viewBox="0 0 20 20"
												aria-label="Secure connection">
												<path
													fillRule="evenodd"
													d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
													clipRule="evenodd"
												/>
											</svg>
											synthatar.app
										</div>
									</div>
								</div>

								<div className="p-8 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
									<div className="aspect-[9/16] max-w-md mx-auto rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex flex-col items-center justify-center p-8 border border-purple-500/30">
										<motion.div
											{...getAnimationProps({
												initial: { scale: 0 },
												animate: { scale: 1 },
												transition: {
													duration: 0.5,
													delay: 1,
													ease: [0.16, 1, 0.3, 1],
												},
											})}
											className="text-center">
											<div className="mb-6">
												<motion.div
													animate={
														!prefersReducedMotion
															? {
																	rotate: 360,
																}
															: {}
													}
													transition={
														!prefersReducedMotion
															? {
																	duration: 20,
																	repeat: Infinity,
																	ease: 'linear',
																}
															: {}
													}
													className="inline-block">
													<svg
														width="80"
														height="80"
														viewBox="0 0 32 32"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
														aria-label="Synthatar logo">
														<path
															fill="url(#gradient1)"
															d="M27.892 10.531c-1.746-3.006-6.11-3.006-7.857 0l-2.593 4.465h5.197c3.084 0 5.413 2.167 6.001 4.804l.638-1.099a5.754 5.754 0 0 0 0-5.783l-1.386-2.387Z"
														/>
														<path
															fill="url(#gradient2)"
															d="M18.885 28.63c1.978-1.829 2.685-4.898 1.151-7.54l-2.614-4.502h5.217c3.491 0 5.674 3.758 3.928 6.764l-1.704 2.934a4.719 4.719 0 0 1-4.081 2.343h-1.897Z"
														/>
														<path
															fill="url(#gradient3)"
															d="M6.271 24.653c2.589.807 5.636-.116 7.176-2.768l2.601-4.48 2.602 4.481c1.746 3.007-.437 6.765-3.93 6.765l-3.408-.001a4.719 4.719 0 0 1-4.08-2.344l-.96-1.653Z"
														/>
														<path
															fill="url(#gradient4)"
															d="m3.457 11.82-.638 1.098a5.754 5.754 0 0 0 0 5.783l1.386 2.388c1.746 3.006 6.11 3.006 7.856 0l2.601-4.48H9.455c-3.08 0-5.405-2.159-5.998-4.79Z"
														/>
														<path
															fill="url(#gradient5)"
															d="M13.212 2.974c-1.98 1.828-2.687 4.899-1.153 7.54l2.615 4.504h-5.22c-3.491 0-5.674-3.758-3.928-6.764l1.706-2.936a4.719 4.719 0 0 1 4.08-2.344h1.9Z"
														/>
														<path
															fill="url(#gradient6)"
															d="M16.052 14.207 13.445 9.72c-1.745-3.007.437-6.765 3.93-6.764h3.407c1.683 0 3.239.893 4.081 2.343l.97 1.672c-2.59-.812-5.642.11-7.184 2.765l-2.597 4.472Z"
														/>
														<defs>
															<linearGradient
																id="gradient1"
																x1="0%"
																y1="0%"
																x2="100%"
																y2="100%">
																<stop offset="0%" stopColor="#9333ea" />
																<stop offset="100%" stopColor="#3b82f6" />
															</linearGradient>
															<linearGradient
																id="gradient2"
																x1="0%"
																y1="0%"
																x2="100%"
																y2="100%">
																<stop offset="0%" stopColor="#3b82f6" />
																<stop offset="100%" stopColor="#9333ea" />
															</linearGradient>
															<linearGradient
																id="gradient3"
																x1="0%"
																y1="0%"
																x2="100%"
																y2="100%">
																<stop offset="0%" stopColor="#9333ea" />
																<stop offset="100%" stopColor="#3b82f6" />
															</linearGradient>
															<linearGradient
																id="gradient4"
																x1="0%"
																y1="0%"
																x2="100%"
																y2="100%">
																<stop offset="0%" stopColor="#3b82f6" />
																<stop offset="100%" stopColor="#9333ea" />
															</linearGradient>
															<linearGradient
																id="gradient5"
																x1="0%"
																y1="0%"
																x2="100%"
																y2="100%">
																<stop offset="0%" stopColor="#9333ea" />
																<stop offset="100%" stopColor="#3b82f6" />
															</linearGradient>
															<linearGradient
																id="gradient6"
																x1="0%"
																y1="0%"
																x2="100%"
																y2="100%">
																<stop offset="0%" stopColor="#3b82f6" />
																<stop offset="100%" stopColor="#9333ea" />
															</linearGradient>
														</defs>
													</svg>
												</motion.div>
											</div>
											<h3 className="text-2xl font-bold text-white mb-2">
												AI-Powered Interface
											</h3>
											<p className="text-gray-300 max-w-md">
												Experience the seamless integration of artificial
												intelligence with intuitive design
											</p>
										</motion.div>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			<VideoShowcase />

			<motion.section
				className="py-20 px-6 bg-black"
				{...getAnimationProps({
					initial: { opacity: 0 },
					whileInView: { opacity: 1 },
					transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
					viewport: { once: true, margin: '-100px' },
				})}>
				<div className="max-w-7xl mx-auto">
					<motion.h2
						className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
						{...getAnimationProps({
							initial: { opacity: 0, y: 20 },
							whileInView: { opacity: 1, y: 0 },
							transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
							viewport: { once: true },
						})}>
						How to Create an Avatar from Photo
					</motion.h2>

					<div className="grid md:grid-cols-3 gap-8">
						<motion.div
							{...getAnimationProps({
								initial: { opacity: 0, y: 30 },
								whileInView: { opacity: 1, y: 0 },
								transition: { duration: 0.5, delay: 0.1 },
								viewport: { once: true },
							})}
							className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col">
							<div className="mb-4">
								<h3 className="text-xl font-semibold text-white mb-3">
									1. Upload or AI Design a Photo of You
								</h3>
								<p className="text-gray-300 text-sm leading-relaxed">
									Upload a picture to create your avatar. Choose from realistic
									headshots, professional portraits, or animated characters.
								</p>
							</div>

							<div className="mt-auto bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-8 border border-purple-500/30 flex flex-col items-center justify-center min-h-[280px]">
								<div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mb-4 flex items-center justify-center">
									<div className="w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center">
										<svg
											className="w-12 h-12 text-gray-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
								</div>
								<div className="bg-purple-500 hover:bg-purple-600 transition-colors text-white rounded-lg px-6 py-3 flex items-center gap-2 cursor-pointer">
									<Upload className="w-4 h-4" aria-hidden="true" />
									<span className="text-sm font-medium">Upload Photo</span>
								</div>
							</div>
						</motion.div>

						<motion.div
							{...getAnimationProps({
								initial: { opacity: 0, y: 30 },
								whileInView: { opacity: 1, y: 0 },
								transition: { duration: 0.5, delay: 0.2 },
								viewport: { once: true },
							})}
							className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col">
							<div className="mb-4">
								<h3 className="text-xl font-semibold text-white mb-3">
									2. Add Your Script
								</h3>
								<p className="text-gray-300 text-sm leading-relaxed">
									Paste your text script or upload an audio file.
								</p>
							</div>

							<div className="mt-auto bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30 min-h-[280px] flex flex-col">
								<div className="flex gap-2 mb-4">
									<button className="flex-1 bg-white text-purple-600 rounded-lg px-4 py-2 text-sm font-medium">
										Text to audio
									</button>
									<button className="flex-1 bg-purple-500/30 text-purple-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-500/40 transition-colors">
										Import audio
									</button>
								</div>

								<div className="flex-1 bg-black/30 rounded-lg p-4 border border-purple-500/20">
									<textarea
										className="w-full h-full bg-transparent text-gray-300 text-sm resize-none outline-none placeholder-gray-500"
										placeholder="Enter the text that needs AI dubbing here. Under 15s recommended for best results. Max 28s."
										rows={5}
										aria-label="Script input"
									/>
								</div>

								<div className="mt-3 text-xs text-gray-400">
									Speaking duration: 0s
								</div>
							</div>
						</motion.div>

						<motion.div
							{...getAnimationProps({
								initial: { opacity: 0, y: 30 },
								whileInView: { opacity: 1, y: 0 },
								transition: { duration: 0.5, delay: 0.3 },
								viewport: { once: true },
							})}
							className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col">
							<div className="mb-4">
								<h3 className="text-xl font-semibold text-white mb-3">
									3. Generate and Download Your Avatar Video
								</h3>
								<p className="text-gray-300 text-sm leading-relaxed">
									Your AI video will be ready in minutes. Preview it, then save
									and download in high resolution.
								</p>
							</div>

							<div className="mt-auto bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30 flex flex-col items-center justify-center min-h-[280px]">
								<div className="w-full aspect-[9/16] max-w-[180px] bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
									<div className="absolute inset-0 bg-black/20"></div>
									<div className="relative w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center">
										<svg
											className="w-8 h-8 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									</div>
								</div>

								<button className="bg-purple-500 hover:bg-purple-600 transition-colors text-white rounded-lg px-8 py-3 flex items-center gap-2 font-medium w-full justify-center">
									<Sparkles className="w-5 h-5" aria-hidden="true" />
									<span>Generate</span>
								</button>
							</div>
						</motion.div>
					</div>
				</div>
			</motion.section>

			<KeyFeatures />

			<FAQSection />
		</main>
	)
}
