"use client";

import { Button } from "@/components/ui/button";
import { getUserData } from "@/firebase/firestore";
import { UserData } from "@/interfaces/user-data.interface";
import { useAuth } from "@/providers/AuthContext";
import { Edit, Eye, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // Loader state
  const modules = userData ? [...userData.modules] : [];

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = (await getUserData(user)) as UserData;
        console.log("User data:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-5xl p-4">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your Modules
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your flashcards and explore new ones!
          </p>
        </header>

        {modules.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {modules.map((module, index: number) => (
              <div
                key={index}
                className="flex flex-col p-2 gap-2 justify-between relative border border-slate-800 rounded-sm"
              >
                {/* Module Title */}
                <h2 className="text-lg text-center font-semibold text-gray-900 dark:text-gray-100">
                  {module.name}
                </h2>

                {/* Actions */}
                <div className="w-full flex justify-between gap-2">
                  <Button asChild variant="ghost">
                    <Link
                      href={`/dashboard/modules/${module.id}`}
                      className="dark:text-white"
                    >
                      <Eye />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link
                      href={`/dashboard/modules/play/${module.id}`}
                      className="dark:text-white"
                    >
                      <Play />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link
                      href={`/dashboard/modules/edit/${module.id}`}
                      className="dark:text-white"
                    >
                      <Edit />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400 text-center">
              You do not have any modules yet.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard/new-module">
                <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                  Create Module
                </button>
              </Link>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Explore Modules
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
