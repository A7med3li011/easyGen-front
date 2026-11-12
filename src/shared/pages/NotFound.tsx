import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.tsx'

function NotFound() {
  return (
    <>
      <Navbar />

      <main className="relative isolate flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -z-10 size-128 -translate-1/2 rounded-full bg-primary/15 blur-3xl" />

        <p className="bg-linear-to-r from-primary to-accent bg-clip-text text-8xl font-bold tracking-tight text-transparent sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-8 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
        >
          Back to home
        </Link>
      </main>
    </>
  )
}

export default NotFound
