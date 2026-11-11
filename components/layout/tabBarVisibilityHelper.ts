/**
 * Role: Central single-source-of-truth configuration for Bottom Tab Bar visibility.
 * Rule: Visible ONLY on root primary tabs (/dashboard, /customers, /sales, /retail, /reports).
 * Automatically hidden on ALL inner screens (forms, details, /sales/new, /billing, /settings, etc.).
 */

export const MAIN_TAB_ROUTES = [
  '/dashboard',
  '/customers',
  '/sales',
  '/retail',
  '/reports',
] as const

export function shouldShowBottomNav(pathname: string | null): boolean {
  if (!pathname) return false

  // Normalize path (strip trailing slash if present)
  const cleanPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname

  // Must match exactly one of the 5 top-level root tabs
  return (MAIN_TAB_ROUTES as readonly string[]).includes(cleanPath)
}

