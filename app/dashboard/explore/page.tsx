"use client";

import { Button } from "@/components/ui/button";
import { getPublicModules } from "@/firebase/firestore";
import { Module } from "@/interfaces/module.interface";
import { Eye, Plus } from "lucide-react";
import Link from "next/dist/client/link";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      const modules = await getPublicModules();
      console.log(modules);
      setModules(modules);
    };

    fetchModules();
  }, []);

  return (
    <>
      {modules.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {modules.map((module, index: number) => (
            <div
              key={index}
              className="flex flex-col p-2 gap-2 justify-between relative border border-slate-800 rounded-sm"
            >
              {/* Module Title */}
              <h2 className="text-lg text-center font-semibold text-gray-900 dark:text-gray-100">
                {module.name}
              </h2>

              <h2 className="text-sm text-center text-gray-900 dark:text-gray-500">
                {module.description}
              </h2>

              {/* Actions */}
              <div className="w-full flex justify-between gap-2">
                <Button asChild variant="ghost">
                  <Link
                    href={`/dashboard/modules/${module.id}`}
                    className="dark:text-white"
                  >
                    <Eye />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link
                    href={`/dashboard/modules/edit/${module.id}`}
                    className="dark:text-white"
                  >
                    <Plus />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400 text-center">
            You do not have any modules yet.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/new-module">
              <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                Create Module
              </button>
            </Link>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Explore Modules
            </button>
          </div>
        </div>
      )}
    </>
  );
}
