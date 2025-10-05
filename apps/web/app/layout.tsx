import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRProvider } from '@/components/swr-provider';
import SessionProvider from '@/components/session-provider';

export const metadata: Metadata = {
  title: 'Synthatar - AI Avatar Generator',
  description: 'Create stunning AI avatars in seconds. Transform your digital identity with cutting-edge AI technology.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Fetch initial data on the server
  const [user, team] = await Promise.all([
    getUser(),
    getTeamForUser()
  ]);
  
  return (
    <html
      lang="en"
      className={manrope.className}
    >
      <body className="min-h-[100dvh]">
        <SWRProvider
          fallback={{
            '/api/user': user,
            '/api/team': team
          }}
        >
          <SessionProvider>{children}</SessionProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
