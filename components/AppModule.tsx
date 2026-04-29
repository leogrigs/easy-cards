import { ModulePreview } from "@/interfaces/module.interface";
import { Eye, Loader, Play, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export interface IAppModuleProps {
  module: ModulePreview;
  type?: "explore" | "dashboard";
  isOwner?: boolean;
  isLoading?: boolean;
  onDelete?: (moduleId: string) => void;
  onAdd?: (module: ModulePreview) => void;
}

export function AppModule({
  module,
  type = "dashboard",
  isOwner = false,
  isLoading = false,
  onDelete,
  onAdd,
}: IAppModuleProps) {
  return (
    <Card className="flex h-full flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <Badge variant="outline">{isOwner ? "Owner" : "Non-Owner"}</Badge>
        {type === "dashboard" && (
          <Badge variant={module.public ? "default" : "secondary"}>
            {module.public ? "Public" : "Private"}
          </Badge>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col">
        <CardTitle className="mb-2 text-lg font-semibold">
          {module.name}
        </CardTitle>
        <CardDescription className="flex-grow text-sm text-muted-foreground">
          {module.description}
        </CardDescription>
      </CardContent>

      {/* Footer */}
      <CardFooter className="mt-auto">
        <div className="flex w-full justify-between gap-2">
          {type === "dashboard" ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={`/modules/${module.id}`}
                  className="flex items-center"
                >
                  <Eye className="mr-1 h-4 w-4" /> View
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={`/modules/play/${module.id}`}
                  className="flex items-center"
                >
                  <Play className="mr-1 h-4 w-4" /> Play
                </Link>
              </Button>
              <Button
                onClick={() => onDelete && onDelete(module.id)}
                variant="ghost"
                size="sm"
                className="flex items-center"
              >
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Trash className="mr-1 h-4 w-4" />
                )}{" "}
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={`/modules/${module.id}`}
                  className="flex items-center"
                >
                  <Eye className="mr-1 h-4 w-4" /> View
                </Link>
              </Button>
              <Button
                onClick={() => onAdd && onAdd(module)}
                variant="ghost"
                size="sm"
                className="flex items-center"
              >
                {!isLoading ? (
                  <Plus className="mr-1 h-4 w-4" />
                ) : (
                  <Loader className="animate-spin" />
                )}{" "}
                Add
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
