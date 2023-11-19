"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { use, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/contexts/store";
import Link from "next/link";
import LoadingDots from "../LoadingDots";
import Spinner from "../Loaders/Spinner";
import { Order } from "@/types/types";

const checkoutDetailFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({
    message: "Email is required.",
  }),
  phone: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingLine1: z.string().optional(),
  shippingLine2: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().optional(),
});

function CheckoutDetailsForm({
  setOrderData,
  initialData,
}: {
  setOrderData: (data: any) => void;
  initialData: Order | null;
}) {
  const form = useForm<z.infer<typeof checkoutDetailFormSchema>>({
    resolver: zodResolver(checkoutDetailFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.billing.name,
          email: initialData.email,
          phone: initialData.billing.phone,
          line1: initialData.billing.address.line1,
          line2: initialData.billing.address.line2,
          city: initialData.billing.address.city,
          state: initialData.billing.address.state,
          postalCode: initialData.billing.address.postalCode,
          country: initialData.billing.address.country,
          shippingName: initialData.shipping.name,
          shippingPhone: initialData.shipping.phone,
          shippingLine1: initialData.shipping.address.line1,
          shippingLine2: initialData.shipping.address.line2,
          shippingCity: initialData.shipping.address.city,
          shippingState: initialData.shipping.address.state,
          shippingPostalCode: initialData.shipping.address.postalCode,
          shippingCountry: initialData.shipping.address.country,
        }
      : {
          name: "",
          email: "",
          phone: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          shippingName: "",
          shippingPhone: "",
          shippingLine1: "",
          shippingLine2: "",
          shippingCity: "",
          shippingState: "",
          shippingPostalCode: "",
          shippingCountry: "",
        },
  });

  const [checked, setChecked] = useState(false);
  const [editMode, setEditMode] = useState<"billing" | "shipping" | null>(null);
  const { cart, session, headers } = useStore();

  const handleChecked = () => {
    setChecked(!checked);
  };
  const formValues = form.watch();
  useEffect(() => {
    if (checked) {
      form.setValue("shippingName", formValues.name);
      form.setValue("shippingPhone", formValues.phone);
      form.setValue("shippingLine1", formValues.line1);
      form.setValue("shippingLine2", formValues.line2);
      form.setValue("shippingCity", formValues.city);
      form.setValue("shippingState", formValues.state);
      form.setValue("shippingPostalCode", formValues.postalCode);
      form.setValue("shippingCountry", formValues.country);
    } else {
      form.setValue("shippingName", "");
      form.setValue("shippingPhone", "");
      form.setValue("shippingLine1", "");
      form.setValue("shippingLine2", "");
      form.setValue("shippingCity", "");
      form.setValue("shippingState", "");
      form.setValue("shippingPostalCode", "");
      form.setValue("shippingCountry", "");
    }
  }, [checked, form, formValues]);

  const checkoutMutation = useMutation({
    mutationFn: (values: z.infer<typeof checkoutDetailFormSchema>) => {
      return fetch("/api/storefront/checkout", {
        headers,
        method: "POST",
        body: JSON.stringify({ sessionId: session?.id as string, values }),
      });
    },
    onSuccess: async (data) => {
      const jsonData = await data.json();
      console.log(jsonData);
      setOrderData(jsonData);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function onSubmit(values: z.infer<typeof checkoutDetailFormSchema>) {
    checkoutMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          {!initialData ||
            (editMode === "billing" && (
              <CardHeader>
                <CardTitle>Billing Details</CardTitle>
                <CardDescription>
                  Enter your information below to complete the checkout process
                </CardDescription>
              </CardHeader>
            ))}
          <CardContent className="space-y-4">
            <div>
              {initialData && editMode !== "billing" ? (
                <div className="border border-1 rounded-xl p-4 relative">
                  <div
                    className="absolute top-4 right-4 text-xs font-medium p-1 bg-slate-100 rounded-lg text-blue-600 cursor-pointer"
                    role="button"
                    onClick={() => setEditMode("billing")}
                  >
                    Update
                  </div>
                  <h4 className="text-lg font-bold mb-3">Billing Details</h4>
                  <Label>Email</Label>
                  <p>{initialData.email}</p>
                  <Label>Phone</Label>
                  <p>{initialData.billing.phone}</p>
                  <Label>Address</Label>
                  <address>
                    {initialData.billing.address.line1}
                    {initialData.billing.address.line2 &&
                      initialData.billing.address.line2}
                    <br />
                    {initialData.billing.address.city},{" "}
                    {initialData.billing.address.state}{" "}
                    {initialData.billing.address.postalCode}
                  </address>
                  a
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} type="phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="space-y-2">
                      <FormLabel>Address</FormLabel>
                      <FormField
                        control={form.control}
                        name="line1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="123 Street Ave" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="line2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Unit/PO Box" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province/State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {!initialData && <Separator className="my-6" />}
            <div>
              {initialData && editMode !== "shipping" ? (
                <div className="border border-1 rounded-xl p-4 relative">
                  <div
                    className="absolute top-4 right-4 text-xs font-medium p-1 bg-slate-100 rounded-lg text-blue-600 cursor-pointer"
                    role="button"
                    onClick={() => setEditMode("shipping")}
                  >
                    Update
                  </div>
                  <h4 className="text-lg font-bold mb-3">Shipping Details</h4>
                  {initialData.shipping.name ? (
                    <div>
                      <Label>Name</Label>
                      <p>{initialData.shipping.name}</p>
                      <Label>Phone</Label>
                      <p>{initialData.shipping.phone}</p>
                      <Label>Address</Label>
                      <address>
                        {initialData.shipping.address.line1}
                        {initialData.shipping.address.line2 &&
                          initialData.shipping.address.line2}
                        <br />
                        {initialData.shipping.address.city},{" "}
                        {initialData.shipping.address.state}{" "}
                        {initialData.shipping.address.postalCode}
                      </address>
                    </div>
                  ) : (
                    <p>No shipping details provided.</p>
                  )}
                </div>
              ) : (
                <>
                  <h4 className="text-lg font-semibold mb-2">
                    Shipping Information
                  </h4>
                  <div className="mb-4">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={handleChecked}
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Use same address for shipping
                    </label>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="shippingName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={checked} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={checked} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-2">
                        <FormLabel>Address</FormLabel>
                        <FormField
                          control={form.control}
                          name="shippingLine1"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={checked}
                                  placeholder="Address"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingLine2"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={checked}
                                  placeholder="Unit/PO Box"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="shippingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={checked} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={checked} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="shippingPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={checked} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={checked} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            {(editMode || !initialData) && (
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Spinner className="mr-2" />}
                {initialData && editMode ? "Update" : "Continue"}
              </Button>
            )}
            <Link
              href="/"
              className={`${buttonVariants({
                variant: "outline",
              })}`}
            >
              Continue Shopping
            </Link>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default CheckoutDetailsForm;
