"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "../providers/AuthContext";

export default function Home() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 flex items-center justify-center">
      <div className="w-full max-w-4xl px-6 py-16 sm:py-24 animate-fade-in">
        {/* Hero Section */}
        <header className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Easy Cards
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
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
              className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent shadow-md"
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{feature.text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
