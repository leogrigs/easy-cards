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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Module name must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Module description must be at least 10 characters." }),
  public: z.boolean(),
});

export default function CreateModulePage() {
  const { toast } = useToast();
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [jsonInput, setJsonInput] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      public: false,
    },
  });

  const handleAddCard = (front: string, back: string) => {
    if (!front || !back) {
      toast({
        title: "Error",
        description: "Both Front and Back are required.",
        variant: "destructive",
      });
      return;
    }
    setCards([...cards, { front, back }]);
  };

  const handleBulkAdd = () => {
    try {
      const parsedCards = JSON.parse(jsonInput);

      if (
        !Array.isArray(parsedCards) ||
        !parsedCards.every(
          (card) =>
            typeof card.front === "string" && typeof card.back === "string"
        )
      ) {
        throw new Error("Invalid format.");
      }

      setCards([...cards, ...parsedCards]);
      setJsonInput("");
      toast({ title: "Success", description: "Cards added successfully." });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Invalid JSON format. Ensure it's an array of objects with 'front' and 'back'.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (cards.length === 0) {
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
    console.log("Module Data:", values);
    console.log("Cards:", cards);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Create a New Module
      </h2>

      {/* Tabs Section */}
      <Tabs defaultValue="module">
        <TabsList className="mb-8 grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="module">Module</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>

        {/* Module Tab */}
        <TabsContent value="module">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Module Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter module name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed for your module.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Module Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter module description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of this module.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Public Toggle */}
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
                      Make this module visible to others.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards">
          {/* Manual Card Creation */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold">Manual Creation</h4>
            <div className="flex gap-4 items-center">
              <Input id="manualFront" placeholder="Front" />
              <Input id="manualBack" placeholder="Back" />
              <Button
                onClick={() =>
                  handleAddCard(
                    (document.getElementById("manualFront") as HTMLInputElement)
                      .value,
                    (document.getElementById("manualBack") as HTMLInputElement)
                      .value
                  )
                }
              >
                Add
              </Button>
            </div>
          </div>

          {/* Bulk Card Creation */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold">Bulk Creation</h4>
            <Textarea
              placeholder={`Enter cards in JSON format, e.g.:\n[\n  {"front": "Q1", "back": "A1"},\n  {"front": "Q2", "back": "A2"}\n]`}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <Button onClick={handleBulkAdd}>Apply</Button>
          </div>

          {/* Shared Card Visualization */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Current Cards</h4>
            {cards.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="font-semibold">Front: {card.front}</p>
                    <p className="text-gray-500">Back: {card.back}</p>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveCard(index)}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No cards added yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={() => setCards([])}>
          Clear Cards
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)}>
          <Plus className="mr-2" />
          Create Module
        </Button>
      </div>
    </div>
  );
}
