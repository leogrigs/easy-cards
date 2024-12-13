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
    <Card className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="flex flex-row justify-between items-start pb-4">
        <Badge variant="outline">{isOwner ? "Owner" : "Non-Owner"}</Badge>
        {type === "dashboard" && (
          <Badge variant={module.public ? "default" : "secondary"}>
            {module.public ? "Public" : "Private"}
          </Badge>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col">
        <CardTitle className="text-lg font-semibold mb-2">
          {module.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground flex-grow">
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
                  <Eye className="h-4 w-4 mr-1" /> View
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={`/modules/play/${module.id}`}
                  className="flex items-center"
                >
                  <Play className="h-4 w-4 mr-1" /> Play
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
                  <Trash className="h-4 w-4 mr-1" />
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
                  <Eye className="h-4 w-4 mr-1" /> View
                </Link>
              </Button>
              <Button
                onClick={() => onAdd && onAdd(module)}
                variant="ghost"
                size="sm"
                className="flex items-center"
              >
                {!isLoading ? (
                  <Plus className="h-4 w-4 mr-1" />
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
