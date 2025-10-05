'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleIcon, Menu, X } from 'lucide-react';
import { useSession } from '@/hooks/use-session';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useSession({ suspense: false });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled
            ? 'py-2 mt-0'
            : 'py-4 mt-4'
        }`}
      >
        <div
          className={`relative rounded-xl border transition-all duration-300 ${
            scrolled
              ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-gray-800/50'
              : 'bg-gray-900/80 backdrop-blur-sm border-gray-800/50'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
              aria-label="Synthatar home"
            >
              <div className="relative">
                <CircleIcon className="h-8 w-8 text-purple-500 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-purple-400">
                Synthatar
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#benefits">Benefits</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#contact">Contact</NavLink>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="hidden sm:inline-flex text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={signOut}
                    className="hidden sm:inline-flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Sign Out</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      className="hidden sm:inline-flex text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      className="hidden sm:inline-flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Get Started</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-300" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-300" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div
            className={`md:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 rounded-b-xl overflow-hidden transition-all duration-300 ${
              mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            role="menu"
          >
            <div className="px-6 py-4 space-y-3">
              <MobileNavLink href="#features" onClick={() => setMobileMenuOpen(false)}>
                Features
              </MobileNavLink>
              <MobileNavLink href="#benefits" onClick={() => setMobileMenuOpen(false)}>
                Benefits
              </MobileNavLink>
              <MobileNavLink href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </MobileNavLink>
              <MobileNavLink href="#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </MobileNavLink>
              <div className="pt-3 space-y-2 border-t border-gray-800">
                {user ? (
                  <>
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                        Dashboard
                      </Button>
                    </Link>
                    <Button onClick={signOut} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" className="block">
                      <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="block">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="relative text-gray-300 hover:text-white transition-colors duration-200 font-medium group cursor-pointer"
      aria-label={`Navigate to ${children}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" aria-hidden="true" />
    </a>
  );
}

function MobileNavLink({
  href,
  children,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="block py-2 text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
      role="menuitem"
    >
      {children}
    </a>
  );
}
