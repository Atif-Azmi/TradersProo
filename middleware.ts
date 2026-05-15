import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')
  const isPublicPage = request.nextUrl.pathname === '/'
  
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard') ||
                      request.nextUrl.pathname.startsWith('/customers') ||
                      request.nextUrl.pathname.startsWith('/products') ||
                      request.nextUrl.pathname.startsWith('/sales') ||
                      request.nextUrl.pathname.startsWith('/retail') ||
                      request.nextUrl.pathname.startsWith('/advances') ||
                      request.nextUrl.pathname.startsWith('/reports') ||
                      request.nextUrl.pathname.startsWith('/reminders') ||
                      request.nextUrl.pathname.startsWith('/settings') ||
                      request.nextUrl.pathname.startsWith('/subscription') ||
                      request.nextUrl.pathname.startsWith('/superadmin')

  if (request.nextUrl.pathname.startsWith('/superadmin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Check superadmin table server-side
    const { data: sa } = await supabase
      .from('tp_super_admin')
      .select('id')
      .eq('id', user.id)
      .single()
    
    const isHardcoded = user.email === 'superadmin@trader.com'

    if (!sa && !isHardcoded) {
      // Not a superadmin — kick to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (!user && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuthPage) {
    // Check if superadmin for proper redirection
    const { data: sa } = await supabase
      .from('tp_super_admin')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (sa) {
      return NextResponse.redirect(new URL('/superadmin/verify', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)']
}
