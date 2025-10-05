export interface FooterLink {
  label: string
  href: string
  badge?: string
  external?: boolean
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface SocialLink {
  platform: string
  url: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}
