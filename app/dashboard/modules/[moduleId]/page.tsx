"use client";

import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Module {
  name: string;
  description?: string;
  cards: { front: string; back: string }[];
}

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
        <h1 className="text-3xl font-bold">{module.name}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {module.description || "No description available."}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {module.cards.map((card, index) => (
          <FlippableCard key={index} card={card} index={index} />
        ))}
      </div>

      <div className="mt-6">
        <Link href={`/dashboard/modules/edit/${moduleId}`}>
          <button className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600">
            Edit Module
          </button>
        </Link>
      </div>
    </div>
  );
}

interface CardProps {
  card: { front: string; back: string };
  index: number;
}

function FlippableCard({ card }: CardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className={`relative p-6 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 ${
        flipped ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {flipped ? (
          <div>
            <h3 className="text-lg font-semibold">Back</h3>
            <p className="mt-2">{card.back}</p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">Front</h3>
            <p className="mt-2">{card.front}</p>
          </div>
        )}
      </div>
    </div>
  );
}
