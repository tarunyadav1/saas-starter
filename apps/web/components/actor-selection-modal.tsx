'use client'

import { useEffect, useState, useMemo } from 'react'
import { useActors, Actor } from '@/hooks/use-actors'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X, Users, Star, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	useTeamLooks,
	getMyTeamId,
	createTeamLook,
	deleteTeamLook,
} from '@/hooks/use-team-looks'

const PRESETS: Array<{ key: string; label: string; prompt: string }> = [
	{
		key: 'headshot',
		label: 'Corporate Headshot',
		prompt:
			'clean studio lighting, neutral background, professional attire, sharp focus',
	},
	{
		key: 'outdoor',
		label: 'Outdoor Casual',
		prompt:
			'natural sunlight, shallow depth of field, casual outfit, candid vibe',
	},
	{
		key: 'glam',
		label: 'Studio Glam',
		prompt: 'beauty lighting, soft glow, editorial styling, high contrast',
	},
	{
		key: 'moody',
		label: 'Dark & Moody',
		prompt: 'low-key lighting, cinematic shadows, muted colors',
	},
	{
		key: 'airy',
		label: 'Bright & Airy',
		prompt: 'high-key lighting, soft tones, pastel palette',
	},
]

interface ActorSelectionModalProps {
	isOpen: boolean
	onClose: () => void
	selectedActor?: Actor | null
	onSelect: (actor: Actor) => void
}

type CategoryType = 'all' | 'favorites' | 'cloned' | 'custom'
type GenderFilter = 'all' | 'male' | 'female'
type AgeFilter = 'all' | 'young-adult' | 'adult' | 'senior'

export function ActorSelectionModal({
	isOpen,
	onClose,
	selectedActor,
	onSelect,
}: ActorSelectionModalProps) {
	const [search, setSearch] = useState('')
	const [category, setCategory] = useState<CategoryType>('all')
	const [genderFilter, setGenderFilter] = useState<GenderFilter>('all')
	const [ageFilter, setAgeFilter] = useState<AgeFilter>('all')
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	// Team context
	const [teamId, setTeamId] = useState<number | undefined>(undefined)
	useEffect(() => {
		let mounted = true
		;(async () => {
			try {
				const id = await getMyTeamId()
				if (mounted) setTeamId(id)
			} catch {
				// ignore
			}
		})()
		return () => {
			mounted = false
		}
	}, [])

	// Custom actor creation state
	const [selectedBaseActor, setSelectedBaseActor] = useState<Actor | null>(null)
	const [activePreset, setActivePreset] = useState<string | null>(null)
	const [prompt, setPrompt] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Full-screen image viewer state
	const [viewingImage, setViewingImage] = useState<{
		url: string
		name: string
		prompt: string
	} | null>(null)

	// Handle escape key for image viewer
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && viewingImage) {
				e.preventDefault()
				e.stopPropagation()
				setViewingImage(null)
			}
		}

		if (viewingImage) {
			document.addEventListener('keydown', handleKeyDown, { capture: true })
			return () =>
				document.removeEventListener('keydown', handleKeyDown, {
					capture: true,
				})
		}
	}, [viewingImage])

	// Map age filters to actual age ranges
	const getAgeRange = (filter: AgeFilter) => {
		switch (filter) {
			case 'young-adult':
				return ['18-22', '18-25', '20-28']
			case 'adult':
				return ['22-30', '25-35']
			case 'senior':
				return ['35-45']
			default:
				return undefined
		}
	}

	const { actors, isLoading, error } = useActors({
		search: search || undefined,
		gender: genderFilter !== 'all' ? genderFilter : undefined,
		// For now, we'll filter age ranges on the frontend
	})

	const {
		looks,
		isLoading: looksLoading,
		mutate: reloadLooks,
	} = useTeamLooks(teamId)

	// Auto-pick base actor: prefer 'pro', else first
	useEffect(() => {
		if (!isLoading && actors.length && !selectedBaseActor) {
			const pro = actors.find((a) => a.tags?.includes('pro'))
			setSelectedBaseActor(pro || actors[0])
		}
	}, [isLoading, actors, selectedBaseActor])

	// Compute effective prompt
	const effectivePrompt = useMemo(() => {
		const presetText = PRESETS.find((p) => p.key === activePreset)?.prompt ?? ''
		if (!prompt.trim()) return presetText
		if (!presetText) return prompt.trim()
		return `${presetText}, ${prompt.trim()}`
	}, [activePreset, prompt])

	// Filter actors based on age and tags
	const filteredActors = actors.filter((actor) => {
		const ageRanges = getAgeRange(ageFilter)
		const ageMatch = !ageRanges || ageRanges.includes(actor.ageRange || '')

		const tagMatch =
			selectedTags.length === 0 ||
			selectedTags.some((tag) =>
				actor.tags.some((actorTag) =>
					actorTag.toLowerCase().includes(tag.toLowerCase())
				)
			)

		return ageMatch && tagMatch
	})

	// Get all unique tags from actors
	const allTags = Array.from(new Set(actors.flatMap((actor) => actor.tags)))
	const situationTags = allTags.filter((tag) =>
		[
			'home',
			'office',
			'beach',
			'outdoor',
			'car',
			'desk',
			'dorm',
			'gym',
		].includes(tag.toLowerCase())
	)

	const handleActorSelect = (actor: Actor) => {
		onSelect(actor)
		onClose()
	}

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		)
	}

	const handleSubmitCustomActor = async () => {
		if (!teamId) return
		const base = selectedBaseActor || actors[0]
		if (!base) return
		setIsSubmitting(true)
		try {
			await createTeamLook(teamId, {
				actorKey: base.key,
				prompt: effectivePrompt,
				strength: 0.65,
			})
			await reloadLooks()
			// Reset form
			setPrompt('')
			setActivePreset(null)
		} finally {
			setIsSubmitting(false)
		}
	}

	const canSubmitCustom = Boolean(
		teamId && selectedBaseActor && effectivePrompt.trim() && !isSubmitting
	)

	return (
		<>
			<Dialog
				open={isOpen}
				onOpenChange={(open) => {
					// Don't close the modal if the image viewer is open
					if (!open && viewingImage) {
						return
					}
					onClose()
				}}>
				<DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-7xl max-h-[90vh] overflow-hidden flex p-0">
					{/* Left Sidebar */}
					<div className="w-80 border-r bg-gray-50/50 flex flex-col overflow-hidden">
						<div className="p-4 border-b bg-white">
							<DialogHeader>
								<DialogTitle className="flex items-center justify-between text-lg font-semibold">
									Select actors
									<Button variant="ghost" size="icon" onClick={onClose}>
										<X className="w-4 h-4" />
									</Button>
								</DialogTitle>
							</DialogHeader>
						</div>

						<div className="flex-1 overflow-y-auto">
							<div className="p-4 space-y-6">
								{/* Search */}
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<Input
										placeholder="Search"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										className="pl-10 bg-white"
									/>
								</div>

								{/* Categories */}
								<div className="space-y-3">
									<h3 className="text-sm font-medium text-gray-900">
										Categories
									</h3>
									<div className="space-y-1">
										<Button
											variant={category === 'all' ? 'default' : 'ghost'}
											className="w-full justify-start h-10 px-3"
											onClick={() => setCategory('all')}>
											<Users className="w-4 h-4 mr-3" />
											All AI Actors
										</Button>
										<Button
											variant={category === 'favorites' ? 'default' : 'ghost'}
											className="w-full justify-start h-10 px-3"
											onClick={() => setCategory('favorites')}>
											<Star className="w-4 h-4 mr-3" />
											Favorites
										</Button>
										<Button
											variant={category === 'cloned' ? 'default' : 'ghost'}
											className="w-full justify-start h-10 px-3"
											onClick={() => setCategory('cloned')}>
											<UserCheck className="w-4 h-4 mr-3" />
											My Cloned Actors
										</Button>
										<Button
											variant={category === 'custom' ? 'default' : 'ghost'}
											className="w-full justify-start h-10 px-3"
											onClick={() => setCategory('custom')}>
											<span className="w-4 h-4 mr-3">✨</span>
											Custom Actors
										</Button>
									</div>
								</div>

								{/* Gender Filter */}
								<div className="space-y-3">
									<h3 className="text-sm font-medium text-gray-900">Gender</h3>
									<div className="space-y-1">
										<Button
											variant={genderFilter === 'all' ? 'secondary' : 'ghost'}
											size="sm"
											className="w-full justify-start h-8 px-3"
											onClick={() => setGenderFilter('all')}>
											All
										</Button>
										<Button
											variant={genderFilter === 'male' ? 'secondary' : 'ghost'}
											size="sm"
											className="w-full justify-start h-8 px-3"
											onClick={() => setGenderFilter('male')}>
											Male
										</Button>
										<Button
											variant={
												genderFilter === 'female' ? 'secondary' : 'ghost'
											}
											size="sm"
											className="w-full justify-start h-8 px-3"
											onClick={() => setGenderFilter('female')}>
											Female
										</Button>
									</div>
								</div>

								{/* Age Filter */}
								<div className="space-y-3">
									<h3 className="text-sm font-medium text-gray-900">Age</h3>
									<div className="space-y-1">
										<Button
											variant={ageFilter === 'all' ? 'secondary' : 'ghost'}
											size="sm"
											className="w-full justify-start h-8 px-3"
											onClick={() => setAgeFilter('all')}>
											All Ages
										</Button>
										<Button
											variant={
												ageFilter === 'young-adult' ? 'secondary' : 'ghost'
											}
											size="sm"
											className="w-full justify-start h-8 px-3"
											onClick={() => setAgeFilter('young-adult')}>
											Young Adult
										</Button>
										<Button
											variant={ageFilter === 'adult' ? 'secondary' : 'ghost'}
											size="sm"
											className="w-full justify-start h-8 px-3"
											onClick={() => setAgeFilter('adult')}>
											Adult
										</Button>
										<Button
											variant={ageFilter === 'senior' ? 'secondary' : 'ghost'}
											size="sm"
											className="w-full justify-start h-8 px-3"
											onClick={() => setAgeFilter('senior')}>
											Senior
										</Button>
									</div>
								</div>

								{/* Situation Tags */}
								{situationTags.length > 0 && (
									<div className="space-y-3">
										<h3 className="text-sm font-medium text-gray-900">
											Situation
										</h3>
										<div className="grid grid-cols-2 gap-2">
											{situationTags.map((tag) => (
												<Button
													key={tag}
													variant={
														selectedTags.includes(tag) ? 'default' : 'outline'
													}
													size="sm"
													onClick={() => toggleTag(tag)}
													className="text-xs h-8 capitalize">
													{tag}
												</Button>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Right Content */}
					<div className="flex-1 overflow-y-auto">
						<div className="p-6">
							{error && (
								<div className="text-red-500 text-center py-8">
									Failed to load actors
								</div>
							)}

							{category === 'custom' ? (
								<div className="space-y-6">
									{/* Single-screen custom actor composer */}
									<div className="bg-white rounded-lg border p-6 space-y-6">
										<div>
											<h3 className="text-lg font-semibold mb-2">
												Create Custom Actor
											</h3>
											<p className="text-sm text-gray-600">
												Pick a style, select a base actor, and describe your
												vision. Everything in one place.
											</p>
										</div>

										{/* Style presets */}
										<div className="space-y-3">
											<div className="text-sm font-medium">
												Style presets{' '}
												<span className="text-xs text-gray-500">
													(optional)
												</span>
											</div>
											<div className="flex flex-wrap gap-2">
												{PRESETS.map((p) => (
													<Button
														key={p.key}
														size="sm"
														variant={
															activePreset === p.key ? 'default' : 'outline'
														}
														onClick={() =>
															setActivePreset(
																activePreset === p.key ? null : p.key
															)
														}>
														{p.label}
													</Button>
												))}
											</div>
											{activePreset && (
												<div className="text-xs text-gray-500">
													Adding preset:{' '}
													<Badge variant="secondary">
														{
															PRESETS.find((p) => p.key === activePreset)
																?.prompt
														}
													</Badge>
												</div>
											)}
											{effectivePrompt && (
												<div className="text-xs text-gray-500">
													Final prompt:{' '}
													<Badge variant="secondary">
														{effectivePrompt.slice(0, 120)}
														{effectivePrompt.length > 120 ? '…' : ''}
													</Badge>
												</div>
											)}
										</div>

										{/* Custom prompt */}
										<div className="space-y-2">
											<div className="text-sm font-medium">
												Describe the look
											</div>
											<textarea
												rows={3}
												placeholder="Describe the look… e.g., clean studio light, denim jacket, soft smile"
												value={prompt}
												onChange={(e) => setPrompt(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
														e.preventDefault()
														if (canSubmitCustom) handleSubmitCustomActor()
													}
												}}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
											/>
											<div className="text-xs text-gray-500">
												Press ⌘⏎ to generate
											</div>
										</div>

										{/* Base actor selection */}
										<div className="space-y-3">
											<div className="text-sm font-medium">Base actor</div>
											<div className="flex gap-3 overflow-x-auto pb-2">
												{(isLoading
													? Array.from({ length: 8 })
													: filteredActors.slice(0, 20)
												).map((a, idx) => (
													<div
														key={isLoading ? idx : (a as Actor).id}
														className={`min-w-[120px] cursor-pointer transition-all ${
															!isLoading &&
															selectedBaseActor?.id === (a as Actor).id
																? 'ring-2 ring-blue-500'
																: ''
														} bg-white rounded-xl shadow-sm border hover:shadow-md overflow-hidden group`}
														onClick={() => {
															if (isLoading) return
															setSelectedBaseActor(a as Actor)
														}}>
														<div className="aspect-[3/4] relative overflow-hidden">
															{isLoading ? (
																<div className="w-full h-full animate-pulse bg-gray-200" />
															) : (
																<>
																	<img
																		src={(a as Actor).imageUrl}
																		alt={(a as Actor).displayName}
																		className="w-full h-full object-cover transition-transform group-hover:scale-105"
																		loading="lazy"
																	/>
																	<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
																		<div className="text-white text-xs font-medium truncate">
																			{(a as Actor).displayName}
																		</div>
																	</div>
																</>
															)}
														</div>
													</div>
												))}
											</div>
										</div>

										{/* Action bar */}
										<div className="flex items-center gap-3 pt-4 border-t">
											{selectedBaseActor && (
												<div className="flex items-center gap-3">
													<img
														src={selectedBaseActor.imageUrl}
														alt={selectedBaseActor.displayName}
														className="w-10 h-10 rounded-md object-cover"
													/>
													<div className="text-sm">
														<div className="font-medium">
															{selectedBaseActor.displayName}
														</div>
														<div className="text-xs text-gray-500">
															{selectedBaseActor.gender}
															{selectedBaseActor.gender &&
															selectedBaseActor.ageRange
																? ' • '
																: ''}
															{selectedBaseActor.ageRange}
														</div>
													</div>
												</div>
											)}
											<div className="ml-auto">
												<Button
													disabled={!canSubmitCustom}
													onClick={handleSubmitCustomActor}>
													{isSubmitting ? 'Generating…' : 'Generate'}
												</Button>
											</div>
										</div>
									</div>

									{/* Existing custom actors */}
									{looksLoading ? (
										<div className="grid grid-cols-4 gap-4">
											{[...Array(8)].map((_, i) => (
												<div
													key={i}
													className="bg-white rounded-xl shadow-sm border overflow-hidden aspect-[3/4]">
													<div className="w-full h-full bg-gray-200 animate-pulse" />
												</div>
											))}
										</div>
									) : looks.length === 0 ? (
										<div className="text-center py-12 text-gray-500">
											No custom actors yet
										</div>
									) : (
										<div className="grid grid-cols-4 gap-4">
											{looks.map((v) => (
												<div
													key={v.id}
													className="relative bg-white rounded-xl shadow-sm border overflow-hidden group aspect-[3/4] cursor-pointer">
													<img
														src={v.outputImageUrl}
														alt={v.actorDisplayName || 'Custom actor'}
														className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
														loading="lazy"
														onClick={() =>
															setViewingImage({
																url: v.outputImageUrl,
																name: v.actorDisplayName || 'Custom actor',
																prompt: v.prompt,
															})
														}
													/>

													{/* Hover overlay with info and actions */}
													<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
														<div className="flex gap-2 justify-end">
															<Button
																size="sm"
																variant="secondary"
																className="bg-white/90 hover:bg-white"
																onClick={(e) => {
																	e.stopPropagation()
																	const actor = actors.find(
																		(a) => a.id === v.actorId
																	)
																	if (actor)
																		onSelect({
																			...(actor as any),
																			_teamLookId: v.id,
																		} as any)
																	onClose()
																}}>
																Use
															</Button>
															<Button
																size="sm"
																variant="destructive"
																className="bg-red-500/90 hover:bg-red-600"
																onClick={async (e) => {
																	e.stopPropagation()
																	if (!teamId) return
																	await deleteTeamLook(teamId, v.id)
																	await reloadLooks()
																}}>
																Delete
															</Button>
														</div>

														<div className="text-white space-y-2">
															<div className="font-semibold text-lg">
																{v.actorDisplayName || 'Custom Actor'}
															</div>
															<div
																className="text-sm opacity-90 line-clamp-2"
																title={v.prompt}>
																{v.prompt}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							) : (
								// Original actor catalog
								<>
									{isLoading ? (
										<div className="grid grid-cols-4 gap-4">
											{[...Array(8)].map((_, i) => (
												<div
													key={i}
													className="bg-white rounded-xl shadow-sm border overflow-hidden aspect-[3/4]">
													<div className="w-full h-full bg-gray-200 animate-pulse" />
												</div>
											))}
										</div>
									) : filteredActors.length === 0 ? (
										<div className="text-center py-12 text-gray-500">
											No actors found matching your criteria
										</div>
									) : (
										<div className="grid grid-cols-4 gap-4">
											{filteredActors.map((actor) => (
												<div
													key={actor.id}
													className={cn(
														'relative cursor-pointer group transition-all bg-white rounded-xl shadow-sm border hover:shadow-lg aspect-[3/4] overflow-hidden',
														selectedActor?.id === actor.id &&
															'ring-2 ring-blue-500'
													)}
													onClick={() => handleActorSelect(actor)}>
													<img
														src={actor.imageUrl}
														alt={actor.displayName}
														className="w-full h-full object-cover"
														loading="lazy"
														onError={(e) => {
															const target = e.target as HTMLImageElement
															target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
																actor.displayName
															)}&background=f3f4f6&color=6b7280&size=240`
														}}
													/>

													{/* Selection indicator */}
													{selectedActor?.id === actor.id && (
														<div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
															<div className="w-3 h-3 bg-white rounded-full" />
														</div>
													)}

													{/* Quality Badges */}
													<div className="absolute top-3 left-3 flex gap-2">
														{actor.tags.includes('hd') && (
															<Badge className="bg-white/90 text-black text-xs px-2 py-1 backdrop-blur-sm font-medium">
																HD
															</Badge>
														)}
														{actor.tags.includes('pro') && (
															<Badge className="bg-orange-500/90 text-white text-xs px-2 py-1 backdrop-blur-sm font-medium">
																PRO
															</Badge>
														)}
													</div>

													{/* Hover overlay with detailed info */}
													<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
														<div className="text-white space-y-2">
															<div className="font-semibold text-lg">
																{actor.displayName}
															</div>
															<div className="flex items-center gap-2 text-sm">
																{actor.gender && (
																	<span className="capitalize bg-white/20 px-2 py-1 rounded-full">
																		{actor.gender}
																	</span>
																)}
																{actor.ageRange && (
																	<span className="bg-white/20 px-2 py-1 rounded-full">
																		{actor.ageRange}
																	</span>
																)}
															</div>
															{actor.tags.length > 0 && (
																<div className="flex flex-wrap gap-1 text-xs">
																	{actor.tags.slice(0, 3).map((tag) => (
																		<span
																			key={tag}
																			className="bg-white/20 px-2 py-1 rounded-full capitalize">
																			{tag}
																		</span>
																	))}
																	{actor.tags.length > 3 && (
																		<span className="bg-white/20 px-2 py-1 rounded-full">
																			+{actor.tags.length - 3}
																		</span>
																	)}
																</div>
															)}
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Full-screen image viewer - outside Dialog to avoid conflicts */}
			{viewingImage && (
				<div
					className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
					onClick={() => setViewingImage(null)}>
					<div className="relative max-w-4xl max-h-full">
						<img
							src={viewingImage.url}
							alt={viewingImage.name}
							className="max-w-full max-h-full object-contain rounded-lg"
							onClick={(e) => e.stopPropagation()}
						/>
						<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
							<div className="font-medium">{viewingImage.name}</div>
							<div className="text-sm text-gray-300">{viewingImage.prompt}</div>
						</div>
						<button
							onClick={() => setViewingImage(null)}
							className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>
			)}
		</>
	)
}
