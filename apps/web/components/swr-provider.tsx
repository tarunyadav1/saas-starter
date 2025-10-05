'use client';

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

const fetcher = (key: string) => fetch(key, { credentials: 'include' }).then((r) => r.json());

export function SWRProvider({ 
  children,
  fallback
}: { 
  children: ReactNode;
  fallback?: Record<string, any>;
}) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        fallback
      }}
    >
      {children}
    </SWRConfig>
  );
}