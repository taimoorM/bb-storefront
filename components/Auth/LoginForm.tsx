"use client";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useStore } from "@/contexts/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Spinner from "../Loaders/Spinner";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

const invalid_type_error = "Invalid type provided for this field";
const required_error = "This field cannot be blank";

const loginFormSchema = z.object({
  email: z.string({ invalid_type_error, required_error }).email(),
  password: z.string({ invalid_type_error, required_error }).min(8).max(50),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { data: authSession, update } = useSession();
  const { setCustomer, setCart, setSession } = useStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "tmdd89@gmail.com",
      password: "testtest",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      }).then(async (res) => {
        console.log(res);

        const response = await fetch("/api/login");
        if (!response.ok) {
          throw new Error("Could not update checkout session");
        }

        const { session, customer, cart } = await response.json();
        console.log("session", session);
        console.log("customer", customer);
        console.log("cart", cart);

        setSession(session);
        setCustomer(customer);
        setCart(cart);

        router.push("/");
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[500px] mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        form.formState.isSubmitting ||
                        (form.formState.isSubmitSuccessful &&
                          Object.entries(form.formState.errors).length > 0)
                      }
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        form.formState.isSubmitting ||
                        (form.formState.isSubmitSuccessful &&
                          Object.entries(form.formState.errors).length > 0)
                      }
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button>
              {form.formState.isSubmitting ||
                (form.formState.isSubmitSuccessful &&
                  Object.entries(form.formState.errors).length > 0 && (
                    <Spinner className="mr-2" />
                  ))}
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
