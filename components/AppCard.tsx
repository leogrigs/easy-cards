import { ICard } from "@/interfaces/card.interface";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";

export interface IAppCardProps {
  card: ICard;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

export function AppCard({
  card,
  isFlipped: controlledFlipped,
  onFlip,
}: IAppCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isFlipped =
    controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const handleFlip = () => {
    if (onFlip) onFlip(!isFlipped);
    else setInternalFlipped((prev) => !prev);
  };

  return (
    <div className="cursor-pointer p-4" onClick={handleFlip}>
      <Card
        className={`group relative mx-auto h-64 w-full rounded-lg ${
          isFlipped
            ? "border-indigo-800 dark:border-indigo-400"
            : "border-emerald-800 dark:border-emerald-400"
        }`}
        style={{
          perspective: "1200px",
        }}
      >
        <CardContent
          className={`relative flex h-full w-full transform items-center justify-center rounded-lg transition-transform duration-700`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front of the Card */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg px-4 text-center"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <p className="break-words text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {card.front}
            </p>
          </div>

          {/* Back of the Card */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg px-4 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="break-words text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {card.back}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
