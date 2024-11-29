"use client";

import { Button } from "@/components/ui/button";
import { getPublicModules } from "@/firebase/firestore";
import { Module } from "@/interfaces/module.interface";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const modules = await getPublicModules();
        setModules(modules);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : modules.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="flex flex-col p-4 gap-2 border border-slate-800 rounded-lg shadow-md"
            >
              {/* Module Title */}
              <h2 className="text-lg text-center font-semibold text-gray-900 dark:text-gray-100">
                {module.name}
              </h2>

              {/* Module Description */}
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                {module.description}
              </p>

              {/* Actions */}
              <div className="w-full flex justify-between gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/modules/${module.id}`}>
                    <Eye className="h-4 w-4" /> View
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/modules/edit/${module.id}`}>
                    <Plus className="h-4 w-4" /> Edit
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="mb-6 text-gray-600 dark:text-gray-400 text-center">
            No modules found. Create a new one to get started.
          </p>
          <Button asChild variant="link" className="flex items-center gap-2">
            <Link href="/modules/new-module">
              <Plus className="h-5 w-5" /> Create Module
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
