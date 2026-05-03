import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function AppCardSkeleton() {
  return (
    <div className="p-4" data-testid="card-skeleton">
      <Card className="relative mx-auto h-64 w-full rounded-lg">
        <CardContent className="flex h-full w-full items-center justify-center rounded-lg">
          <Skeleton className="h-6 w-2/3" />
        </CardContent>
      </Card>
    </div>
  );
}
