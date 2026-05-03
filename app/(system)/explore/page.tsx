"use client";

import AppInputSearch from "@/components/AppInputSearch";
import { AppModule } from "@/components/AppModule";
import { AppModuleSkeleton } from "@/components/AppModuleSkeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPublicModules, updateUserModules } from "@/firebase/firestore";
import { toast } from "sonner";
import { Module, ModulePreview } from "@/interfaces/module.interface";
import { useAuth } from "@/providers/AuthContext";
import { useLoader } from "@/providers/LoaderContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [modules, setModules] = useState<Module[] | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [buttonLoading, setButtonLoading] = useState("");
  const { isLoading, setLoading } = useLoader();
  const { user } = useAuth();
  const filteredModules = modules?.filter(
    (module: ModulePreview) =>
      module.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    setLoading(true);
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
    setButtonLoading(module.id);
    await updateUserModules(user.uid, module);
    toast.success(`Module ${module.name} added to your modules`);
    setButtonLoading("");
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
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
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
      {isLoading || modules === null ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <AppModuleSkeleton key={i} />
          ))}
        </div>
      ) : filteredModules!.length > 0 ? (
        <div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredModules!.map((module) => (
              <AppModule
                module={module}
                type="explore"
                onAdd={addModuleToUser}
                isOwner={module.ownerId === user?.uid}
                isLoading={buttonLoading === module.id}
                key={module.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
            No modules found. Create a new one to get started.
          </p>
        </div>
      )}
    </div>
  );
}
