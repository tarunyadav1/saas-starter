import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const PROTECTED_PREFIX = '/dashboard'
const AUTH_PAGES = ['/sign-in', '/sign-up']

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return req.cookies.get(name)?.value
				},
				set(name: string, value: string, options: CookieOptions) {
					res.cookies.set({ name, value, ...options })
				},
				remove(name: string, options: CookieOptions) {
					res.cookies.set({ name, value: '', ...options, maxAge: 0 })
				},
			},
		}
	)

	let session = null
	try {
		const {
			data: { session: authSession },
		} = await supabase.auth.getSession()
		session = authSession
	} catch (error) {
		console.error('Middleware auth error:', error)
		session = null
	}

	const pathname = req.nextUrl.pathname
	const isProtected = pathname.startsWith(PROTECTED_PREFIX)
	const isAuthPage = AUTH_PAGES.includes(pathname)

	// Unauthed access to protected pages -> sign-in
	if (!session && isProtected) {
		const url = req.nextUrl.clone()
		url.pathname = '/sign-in'
		url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search)
		return NextResponse.redirect(url)
	}

	// Authed access to auth pages -> respect redirect param if present, else dashboard
	if (session && isAuthPage) {
		const url = req.nextUrl.clone()
		const redirectParam = url.searchParams.get('redirect')
		const destination =
			redirectParam && redirectParam.startsWith('/')
				? redirectParam
				: '/dashboard'
		url.pathname = destination
		url.search = ''
		return NextResponse.redirect(url)
	}

	return res
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
