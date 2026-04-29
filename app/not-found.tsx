import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
      <h1 className="text-7xl font-extrabold tracking-tight">404</h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        We couldn&apos;t find the page you were looking for.
      </p>
      <Button asChild>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" /> Back to home
        </Link>
      </Button>
    </div>
  );
}
