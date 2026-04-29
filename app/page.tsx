"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "../providers/AuthContext";

export default function Home() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
      <div className="w-full max-w-4xl animate-fade-in px-6 py-16 sm:py-24">
        {/* Hero Section */}
        <header className="text-center">
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Easy Cards
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Simplify learning with <strong>Easy Cards</strong> — a smart,
            intuitive app for creating, managing, and sharing flashcards.
          </p>
          <Button onClick={loginWithGoogle} variant="link">
            <LogIn />
            Sign in with Google
          </Button>
        </header>

        {/* Features Section */}
        <section className="mt-16 grid gap-8 sm:grid-cols-2">
          {[
            {
              title: "Create Flashcards",
              text: "Quickly create customizable flashcards for any topic.",
            },
            {
              title: "Explore Community",
              text: "Access a library of public flashcards from peers worldwide.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-zinc-200 bg-transparent p-6 shadow-md dark:border-zinc-800"
            >
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{feature.text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
