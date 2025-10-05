import { FooterLink } from './footer-types'
import { ExternalLink } from 'lucide-react'

interface FooterColumnProps {
  title: string
  links: FooterLink[]
}

export default function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-base font-bold text-white uppercase tracking-wide">
          {title}
        </h3>
      )}

      <ul className="space-y-3" role="list">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors duration-300 inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-sm"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {link.badge}
                </span>
              )}
              {link.external && (
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
