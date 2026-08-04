import Link from "next/link";

const foundations = [
  "Next.js App Router with strict TypeScript",
  "Fail-closed Clerk authentication boundary",
  "Secretless Storybook, Vitest, Playwright, and axe coverage",
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <span className="text-lg font-semibold tracking-tight">BridgeWorks</span>
          <Link
            href="/sign-in"
            className="inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Private talent liquidity network
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Build trusted work relationships, step by step.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            BridgeWorks turns a new professional connection into a trusted
            collaboration, then gives both sides a clear path toward long-term
            work.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-in"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            >
              Sign in to BridgeWorks
            </Link>
            <Link
              href="#foundation"
              className="inline-flex min-h-11 items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            >
              Review the foundation
            </Link>
          </div>
        </div>

        <aside
          id="foundation"
          aria-labelledby="foundation-title"
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <h2 id="foundation-title" className="text-lg font-semibold">
            Foundation status
          </h2>
          <ul className="mt-5 space-y-4">
            {foundations.map((foundation) => (
              <li key={foundation} className="flex gap-3 text-sm leading-6">
                <span
                  aria-hidden="true"
                  className="mt-2 size-2 shrink-0 rounded-full bg-foreground"
                />
                <span>{foundation}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
