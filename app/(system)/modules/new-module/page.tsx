"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Module name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Module description must be at least 10 characters.",
  }),
  public: z.boolean(),
  cards: z.array(
    z.object({
      front: z.string().min(1, { message: "Front cannot be empty" }),
      back: z.string().min(1, { message: "Back cannot be empty" }),
    })
  ),
});

export default function CreateModulePage() {
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      public: false,
      cards: [],
    },
  });
  const { toast } = useToast();

  const handleAddCard = (front: string, back: string) => {
    setCards([...cards, { front, back }]);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleClearForm = () => {
    form.reset();
    setCards([]);
    toast({
      title: "Form cleared",
      description: "Your form has been cleared successfully.",
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (cards.length === 0) {
      form.setError("cards", {
        type: "manual",
        message: "You must add at least one card.",
      });
      toast({
        title: "Error",
        description: "You must add at least one card.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Module created",
      description: "Your module has been created successfully.",
    });
    console.log("Form Values:", { ...values, cards });
  };

  return (
    <div className="w-full max-w-4xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Create a New Module
      </h2>

      <Tabs defaultValue="module" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 my-8 gap-2">
          <TabsTrigger
            value="module"
            className="px-4 py-2 text-center border-b-2 transition-colors duration-200 dark:border-zinc-800 dark:hover:border-white dark:text-zinc-400 hover:text-black dark:hover:text-white aria-selected:border-white aria-selected:dark:border-white aria-selected:text-black aria-selected:dark:text-white"
          >
            Module
          </TabsTrigger>
          <TabsTrigger
            value="cards"
            className="px-4 py-2 text-center border-b-2 transition-colors duration-200 dark:border-zinc-800 dark:hover:border-white dark:text-zinc-400 hover:text-black dark:hover:text-white aria-selected:border-white aria-selected:dark:border-white aria-selected:text-black aria-selected:dark:text-white"
          >
            Cards
          </TabsTrigger>
        </TabsList>
        <TabsContent value="module">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Biology" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your module display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A brief description of your module"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about what this module covers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Public</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Toggle to make this module visible to others.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="cards">
          <div>
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              Cards
            </h3>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input placeholder="Front" className="flex-1" id="cardFront" />
                <Input placeholder="Back" className="flex-1" id="cardBack" />
                <Button
                  onClick={() =>
                    handleAddCard(
                      (document.getElementById("cardFront") as HTMLInputElement)
                        .value,
                      (document.getElementById("cardBack") as HTMLInputElement)
                        .value
                    )
                  }
                >
                  Add
                </Button>
              </div>
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-semibold">Front: {card.front}</p>
                    <p className="text-sm text-gray-500">Back: {card.back}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveCard(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={handleClearForm}>
          Clear Form
        </Button>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          <Plus />
          Create Module
        </Button>
      </div>
    </div>
  );
}
