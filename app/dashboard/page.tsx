"use client";

import { getUserData } from "@/firebase/firestore";
import { UserData } from "@/interfaces/user-data.interface";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
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
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-5xl p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Your Modules
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Manage your flashcards and explore new ones!
          </p>
        </header>

        {modules.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {modules.map((module, index: number) => (
              <div
                key={index}
                className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                {/* Module Title */}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {module.name}
                </h2>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/modules/${module.id}`}>
                    <button className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      View
                    </button>
                  </Link>
                  <Link href={`/dashboard/modules/edit/${module.id}`}>
                    <button className="flex-1 px-4 py-2 text-sm text-white bg-yellow-500 rounded-lg hover:bg-yellow-600">
                      Edit
                    </button>
                  </Link>
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
