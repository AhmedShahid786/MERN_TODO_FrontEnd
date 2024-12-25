"use client";

//? Import libraries and functional components
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { routes } from "@/constants/routes";
import Link from "next/link";

//? Import UI components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TbLoader2 } from "react-icons/tb";

//? Define the signupFormData interface
interface signupFormData {
  email: string;
  fullname: string;
  password: string;
}

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  //* Function to toggle the password visibility
  const togglePasswordVisiblity = () => setShowPassword(!showPassword);

  //* Define the signup form schema using zod
  const signupSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters long.")
      .max(20, "Password cannot exceed 20 chracters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain one uppercase letter, one lowercase letter, one number and one special character."
      ),
    fullname: z.string().max(20, "Fullname cannot exceed 20 chracters."),
  });

  //* Create a form using react-hook-form and infer the type from the schema
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
    },
  });

  //* Function to signup the user by making a post request to the server
  const signupUser = async (data: signupFormData) => {
    const newUserObj = {
      email: data.email,
      fullname: data.fullname,
      password: data.password,
    };
    setLoading(true);
    axios
      .post(routes.signup, newUserObj)
      //* If the request is successful, show a toast and redirect to login page
      .then((res) => {
        console.log(res.data);
        toast({
          title: "Signup successful",
          description: "Please login to continue.",
        });
        router.push("/login");
      })
      //* If the request fails, show a toast with the error message
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Signup failed",
          description: err?.response?.data?.msg,
        });
        form.setError("password", {
          type: "manual",
          message: err?.response?.data?.msg,
        });
      });
  };

  return (
    <main className="w-full flex flex-col items-center justify-center gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(signupUser)}
          className="space-y-8 xl:space-y-12 w-2/3 sm:w-1/2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-lg md:text-base xl:text-xl font-poppins">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g abc@gmail.com"
                    type="text"
                    {...field}
                    className="text-white font-poppins text-base md:text-sm xl:text-lg border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-lg md:text-base xl:text-xl font-poppins">
                  Fullname
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g John Doe"
                    type="text"
                    {...field}
                    className="text-white font-poppins text-base md:text-sm xl:text-lg border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-lg md:text-base xl:text-xl font-poppins">
                  Password
                </FormLabel>
                <FormControl>
                  <span className="flex">
                    <Input
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="text-white font-poppins text-base md:text-sm xl:text-lg border-primary border-r-0 rounded-r-none"
                    />
                    <Button
                      onClick={togglePasswordVisiblity}
                      className=" border-[1px] border-l-0 rounded-l-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </span>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {loading ? <TbLoader2 className="animate-spin" /> : "Signup"}
          </Button>
        </form>
      </Form>

      <div className="sm:w-1/2">
        <p className="text-white text-base xl:text-lg font-poppins">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-orbitron tracking-wider"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
