"use client";

import { useAuth } from "./AuthContext";

export default function AuthPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Welcome to Easy Cards
        </h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Sign in to access your flashcards and start learning.
        </p>
        <div className="mt-6">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-md dark:focus:ring-blue-800"
          >
            <span>Sign in with Google</span>
          </button>
        </div>
        <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{" "}
          <a
            href="/terms"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
