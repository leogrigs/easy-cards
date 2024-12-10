"use client";

import AppInputSearch from "@/components/app-input-search";
import AppLoader from "@/components/app-loader";
import { AppModule } from "@/components/app-module";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deleteModuleFromUser, getUserData } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { ModulePreview } from "@/interfaces/module.interface";
import { UserData } from "@/interfaces/user-data.interface";
import { useAuth } from "@/providers/AuthContext";
import { useLoader } from "@/providers/LoaderContext";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isLoading, setLoading } = useLoader();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [buttonLoading, setButtonLoading] = useState("");
  const modules = userData
    ? [
        ...userData.modules.filter(
          (module: ModulePreview) =>
            module.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            module.description
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())
        ),
      ]
    : [];
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const data = (await getUserData(user)) as UserData;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!user) return;
    setButtonLoading(moduleId);
    await deleteModuleFromUser(user.uid, moduleId);
    await fetchUserData();
    toast({
      title: "Module deleted",
      description: "Your module has been deleted successfully.",
    });
    setButtonLoading("");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full p-4">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your Modules
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your modules and start learning.
          </p>
        </header>

        <Separator className="mb-8" />

        <div className="flex gap-4 flex-col md:flex-row items-center justify-between mb-8">
          <div className="w-full md:w-56">
            <AppInputSearch
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button className="w-full md:w-auto" asChild variant="outline">
            <Link href="/modules/new-module">
              <Plus />
              Create Module
            </Link>
          </Button>
        </div>
        {isLoading || userData === null ? (
          <AppLoader />
        ) : modules.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <AppModule
                module={module}
                onDelete={deleteModule}
                isOwner={module.ownerId === user?.uid}
                isLoading={buttonLoading === module.id}
                key={module.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400 text-center">
              You do not have any modules yet.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="link">
                <Link href="/explore">
                  Explore Modules <Search />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
