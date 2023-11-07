"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const checkoutDetailFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(2, {
    message: "Please enter a valid address.",
  }),
  city: z.string().min(2, {
    message: "Please enter a valid city.",
  }),
  state: z.string().min(2, {
    message: "Please enter a valid state.",
  }),
  postalCode: z.string().min(5, {
    message: "Please enter a valid postal code.",
  }),
});

function CheckoutDetailsForm() {
  const form = useForm<z.infer<typeof checkoutDetailFormSchema>>({
    resolver: zodResolver(checkoutDetailFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof checkoutDetailFormSchema>) {
    console.log(values);
  }
  return <div>CheckoutDetailsForm</div>;
}

export default CheckoutDetailsForm;
