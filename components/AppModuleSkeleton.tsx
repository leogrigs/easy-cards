import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function AppModuleSkeleton() {
  return (
    <Card className="flex h-full flex-col" data-testid="module-skeleton">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-14" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <Skeleton className="mb-3 h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex w-full justify-between gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardFooter>
    </Card>
  );
}
