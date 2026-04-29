"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-900 px-6 text-center text-zinc-50">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h1 className="text-3xl font-bold">Application error</h1>
          <p className="max-w-md text-zinc-400">
            {error.message || "An unexpected error occurred."}
          </p>
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
