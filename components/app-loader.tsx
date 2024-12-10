export default function AppLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-6 h-10 bg-indigo-700 rounded-md animate-hflip"></div>
        <div className="absolute top-2 left-2 w-6 h-10 bg-indigo-500 rounded-md animate-hflip"></div>
      </div>
      <span className="text-indigo-400 text-md font-medium">Loading...</span>
    </div>
  );
}
