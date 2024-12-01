"use client";

import { AppModule } from "@/components/app-module";
import { Button } from "@/components/ui/button";
import { getPublicModules, updateUserModules } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Module } from "@/interfaces/module.interface";
import { useAuth } from "@/providers/AuthContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const addModuleToUser = async (module: Module) => {
    if (!user) return;
    setLoading(true);
    await updateUserModules(user.uid, module.id, module.name);
    toast({
      title: "Module added",
      description: `Module ${module.name} added to your modules`,
    });
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-8">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : modules.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {modules.map((module) => (
            <AppModule
              module={module}
              type="explore"
              onAdd={addModuleToUser}
              key={module.id}
            />
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
