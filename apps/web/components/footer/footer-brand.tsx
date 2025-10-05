import NewsletterForm from './footer-newsletter'
import { Star } from 'lucide-react'

export default function FooterBrand() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
						<span className="text-white font-bold text-sm">S</span>
					</div>
					<span className="text-xl font-bold text-white">Synthatar</span>
				</div>

				<p className="text-sm text-gray-400 leading-relaxed">
					Create Professional AI Avatar Videos in Minutes
				</p>
			</div>
		</div>
	)
}
