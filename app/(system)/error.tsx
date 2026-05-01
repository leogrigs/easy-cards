"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function SystemError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <h2 className="text-2xl font-bold">We hit a snag loading this page</h2>
      <p className="max-w-md text-muted-foreground">
        {error.message ||
          "Please try reloading. If it keeps happening, let us know."}
      </p>
      <Button onClick={reset}>
        <RefreshCw className="mr-2 h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
