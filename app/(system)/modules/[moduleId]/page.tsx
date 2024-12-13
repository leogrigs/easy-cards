"use client";

import { AppCard } from "@/components/AppCard";
import AppLoader from "@/components/AppLoader";
import { Badge } from "@/components/ui/badge";
import { firestore } from "@/firebase/clientApp";
import { useToast } from "@/hooks/use-toast";
import { Module } from "@/interfaces/module.interface";
import { useLoader } from "@/providers/LoaderContext";
import { doc, getDoc } from "firebase/firestore";
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
        const moduleRef = doc(firestore, "modules", moduleId);
        const moduleSnapshot = await getDoc(moduleRef);

        if (moduleSnapshot.exists()) {
          setModule(moduleSnapshot.data() as Module);
        } else {
          toast({
            title: "Error",
            description: "Module not found.",
            variant: "destructive",
          });
          router.push("/dashboard");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching the module.",
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
      <div className="flex items-center justify-center min-h-screen">
        <AppLoader />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Module not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <div className="flex justify-between items-center ">
          <h2 className="text-3xl font-bold dark:text-white">{module.name}</h2>
          <Badge variant={module.public ? "default" : "secondary"}>
            {module.public ? "Public" : "Private"}
          </Badge>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {module.description || "No description available."}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {module.cards.map((card, index) => (
          <AppCard card={card} key={index} />
        ))}
      </div>
    </div>
  );
}
