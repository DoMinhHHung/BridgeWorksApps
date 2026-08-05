import { ArrowRight, Handshake, History, Sprout } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    title: "Start with a smaller commitment",
    description:
      "Create room for both sides to learn how they work together before making a longer-term decision.",
    icon: Handshake,
  },
  {
    title: "Build a clearer collaboration history",
    description:
      "Turn each completed step into context that can support the next working relationship.",
    icon: History,
  },
  {
    title: "Grow toward lasting work",
    description:
      "Move from a new connection to trusted collaboration, then toward a durable professional relationship.",
    icon: Sprout,
  },
] as const;

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <span className="text-lg font-semibold tracking-tight">BridgeWorks</span>
          <Link
            href="/sign-in"
            className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="relative isolate border-b border-border">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-72 bg-information-muted/60"
        />
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Trusted work, built over time
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Turn a new connection into work that lasts.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              BridgeWorks helps people move from a first collaboration to a
              trusted working relationship, with clearer context at every step.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              >
                Create an account
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              >
                Sign in
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-information/20 bg-card p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-primary">The BridgeWorks idea</p>
            <p className="mt-4 text-pretty text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Trust grows through real work, not through promises alone.
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Begin with a focused engagement, build shared confidence, and
              create a stronger path toward longer-term collaboration.
            </p>
          </aside>
        </div>
      </section>

      <section aria-labelledby="benefits-title" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="benefits-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            A more deliberate path to trusted collaboration
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            BridgeWorks is shaped around the relationship between people, not a
            volume of listings or activity counters.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex size-11 items-center justify-center rounded-xl bg-information-muted text-information-muted-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
