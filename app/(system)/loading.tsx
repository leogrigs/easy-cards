import AppLoader from "@/components/AppLoader";

export default function SystemLoading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <AppLoader />
    </div>
  );
}
