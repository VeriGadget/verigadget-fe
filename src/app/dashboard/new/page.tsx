"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ArrowLeft, 
  Package, 
  ImageIcon, 
  DollarSign, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const listingFormSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  image_url: z.string().url("Please enter a valid image URL"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.enum(["Laptop", "Phone", "Tablet", "Wearable"], {
    error: "Please select a category",
  }),
  brand: z.string().min(1, "Brand is required"),
  condition: z.enum(["Mint", "Excellent", "Good", "Fair"], {
    error: "Please select a condition",
  }),
});

interface ListingFormValues {
  name: string;
  description: string;
  image_url: string;
  price: number;
  category: "Laptop" | "Phone" | "Tablet" | "Wearable";
  brand: string;
  condition: "Mint" | "Excellent" | "Good" | "Fair";
}

const defaultValues: Partial<ListingFormValues> = {
  name: "",
  description: "",
  image_url: "",
  price: undefined,
  brand: "",
};

export default function NewListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ListingFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(listingFormSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  const watchedValues = form.watch();

  async function onSubmit(data: ListingFormValues) {
    setIsSubmitting(true);
    
    // Mock submission - log payload for future Sui integration
    console.log("Creating listing with payload:", {
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      price: data.price,
      category: data.category,
      brand: data.brand,
      condition: data.condition,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);

    // Redirect to dashboard after success
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  }

  const getConditionColor = (condition: string | undefined) => {
    switch (condition) {
      case "Mint":
        return "bg-green-100 text-green-700";
      case "Excellent":
        return "bg-blue-100 text-blue-700";
      case "Good":
        return "bg-yellow-100 text-yellow-700";
      case "Fair":
        return "bg-zinc-100 text-zinc-600";
      default:
        return "bg-zinc-100 text-zinc-400";
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-24 pb-20 bg-zinc-50/50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="max-w-lg mx-auto border-zinc-200 rounded-[2rem] shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Listing Created!</h2>
              <p className="text-zinc-500 mb-6">
                Your gadget has been listed successfully. Redirecting to dashboard...
              </p>
              <div className="w-8 h-1 bg-green-500 rounded-full mx-auto animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-zinc-50/50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-zinc-900">List New Gadget</h1>
            <p className="text-zinc-500">Create an NFT listing for your device</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <Card className="border-zinc-200 rounded-[2rem] shadow-sm">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Package className="w-5 h-5 text-zinc-400" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gadget Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., MacBook Pro M2 Max 14-inch (2023)" 
                              className="h-12 rounded-xl"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Include model, year, and key specs
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
                            <Textarea 
                              placeholder="Describe the condition, what's included, any defects..." 
                              className="min-h-[120px] rounded-xl resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Be honest about condition to avoid disputes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Device Details */}
                <Card className="border-zinc-200 rounded-[2rem] shadow-sm">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-lg font-bold">Device Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl w-full">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Laptop">Laptop</SelectItem>
                                <SelectItem value="Phone">Phone</SelectItem>
                                <SelectItem value="Tablet">Tablet</SelectItem>
                                <SelectItem value="Wearable">Wearable</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Apple, Dell, Samsung" 
                                className="h-12 rounded-xl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl w-full">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mint">Mint - Like new, no signs of use</SelectItem>
                              <SelectItem value="Excellent">Excellent - Minor wear, fully functional</SelectItem>
                              <SelectItem value="Good">Good - Normal wear, works perfectly</SelectItem>
                              <SelectItem value="Fair">Fair - Visible wear or minor issues</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Pricing & Image */}
                <Card className="border-zinc-200 rounded-[2rem] shadow-sm">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-zinc-400" />
                      Pricing & Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                              <Input 
                                type="number"
                                placeholder="0.00" 
                                className="h-12 rounded-xl pl-8 max-w-xs"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Buyer will escrow this amount
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-zinc-400" />
                            Image URL
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              className="h-12 rounded-xl"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Use a direct link to a product image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="rounded-full bg-zinc-900 hover:bg-zinc-800 h-12 px-8 flex-1 sm:flex-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Listing...
                      </>
                    ) : (
                      "Create Listing"
                    )}
                  </Button>
                  <Link href="/dashboard">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-full h-12 px-8 w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </div>

          {/* Preview Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
                Preview
              </h3>
              <Card className="border-zinc-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-zinc-100 relative">
                  {watchedValues.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={watchedValues.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-zinc-300" />
                    </div>
                  )}
                  {watchedValues.condition && (
                    <Badge 
                      className={`absolute top-4 right-4 rounded-full px-3 border-none ${getConditionColor(watchedValues.condition)}`}
                    >
                      {watchedValues.condition}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    {watchedValues.category || "Category"} · {watchedValues.brand || "Brand"}
                  </div>
                  <h4 className="font-bold text-zinc-900 mb-2 line-clamp-2">
                    {watchedValues.name || "Gadget Name"}
                  </h4>
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                    {watchedValues.description || "Description will appear here..."}
                  </p>
                  <div className="text-xl font-black text-zinc-900">
                    ${watchedValues.price || "0"}
                  </div>
                </CardContent>
              </Card>
              <p className="text-xs text-zinc-400 text-center mt-4">
                This is how buyers will see your listing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
