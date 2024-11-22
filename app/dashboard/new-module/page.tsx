"use client";

import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createModule, updateUserModules } from "@/firebase/firestore";
import { Card } from "@/interfaces/card.interface";
import { Module } from "@/interfaces/module.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateModulePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    public: false,
  });

  const [cards, setCards] = useState<Card[]>([]);
  const [newCard, setNewCard] = useState({ front: "", back: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublicToggle = () => {
    setFormData((prev) => ({ ...prev, public: !prev.public }));
  };

  const handleAddCard = () => {
    if (newCard.front.trim() && newCard.back.trim()) {
      setCards((prev) => [...prev, { id: Date.now().toString(), ...newCard }]);
      setNewCard({ front: "", back: "" });
    }
  };

  const handleEditCard = (
    id: string,
    updatedCard: { front: string; back: string }
  ) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updatedCard } : card))
    );
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const moduleData: Module = {
      ...formData,
      id: Date.now().toString(),
      ownerId: user.uid,
      cards,
    };

    await createModule(moduleData);
    await updateUserModules(user.uid, moduleData.id, moduleData.name);

    console.log("Module Data Submitted:", moduleData);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col">
      <div className="w-full flex-1 max-w-5xl p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Create a New Module
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Module Info Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Module Information
            </h2>
            <div className="space-y-4">
              {/* Module Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            </div>
          </div>

          {/* Card Management Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Cards
            </h2>

            {/* Add New Card */}
            <div className="space-y-2 mb-6">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
                Add a New Card
              </h3>
              <div className="space-y-2">
                <Input
                  placeholder="Front of the card"
                  value={newCard.front}
                  onChange={(e) =>
                    setNewCard((prev) => ({ ...prev, front: e.target.value }))
                  }
                />
                <Input
                  placeholder="Back of the card"
                  value={newCard.back}
                  onChange={(e) =>
                    setNewCard((prev) => ({ ...prev, back: e.target.value }))
                  }
                />
                <Button type="button" onClick={handleAddCard}>
                  Add Card
                </Button>
              </div>
            </div>

            {/* Card List */}
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700 shadow flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Card
                    </h4>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <Input
                    value={card.front}
                    onChange={(e) =>
                      handleEditCard(card.id, {
                        front: e.target.value,
                        back: card.back,
                      })
                    }
                    placeholder="Front of the card"
                  />
                  <Input
                    value={card.back}
                    onChange={(e) =>
                      handleEditCard(card.id, {
                        front: card.front,
                        back: e.target.value,
                      })
                    }
                    placeholder="Back of the card"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            type="submit"
            className="w-full md:w-auto"
          >
            Create Module
          </Button>
        </div>
      </div>
    </div>
  );
}
