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

import { useForm } from "react-hook-form";
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
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/contexts/store";
import { useRouter } from "next/navigation";
import Spinner from "../Loaders/Spinner";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Error from "next/error";

const invalid_type_error = "Invalid type provided for this field";
const required_error = "This field cannot be blank";

const loginFormSchema = z.object({
  email: z.string({ invalid_type_error, required_error }).email(),
  password: z.string({ invalid_type_error, required_error }).min(8).max(50),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
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
              name="lastName"
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
