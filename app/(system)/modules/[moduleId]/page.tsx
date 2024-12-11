"use client";

import { AppCard } from "@/components/app-card";
import { Badge } from "@/components/ui/badge";
import { firestore } from "@/firebase/clientApp";
import { Module } from "@/interfaces/module.interface";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewModulePage() {
  const searchParams = useParams<{ moduleId: string }>();
  const moduleId = searchParams["moduleId"];
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleId) return;

    const fetchModule = async () => {
      try {
        const moduleRef = doc(firestore, "modules", moduleId);
        const moduleSnapshot = await getDoc(moduleRef);

        if (moduleSnapshot.exists()) {
          setModule(moduleSnapshot.data() as Module);
          console.log("Module Data:", moduleSnapshot.data());
        } else {
          console.error("Module not found.");
          setModule(null);
        }
      } catch (error) {
        console.error("Error fetching module:", error);
        setModule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading module details...</p>
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
          <Badge>{module.public ? "Public" : "Private"}</Badge>
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
