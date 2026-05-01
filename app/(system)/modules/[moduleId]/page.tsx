"use client";

import { AppCard } from "@/components/AppCard";
import AppLoader from "@/components/AppLoader";
import { Badge } from "@/components/ui/badge";
import { getModuleById, ModuleNotFoundError } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Module } from "@/interfaces/module.interface";
import { useLoader } from "@/providers/LoaderContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewModulePage() {
  const searchParams = useParams<{ moduleId: string }>();
  const moduleId = searchParams["moduleId"];
  const [module, setModule] = useState<Module | null>(null);
  const { isLoading, setLoading } = useLoader();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!moduleId) return;

    const fetchModule = async () => {
      try {
        setModule(await getModuleById(moduleId));
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof ModuleNotFoundError
              ? "Module not found."
              : "An error occurred while fetching the module.",
          variant: "destructive",
        });
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  if (isLoading || module === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AppLoader />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Module not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold dark:text-white">{module.name}</h2>
          <Badge variant={module.public ? "default" : "secondary"}>
            {module.public ? "Public" : "Private"}
          </Badge>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {module.description || "No description available."}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {module.cards.map((card, index) => (
          <AppCard card={card} key={index} />
        ))}
      </div>
    </div>
  );
}
