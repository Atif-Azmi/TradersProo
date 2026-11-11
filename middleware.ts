import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
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

  if (user) {
    requestHeaders.set('x-user-id', user.id)
    if (user.email) requestHeaders.set('x-user-email', user.email)
  }

  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isSuperAdminRoute = pathname.startsWith('/superadmin')
  
  const isDashboard = pathname.startsWith('/dashboard') ||
                      pathname.startsWith('/customers') ||
                      pathname.startsWith('/products') ||
                      pathname.startsWith('/sales') ||
                      pathname.startsWith('/billing') ||
                      pathname.startsWith('/retail') ||
                      pathname.startsWith('/advances') ||
                      pathname.startsWith('/reports') ||
                      pathname.startsWith('/reminders') ||
                      pathname.startsWith('/settings') ||
                      pathname.startsWith('/subscription') ||
                      isSuperAdminRoute

  const isHardcodedAdmin = user?.email === 'atifazmi0710@gmail.com' || user?.email === 'superadmin@trader.in'

  // Protect superadmin routes
  if (isSuperAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    if (!isHardcodedAdmin) {
      const { data: sa } = await supabase
        .from('tp_super_admin')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!sa) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Protect dashboard routes
  if (!user && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from login/register
  if (user && isAuthPage) {
    if (isHardcodedAdmin) {
      return NextResponse.redirect(new URL('/superadmin/verify', request.url))
    }

    const { data: sa } = await supabase
      .from('tp_super_admin')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (sa) {
      return NextResponse.redirect(new URL('/superadmin/verify', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|api).*)']
}
