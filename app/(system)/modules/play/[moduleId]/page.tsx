"use client";

import { AppCard } from "@/components/app-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { firestore } from "@/firebase/clientApp";
import { Module } from "@/interfaces/module.interface";
import { doc, getDoc } from "@firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayModulePage() {
  const searchParams = useParams<{ moduleId: string }>();
  const moduleId = searchParams["moduleId"];
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
    <div className="flex flex-col items-center justify-center gap-8 px-0 py-16 lg:px-8 lg:py-24">
      {/* Module Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {module?.name}
        </h3>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          {module?.description}
        </p>
      </div>

      {/* Cards Carousel */}
      <div className="relative w-full max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-4xl">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {module?.cards.map((card, index) => (
              <CarouselItem key={index}>
                <AppCard card={card} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Shadcn UI-inspired Paginator */}
      <div className="flex items-center gap-4">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => api?.scrollPrev()}
          disabled={current === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Current Position */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Card</span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {current}
          </span>
          <span>of</span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {count}
          </span>
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => api?.scrollNext()}
          disabled={current === count}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
