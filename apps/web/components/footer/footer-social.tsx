import { Twitter, Linkedin, Youtube, Instagram, Facebook, MessageCircle, Github } from 'lucide-react'

const socialLinks = [
  { platform: 'Twitter', url: 'https://twitter.com/synthatar', icon: Twitter },
  { platform: 'LinkedIn', url: 'https://linkedin.com/company/synthatar', icon: Linkedin },
  { platform: 'YouTube', url: 'https://youtube.com/@synthatar', icon: Youtube },
  { platform: 'Instagram', url: 'https://instagram.com/synthatar', icon: Instagram },
  { platform: 'Facebook', url: 'https://facebook.com/synthatar', icon: Facebook },
  { platform: 'Discord', url: 'https://discord.gg/synthatar', icon: MessageCircle },
  { platform: 'GitHub', url: 'https://github.com/synthatar', icon: Github },
]

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-end">
      {socialLinks.map((social) => {
        const Icon = social.icon
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${social.platform}`}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-purple-500/20 hover:text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}
