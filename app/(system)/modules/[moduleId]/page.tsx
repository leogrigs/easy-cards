"use client";

import { AppCard } from "@/components/AppCard";
import { AppCardSkeleton } from "@/components/AppCardSkeleton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getModuleById, ModuleNotFoundError } from "@/firebase/firestore";
import { toast } from "sonner";
import { Module } from "@/interfaces/module.interface";
import { useLoader } from "@/providers/LoaderContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewModulePage() {
  const searchParams = useParams<{ moduleId: string }>();
  const moduleId = searchParams["moduleId"];
  const [module, setModule] = useState<Module | null>(null);
  const { isLoading, setLoading } = useLoader();
  const router = useRouter();

  useEffect(() => {
    if (!moduleId) return;

    const fetchModule = async () => {
      try {
        setModule(await getModuleById(moduleId));
      } catch (error) {
        toast.error(
          error instanceof ModuleNotFoundError
            ? "Module not found."
            : "An error occurred while fetching the module."
        );
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  if (isLoading || module === null) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <header className="mb-6">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="mt-3 h-4 w-3/4" />
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <AppCardSkeleton key={i} />
          ))}
        </div>
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
