export default function AppLoading() {
  return (
    <div
      role="status"
      aria-label="Loading application overview"
      className="space-y-10"
    >
      <div className="max-w-3xl space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-10 w-56 max-w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-20 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
      </div>
      <div className="h-64 max-w-3xl animate-pulse rounded-xl border border-border bg-card motion-reduce:animate-none" />
      <span className="sr-only">Loading application overview</span>
    </div>
  );
}
