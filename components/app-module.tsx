import { Module } from "@/interfaces/module.interface";
import { Eye, Play, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export interface IAppModuleProps {
  module: Module;
  type?: "explore" | "dashboard";
  onDelete?: (moduleId: string) => void;
  onAdd?: (module: Module) => void;
}

export function AppModule({
  module,
  type = "dashboard",
  onDelete,
  onAdd,
}: IAppModuleProps) {
  return (
    <div className="flex flex-col p-4 gap-2 border border-slate-800 rounded-lg shadow-md">
      {/* Module Title */}
      <h2 className="text-lg text-center font-semibold text-gray-900 dark:text-gray-100">
        {module.name}
      </h2>

      {/* Module Description */}
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        {module.description}
      </p>

      {/* Actions */}
      {type === "dashboard" ? (
        <div className="w-full flex justify-between gap-2">
          <Button asChild variant="ghost">
            <Link href={`/modules/${module.id}`} className="dark:text-white">
              <Eye />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link
              href={`/modules/play/${module.id}`}
              className="dark:text-white"
            >
              <Play />
            </Link>
          </Button>
          <Button
            onClick={() => onDelete && onDelete(module.id)}
            variant="ghost"
          >
            <Trash className="dark:text-white" />
          </Button>
        </div>
      ) : (
        <div className="w-full flex justify-between gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/modules/${module.id}`}>
              <Eye className="h-4 w-4" /> View
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAdd && onAdd(module)}
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      )}
    </div>
  );
}
