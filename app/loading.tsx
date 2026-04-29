import AppLoader from "@/components/AppLoader";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <AppLoader />
    </div>
  );
}
