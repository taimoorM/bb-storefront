"use client";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useStore } from "@/contexts/store";
import { useRouter } from "next/navigation";
import Spinner from "../Loaders/Spinner";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { deleteCookie, login, setCookie } from "@/app/actions";
import { Customer, Session } from "@/types/types";

const invalid_type_error = "Invalid type provided for this field";
const required_error = "This field cannot be blank";

const loginFormSchema = z.object({
  email: z.string({ invalid_type_error, required_error }).email(),
  password: z.string({ invalid_type_error, required_error }).min(8).max(50),
});

export default function LoginForm({ sessionToken }: { sessionToken: string }) {
  const [error, setError] = useState<string | null>(null);
  const { data: authSession, update } = useSession();
  const { setCustomer, headers, setSession } = useStore();
  const router = useRouter();
  console.log(authSession?.user?.id);
  console.log(sessionToken);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
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

        const { session, customer } = await response.json();

        setSession(session);
        setCustomer(customer);

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
