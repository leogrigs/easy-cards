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
import { Switch } from "@/components/ui/switch"; // Assuming Switch is part of shadcnui
import { zodResolver } from "@hookform/resolvers/zod";
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
});

export default function CreateModulePage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      public: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Values:", values);
  }

  return (
    <div className="w-full max-w-4xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Create a New Module
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Module Name Field */}
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

          {/* Description Field */}
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

          {/* Public Checkbox */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Create Module
          </Button>
        </form>
      </Form>
    </div>
  );
}
