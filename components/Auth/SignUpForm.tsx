"use client";

import * as z from "zod";

const invalid_type_error = "Invalid type provided for this field";
const required_error = "This field cannot be blank";

const signUpFormSchema = z.object({
  firstName: z.string({ invalid_type_error, required_error }).min(2),
  lastName: z.string({ invalid_type_error, required_error }).min(1).max(50),
  email: z.string({ invalid_type_error, required_error }).email(),
  password: z.string({ invalid_type_error, required_error }).min(8).max(50),
  phone: z.string().min(10).max(10).optional(),
  address: z
    .object({
      line1: z.string().min(2).optional(),
      line2: z.string().min(2).optional(),
      city: z.string().min(2).optional(),
      state: z.string().min(2).max(50).optional(),
      postalCode: z.string().min(5).max(50).optional(),
    })
    .optional(),
});

export default function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
      },
    },
  });

  return <Form></Form>;
}
