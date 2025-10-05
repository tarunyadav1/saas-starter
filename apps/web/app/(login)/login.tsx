'use client';

import { useCallback, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export function Login() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [processingCallback, setProcessingCallback] = useState(false);
  
  const redirect = searchParams.get('redirect') || '/dashboard';
  const priceId = searchParams.get('priceId') || undefined;
  const inviteId = searchParams.get('inviteId') || undefined;
  const code = searchParams.get('code');  // Auth callback code
  
  const [redirectTo, setRedirectTo] = useState<string>('');

  // Set redirectTo on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clean up the redirect parameter - remove any existing codes
      let cleanRedirect = (redirect || '/dashboard').split('?')[0].split('%3F')[0];
      
      const url = new URL(window.location.origin);
      url.pathname = '/auth/callback';
      url.searchParams.set('next', cleanRedirect);
      if (priceId) url.searchParams.set('priceId', priceId);
      if (inviteId) url.searchParams.set('inviteId', inviteId);
      setRedirectTo(url.toString());
    }
  }, [redirect, priceId, inviteId]);

  // Handle auth callback
  useEffect(() => {
    if (code) {
      const handleAuthCallback = async () => {
        setProcessingCallback(true);
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setError('Authentication failed. Please try again.');
            console.error('Auth callback error:', error);
          } else if (data.session) {
            // Successfully authenticated, clean redirect path and navigate
            let cleanRedirect = (redirect || '/dashboard').split('?')[0].split('%3F')[0];
            if (cleanRedirect === '/sign-in' || cleanRedirect === '/sign-up') {
              cleanRedirect = '/dashboard';
            }
            router.push(cleanRedirect);
          }
        } catch (err) {
          setError('Authentication failed. Please try again.');
          console.error('Auth callback error:', err);
        } finally {
          setProcessingCallback(false);
        }
      };

      handleAuthCallback();
    }
  }, [code, redirect, router]);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !code && !processingCallback) {
        // User is already authenticated, redirect them
        let cleanRedirect = (redirect || '/dashboard').split('?')[0].split('%3F')[0];
        if (cleanRedirect === '/sign-in' || cleanRedirect === '/sign-up') {
          cleanRedirect = '/dashboard';
        }
        router.push(cleanRedirect);
      }
    };

    if (!code && !processingCallback) {
      checkSession();
    }
  }, [code, redirect, router, processingCallback]);

  const handleGoogle = useCallback(async () => {
    if (!redirectTo) return;
    
    setPending(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
    if (error) {
      setError(error.message);
      setPending(false);
    }
  }, [redirectTo]);

  const handleMagicLink = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redirectTo) return;
    
    setPending(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    setPending(false);
    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
  }, [email, redirectTo]);

  if (processingCallback) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <CircleIcon className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Signing you in...
          </h2>
          <div className="mt-4 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        </div>
      </div>
    );
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <CircleIcon className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
          </p>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setMagicLinkSent(false)}
              className="rounded-full"
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="space-y-6">
          <Button
            type="button"
            variant="outline"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            onClick={handleGoogle}
            disabled={pending || !redirectTo}
          >
            {pending ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleMagicLink}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                disabled={pending || !email || !redirectTo}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Sending magic link...
                  </>
                ) : (
                  'Send magic link'
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          New to our platform? Sign up is automatic with Google or magic link.
        </div>
      </div>
    </div>
  );
}
