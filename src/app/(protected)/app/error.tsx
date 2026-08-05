"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HOME_ROUTE } from "@/lib/auth-routes";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ reset }: AppErrorProps) {
  return (
    <section
      role="alert"
      aria-labelledby="application-error-title"
      className="max-w-xl rounded-2xl border border-information/25 bg-information-muted p-6 text-information-muted-foreground shadow-sm sm:p-8"
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-background/80 shadow-sm">
        <AlertTriangle aria-hidden="true" className="size-5" />
      </div>
      <h1
        id="application-error-title"
        className="mt-5 text-2xl font-semibold tracking-tight"
      >
        We could not open your account workspace
      </h1>
      <p className="mt-3 max-w-prose text-base leading-7">
        BridgeWorks stopped before showing incomplete account information. Try
        again, or return to the public site.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={HOME_ROUTE}>Return to BridgeWorks</Link>
        </Button>
      </div>
    </section>
  );
}
