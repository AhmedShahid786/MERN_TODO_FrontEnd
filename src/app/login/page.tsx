"use client";

//? Import libraries and dependencies
import axios from "axios";
import Cookies from "js-cookie";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/context/AuthContext";
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

//? Define the loginFormData interface
interface loginFormData {
  email: string;
  password: string;
}

export default function page() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext)!;
  const { toast } = useToast();
  const router = useRouter();

  //* Define the login form schema using zod
  const loginSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters long.")
      .max(20, "Password cannot exceed 20 chracters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain one uppercase letter, one lowercase letter, one number and one special character."
      ),
  });

  //* Create a form using react-hook-form and infer the type from the schema
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //* Function to toggle the password
  const togglePasswordVisiblity = () => setShowPassword(!showPassword);

  //* Function to login the user by making a post request to the server
  const loginUser = async (data: loginFormData) => {
    const newUserObj = {
      email: data.email,
      password: data.password,
    };
    setLoading(true);
    axios
      .post(routes.login, newUserObj)
      //* If the request is successful, set the token in the cookies and user in the context and redirect to home page
      .then((res) => {
        Cookies.set("token", res?.data?.data?.token);
        setUser({
          user: { ...res?.data?.data?.user },
          token: res?.data?.data?.token,
        });
        toast({
          title: "Login successful",
          description: "Redirecting to home page",
        });
        router.push("/");
      })
      //* If the request fails, show a toast with the error message
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Login failed",
          description: err?.response?.data?.message || "Something went wrong",
        });
      });
  };

  return (
    <main className="w-full flex flex-col items-center justify-center gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(loginUser)}
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
            {loading ? <TbLoader2 className="animate-spin" /> : "Login"}
          </Button>
        </form>
      </Form>

      <div className="sm:w-1/2">
        <p className="text-white text-base xl:text-lg font-poppins">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-orbitron tracking-wider"
          >
            Signup
          </Link>
        </p>
      </div>
    </main>
  );
}
