"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset}>
        <RefreshCw className="mr-2 h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
