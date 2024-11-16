"use client";

import { useAuth } from "../auth/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Welcome to your dashboard!
        </p>

        {user ? (
          <div className="mt-6">
            <p className="text-center text-gray-700 dark:text-gray-300">
              Logged in as{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {user.displayName || user.email}
              </span>
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={logout}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 rounded-md dark:focus:ring-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300 mt-6">
            Loading user details...
          </p>
        )}
      </div>
    </div>
  );
}
