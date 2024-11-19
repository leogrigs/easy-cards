"use client";

import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function CreateModulePage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    public: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublicToggle = () => {
    setFormData((prev) => ({ ...prev, public: !prev.public }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Here you would integrate the module creation logic
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create a New Module
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Start building your flashcard collections by creating a module.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Module Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Module Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter module name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Module Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter a brief description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-4">
            <Switch
              id="public"
              checked={formData.public}
              onCheckedChange={handlePublicToggle}
            />
            <label
              htmlFor="public"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {formData.public ? "Public Module" : "Private Module"}
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="w-full">
              Create Module
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
