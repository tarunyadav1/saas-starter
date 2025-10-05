'use client'

import { motion } from 'framer-motion'
import { Play, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

interface VideoCard {
	id: string
	thumbnail: string
	title: string
	description: string
	category: string
	duration: string
	accentColor: string
}

const videoData: VideoCard[] = [
	{
		id: '1',
		thumbnail:
			'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=1000&fit=crop',
		title: 'Product Launch Video',
		description: 'Professional avatar introducing new tech product',
		category: 'Business',
		duration: '0:45',
		accentColor: 'from-purple-500 to-pink-500',
	},
	{
		id: '2',
		thumbnail:
			'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=1000&fit=crop',
		title: 'Educational Tutorial',
		description: 'AI instructor explaining complex concepts',
		category: 'Education',
		duration: '1:20',
		accentColor: 'from-blue-500 to-cyan-500',
	},
	{
		id: '3',
		thumbnail:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=1000&fit=crop',
		title: 'Personal Brand Story',
		description: 'Authentic avatar sharing brand narrative',
		category: 'Marketing',
		duration: '0:58',
		accentColor: 'from-purple-600 to-blue-600',
	},
	{
		id: '4',
		thumbnail:
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=1000&fit=crop',
		title: 'Social Media Promo',
		description: 'Engaging short-form content for platforms',
		category: 'Social',
		duration: '0:30',
		accentColor: 'from-pink-500 to-rose-500',
	},
	{
		id: '5',
		thumbnail:
			'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=1000&fit=crop',
		title: 'Corporate Training',
		description: 'Professional development module',
		category: 'Training',
		duration: '2:15',
		accentColor: 'from-indigo-500 to-purple-500',
	},
	{
		id: '6',
		thumbnail:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=1000&fit=crop',
		title: 'Testimonial Video',
		description: 'Customer success story with AI avatar',
		category: 'Reviews',
		duration: '1:05',
		accentColor: 'from-emerald-500 to-teal-500',
	},
]

interface HorizontalVideoScrollProps {
	prefersReducedMotion?: boolean
}

export default function HorizontalVideoScroll({ prefersReducedMotion = false }: HorizontalVideoScrollProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(true)
	const [isDragging, setIsDragging] = useState(false)

	const checkScrollButtons = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
			setCanScrollLeft(scrollLeft > 0)
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
		}
	}

	useEffect(() => {
		checkScrollButtons()
		window.addEventListener('resize', checkScrollButtons)
		return () => window.removeEventListener('resize', checkScrollButtons)
	}, [])

	const scroll = (direction: 'left' | 'right') => {
		if (scrollContainerRef.current) {
			const scrollAmount = 300
			const newScrollLeft =
				scrollContainerRef.current.scrollLeft +
				(direction === 'left' ? -scrollAmount : scrollAmount)

			scrollContainerRef.current.scrollTo({
				left: newScrollLeft,
				behavior: 'smooth',
			})

			setTimeout(checkScrollButtons, 100)
		}
	}

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
		<section className="py-20 px-0 bg-[#0a0a0a] relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
			<div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

			<div className="max-w-7xl mx-auto relative px-6">
				<motion.div
					{...getAnimationProps({
						initial: { opacity: 0, y: 20 },
						whileInView: { opacity: 1, y: 0 },
						transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
					})}
					viewport={{ once: true }}
					className="text-center mb-12">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						<span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
							See What You Can Create
						</span>
					</h2>
					<p className="text-lg text-gray-400 max-w-2xl mx-auto">
						From professional presentations to viral social content - explore real
						examples created in minutes
					</p>
				</motion.div>
			</div>

			<div className="relative">
				{canScrollLeft && !prefersReducedMotion && (
					<motion.button
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						onClick={() => scroll('left')}
						className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 hidden md:flex"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}>
						<ChevronLeft className="w-6 h-6" />
					</motion.button>
				)}

				{canScrollRight && !prefersReducedMotion && (
					<motion.button
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						onClick={() => scroll('right')}
						className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 hidden md:flex"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}>
						<ChevronRight className="w-6 h-6" />
					</motion.button>
				)}

				<motion.div
					ref={scrollContainerRef}
					className={`flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-6 md:px-12 pb-8 ${
						isDragging ? 'cursor-grabbing' : 'cursor-grab'
					}`}
					onScroll={checkScrollButtons}
					{...getAnimationProps({
						initial: { opacity: 0, x: -20 },
						whileInView: { opacity: 1, x: 0 },
						transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
					})}
					viewport={{ once: true }}
					onMouseDown={() => setIsDragging(true)}
					onMouseUp={() => setIsDragging(false)}
					onMouseLeave={() => setIsDragging(false)}>
					{videoData.map((video, index) => (
						<VideoCardComponent key={video.id} video={video} index={index} prefersReducedMotion={prefersReducedMotion} />
					))}
				</motion.div>

				<div className="absolute left-0 top-0 bottom-8 w-12 md:w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
				<div className="absolute right-0 top-0 bottom-8 w-12 md:w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
			</div>

			<div className="max-w-7xl mx-auto px-6">
				<motion.div
					{...getAnimationProps({
						initial: { opacity: 0 },
						whileInView: { opacity: 1 },
						transition: { duration: 0.6, delay: 0.4 },
					})}
					viewport={{ once: true }}
					className="flex justify-center gap-2 mt-8">
					{videoData.map((_, index) => (
						<div
							key={index}
							className="w-2 h-2 rounded-full bg-gray-600 hover:bg-purple-500 transition-colors cursor-pointer"
						/>
					))}
				</motion.div>
			</div>
		</section>
	)
}

function VideoCardComponent({
	video,
	index,
	prefersReducedMotion
}: {
	video: VideoCard
	index: number
	prefersReducedMotion: boolean
}) {
	const [isHovered, setIsHovered] = useState(false)

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
		<motion.div
			{...getAnimationProps({
				initial: { opacity: 0, y: 40 },
				whileInView: { opacity: 1, y: 0 },
				transition: {
					duration: 0.5,
					delay: index * 0.1,
					ease: [0.16, 1, 0.3, 1],
				},
			})}
			viewport={{ once: true }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="flex-shrink-0 w-[240px] md:w-[280px] group">
			<motion.div
				whileHover={!prefersReducedMotion ? { y: -8, scale: 1.02 } : {}}
				transition={{ duration: 0.3, ease: 'easeOut' }}
				className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl hover:shadow-2xl cursor-pointer h-full">
				<div className="absolute inset-0 rounded-2xl border border-purple-500/0 group-hover:border-purple-500/50 transition-all duration-300">
					<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
				</div>

				<div className="aspect-[9/16] relative overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
						style={{ backgroundImage: `url(${video.thumbnail})` }}
					/>

					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

					<div className="absolute top-3 left-3">
						<div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-medium text-white flex items-center gap-1.5">
							<Sparkles className="w-3 h-3" />
							{video.category}
						</div>
					</div>

					<div className="absolute top-3 right-3">
						<div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
							<Clock className="w-3 h-3 text-white" />
							<span className="text-xs font-medium text-white">{video.duration}</span>
						</div>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{
							opacity: isHovered ? 1 : 0,
							scale: isHovered ? 1 : 0.8,
						}}
						transition={{ duration: 0.2 }}
						className="absolute inset-0 flex items-center justify-center">
						<div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
							<Play className="w-7 h-7 text-white ml-1" fill="white" />
						</div>
					</motion.div>

					<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
						<h3 className="text-lg font-semibold text-white mb-1">{video.title}</h3>
						<motion.p
							initial={{ height: 0, opacity: 0 }}
							animate={{
								height: isHovered ? 'auto' : 0,
								opacity: isHovered ? 1 : 0,
							}}
							transition={{ duration: 0.3 }}
							className="text-sm text-gray-300 line-clamp-2 overflow-hidden">
							{video.description}
						</motion.p>

						<div className="mt-3 flex items-center gap-2">
							<div className="flex-1">
								<div className="h-1 bg-white/10 rounded-full overflow-hidden">
									<motion.div
										className={`h-full bg-gradient-to-r ${video.accentColor}`}
										{...getAnimationProps({
											initial: { width: '0%' },
											whileInView: { width: '60%' },
											transition: { duration: 1, delay: 0.5 + index * 0.1 },
										})}
										viewport={{ once: true }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	)
}
