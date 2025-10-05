'use client'

import FooterCTA from './footer-cta'
import FooterBrand from './footer-brand'
import FooterColumn from './footer-column'
import FooterBottom from './footer-bottom'
import FooterAccordion from './footer-accordion'
import {
	productLinks,
	resourceLinks,
	companyLinks,
	legalLinks,
} from './footer-links'

export default function Footer() {
	return (
		<footer className="bg-[#0a0a0a]" aria-label="Site footer">
			<FooterCTA />

			<div className="border-t border-white/10">
				<div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
					<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
						<FooterBrand />
						<FooterColumn title="Product" links={productLinks} />
						<FooterColumn title="Resources" links={resourceLinks} />
						<FooterColumn title="Company" links={companyLinks} />
						<div className="hidden xl:block">
							<FooterColumn title="Legal" links={legalLinks} />
						</div>
					</div>

					<div className="md:hidden space-y-6">
						<FooterBrand />

						<div className="space-y-2">
							<FooterAccordion title="Product">
								<FooterColumn title="" links={productLinks} />
							</FooterAccordion>

							<FooterAccordion title="Resources">
								<FooterColumn title="" links={resourceLinks} />
							</FooterAccordion>

							<FooterAccordion title="Company">
								<FooterColumn title="" links={companyLinks} />
							</FooterAccordion>

							<FooterAccordion title="Legal">
								<FooterColumn title="" links={legalLinks} />
							</FooterAccordion>
						</div>
					</div>

					<div className="hidden md:block xl:hidden mt-12 pt-8 border-t border-white/10">
						<div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
							{legalLinks.map((link, index) => (
								<span
									key={link.href}
									className="flex items-center gap-2 whitespace-nowrap">
									<a
										href={link.href}
										className="hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-sm">
										{link.label}
									</a>
									{index < legalLinks.length - 1 && (
										<span className="text-gray-700" aria-hidden="true">
											•
										</span>
									)}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<FooterBottom />
		</footer>
	)
}
