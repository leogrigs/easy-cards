"use client";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Welcome to your dashboard!
        </p>
      </div>
    </div>
  );
}
