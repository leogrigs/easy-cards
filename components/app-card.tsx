import { ICard } from "@/interfaces/card.interface";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";

export interface IAppCardProps {
  card: ICard;
}

export function AppCard({ card }: IAppCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer p-4"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <Card
        className={`group relative w-full h-64 mx-auto rounded-lg ${
          isFlipped
            ? "border-indigo-800 dark:border-indigo-400"
            : "border-emerald-800 dark:border-emerald-400"
        }`}
        style={{
          perspective: "1200px",
        }}
      >
        <CardContent
          className={`relative w-full h-full flex items-center justify-center rounded-lg transform transition-transform duration-700`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front of the Card */}
          <div
            className="absolute inset-0 flex items-center justify-center px-4 text-center rounded-lg"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 break-words">
              {card.front}
            </p>
          </div>

          {/* Back of the Card */}
          <div
            className="absolute inset-0 flex items-center justify-center px-4 text-center rounded-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 break-words">
              {card.back}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
