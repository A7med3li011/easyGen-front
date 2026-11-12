import { Link } from 'react-router-dom'
import Navbar from '../../../shared/components/Navbar.tsx'

const year = new Date().getFullYear()

const stats = [
  { value: '75,000+', label: 'Authors' },
  { value: '2,000+', label: 'Companies' },
  { value: '75', label: 'Languages' },
  { value: '9x', label: 'Faster course creation' },
]

const features = [
  {
    title: 'Easy for everyone',
    text: 'Anyone in your organization can share knowledge, without adding to the L&D workload.',
    icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  },
  {
    title: 'Your AI co-author',
    text: 'EasyAI works with your in-house experts and applies your guidelines to every block.',
    icon: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z',
  },
  {
    title: 'AI-powered video',
    text: 'Make training videos in minutes from existing knowledge and decks. No editing skills needed.',
    icon: 'm15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z',
  },
  {
    title: 'Practice with coaching',
    text: 'EasyCoach lets learners practice workplace conversations by voice or text with instant feedback.',
    icon: 'M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z',
  },
  {
    title: 'Built-in translation',
    text: 'Translate and update courses without leaving the platform, with predictable pricing.',
    icon: 'm10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802',
  },
]

function Landing() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          {/* Soft background glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl sm:size-160"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-40 -right-20 -z-10 size-56 rounded-full bg-accent/20 blur-3xl sm:size-80"
          />

          <div className="mx-auto max-w-4xl px-4 pt-16 pb-16 text-center sm:px-6 sm:pt-24 sm:pb-20 lg:pt-32">
            {/* Pill on wide screens, rounded box when the text wraps on phones */}
            <span className="inline-block max-w-full rounded-2xl border border-border bg-card px-3 py-1 text-xs font-medium text-balance text-muted-foreground sm:rounded-full sm:px-4">
              ✨ The #1 platform for Employee-Generated Learning
            </span>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Create <span className="whitespace-nowrap">company-tailored</span> training{' '}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                at scale
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-pretty text-muted-foreground sm:mt-6 sm:text-lg">
              Turn knowledge into training with an authoring tool anyone can use.
            </p>

            {/* Full-width stacked buttons on phones, side by side from sm up */}
            <div className="mx-auto mt-8 flex max-w-sm flex-col items-center justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row">
              <Link
                to="/register"
                className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:w-auto"
              >
                Try free for 14 days
              </Link>
              <a
                href="#features"
                className="w-full rounded-lg border border-border bg-card px-6 py-3 font-medium transition hover:bg-muted sm:w-auto"
              >
                See features
              </a>
            </div>

            {/* Stats */}
            <dl className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-16 sm:grid-cols-4 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                  <dd className="order-first text-2xl font-bold tracking-tight sm:text-3xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              The authoring platform anyone can use
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">Everything your team needs to share knowledge.</p>
          </div>

          {/*
            Phones: 1 column.
            Tablets: 4-column grid, each card takes 2, the lone last card is centered.
            Desktop: 6-column grid, each card takes 2, the last row of 2 cards is centered.
          */}
          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-4 sm:gap-6 lg:grid-cols-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-5 text-card-foreground transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 sm:col-span-2 sm:p-6 sm:last:col-start-2 lg:last:col-start-auto lg:nth-4:col-start-2"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="rounded-2xl bg-linear-to-r from-primary to-accent px-5 py-10 text-center text-primary-foreground sm:rounded-3xl sm:px-10 sm:py-14">
            <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              Ready to turn knowledge into training?
            </h2>
            <p className="mt-3 text-pretty opacity-90">Try Easygenerator free for 14 days.</p>
            <Link
              to="/register"
              className="mt-6 inline-block w-full max-w-xs rounded-lg bg-background px-6 py-3 font-medium text-foreground transition hover:opacity-90 sm:mt-8 sm:w-auto"
            >
              Start free trial
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
        © {year} Easygenerator. All rights reserved.
      </footer>
    </>
  )
}

export default Landing
