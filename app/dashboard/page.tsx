"use client";

import { getUserData } from "@/firebase/firestore";
import { UserData } from "@/interfaces/user-data.interface";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const modules = userData
    ? [...userData.createdModules, ...userData.claimedModules]
    : [];

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = (await getUserData(user)) as UserData;
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Your Modules
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Manage your flashcards and explore new ones!
          </p>
        </header>

        {modules.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {modules.map((module, index: number) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {module.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {module.description || "No description available."}
                </p>
                <div className="mt-4">
                  <button className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    View Module
                  </button>
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
              <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                Create Module
              </button>
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
