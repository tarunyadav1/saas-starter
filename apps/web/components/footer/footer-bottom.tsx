import SocialLinks from './footer-social'

export default function FooterBottom() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 text-center md:text-left">
            © {currentYear} Synthatar. All rights reserved.
          </p>

          <SocialLinks />
        </div>
      </div>
    </div>
  )
}
