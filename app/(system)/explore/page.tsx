"use client";

import AppInputSearch from "@/components/app-input-search";
import { AppModule } from "@/components/app-module";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPublicModules, updateUserModules } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Module, ModulePreview } from "@/interfaces/module.interface";
import { useAuth } from "@/providers/AuthContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const filteredModules = modules.filter(
    (module: ModulePreview) =>
      module.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

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

  const addModuleToUser = async (module: ModulePreview) => {
    if (!user) return;
    setLoading(true);
    await updateUserModules(user.uid, module);
    toast({
      title: "Module added",
      description: `Module ${module.name} added to your modules`,
    });
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Explore Modules
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Discover and add modules to your collection.
        </p>
      </header>

      <Separator className="mb-8" />
      <div className="flex gap-4 flex-col md:flex-row items-center justify-between mb-8">
        <div className="w-full md:w-56">
          <AppInputSearch
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Button className="w-full md:w-auto" asChild variant="outline">
          <Link href="/modules/new-module">
            <Plus />
            Create Module
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredModules.length > 0 ? (
        <div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredModules.map((module) => (
              <AppModule
                module={module}
                type="explore"
                onAdd={addModuleToUser}
                isOwner={module.ownerId === user?.uid}
                key={module.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="mb-6 text-gray-600 dark:text-gray-400 text-center">
            No modules found. Create a new one to get started.
          </p>
        </div>
      )}
    </div>
  );
}
