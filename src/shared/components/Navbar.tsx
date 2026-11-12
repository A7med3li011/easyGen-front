import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo.tsx'
import { useAuthStore, useLogout } from '../../features/auth'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const logoutMutation = useLogout()

  function logout() {
    closeMenu()
    logoutMutation.mutate()
  }

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        {/* Desktop links (empty while the session check runs, so they don't flash) */}
        <div className="hidden items-center gap-2 sm:flex">
          {status === 'authenticated' && (
            <>
              <Link
                to="/profile"
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {user?.name}
              </Link>
              <button
                type="button"
                onClick={logout}
                disabled={logoutMutation.isPending}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-60"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
              </button>
            </>
          )}
          {status === 'guest' && (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="-mr-2 flex size-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground sm:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? 'M6 18 18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="flex flex-col gap-2 border-t border-border px-4 py-4 sm:hidden">
          {status === 'authenticated' && (
            <>
              <p className="text-center text-sm text-muted-foreground">Logged in as {user?.name}</p>
              <Link
                to="/profile"
                onClick={closeMenu}
                className="rounded-lg border border-border bg-card px-4 py-3 text-center font-medium transition hover:bg-muted"
              >
                Personal details
              </Link>
              <button
                type="button"
                onClick={logout}
                disabled={logoutMutation.isPending}
                className="rounded-lg border border-border bg-card px-4 py-3 text-center font-medium transition hover:bg-muted disabled:opacity-60"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
              </button>
            </>
          )}
          {status === 'guest' && (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-lg border border-border bg-card px-4 py-3 text-center font-medium transition hover:bg-muted"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-lg bg-primary px-4 py-3 text-center font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
