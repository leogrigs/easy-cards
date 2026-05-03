"use client";

import { AppCard } from "@/components/AppCard";
import { AppCardSkeleton } from "@/components/AppCardSkeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getModuleById } from "@/firebase/firestore";
import { Module } from "@/interfaces/module.interface";
import { useLoader } from "@/providers/LoaderContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayModulePage() {
  const searchParams = useParams<{ moduleId: string }>();
  const moduleId = searchParams["moduleId"];
  const [module, setModule] = useState<Module | null>(null);
  const { isLoading, setLoading } = useLoader();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!moduleId) return;
    setLoading(true);
    const fetchModule = async () => {
      try {
        setModule(await getModuleById(moduleId));
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

  if (isLoading || module === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 px-0 py-16 lg:px-8 lg:py-24">
        <div className="text-center">
          <Skeleton className="mx-auto mb-2 h-9 w-64" />
          <Skeleton className="mx-auto h-4 w-80" />
        </div>
        <div className="w-full max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-4xl">
          <AppCardSkeleton />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-0 py-16 lg:px-8 lg:py-24">
      {/* Module Header */}
      <div className="text-center">
        <h3 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {module?.name}
        </h3>
        <p className="mx-auto max-w-xl text-base text-zinc-600 dark:text-zinc-400">
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
          <ChevronLeft className="h-4 w-4" />
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
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
