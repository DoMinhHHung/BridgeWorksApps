export function CurrentUserLoading() {
  return (
    <div
      role="status"
      aria-label="Loading your BridgeWorks account"
      className="space-y-8 sm:space-y-10"
    >
      <div className="max-w-3xl space-y-4">
        <div className="h-4 w-36 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-10 w-72 max-w-full animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
        <div className="h-16 w-full max-w-2xl animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="h-28 animate-pulse border-b border-border bg-muted/70 motion-reduce:animate-none" />
        <div className="grid sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse border-b border-border bg-card last:border-b-0 motion-reduce:animate-none sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
            />
          ))}
        </div>
      </div>
      <div className="h-32 animate-pulse rounded-2xl border border-border bg-muted/45 motion-reduce:animate-none" />
      <span className="sr-only">Loading your BridgeWorks account</span>
    </div>
  );
}
