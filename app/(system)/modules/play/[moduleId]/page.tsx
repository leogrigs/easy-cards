"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { firestore } from "@/firebase/clientApp";
import { Module } from "@/interfaces/module.interface";
import { doc, getDoc } from "@firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayModulePage() {
  const searchParams = useParams<{ moduleId: string }>();
  const moduleId = searchParams["moduleId"];
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>(
    {}
  );

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

  const toggleCardFlip = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Loading module details...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 sm:px-8 sm:py-24">
      {/* Module Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Module: {module?.name}
        </h3>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
          {module?.description}
        </p>
      </div>

      {/* Cards Carousel */}
      <Carousel className="w-full max-w-lg">
        <CarouselContent>
          {module?.cards.map((card, index) => (
            <CarouselItem key={index}>
              <div
                className="relative cursor-pointer p-2"
                onClick={() => toggleCardFlip(index)}
              >
                <Card
                  className={`group relative overflow-hidden transition-transform transform rounded-md`}
                  style={{
                    perspective: "1000px",
                  }}
                >
                  <CardContent
                    className="relative h-64 flex items-center justify-center rounded-lg"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.6s",
                      transform: flippedCards[index]
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* Front of the Card */}
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-lg"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {card.front}
                      </span>
                    </div>

                    {/* Back of the Card */}
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {card.back}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
