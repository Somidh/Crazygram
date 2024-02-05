"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Typography } from "@/components/typography";
import Link from "next/link";
import { SignInValidations } from "@/lib/validations";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";

const SignInForm = () => {
  const { mutateAsync: signInAccount, isPending: isLoggingIn } =
    useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInValidations>>({
    resolver: zodResolver(SignInValidations),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (user: z.infer<typeof SignInValidations>) => {
    const session = await signInAccount({
      email: user.email,
      password: user.password,
    });

    if (!session) {
      console.log("hello");
      return toast({ title: "Log in failed. Please try again." });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      router.push("/");
    } else {
      return toast({ title: "Log in failed. Please try again." });
    }
  };
  return (
    <Form {...form}>
      <div className="flex items-center justify-center">
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="space-y-5 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" type="email" />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isLoggingIn ? <Loader /> : "Sign in"}
          </Button>
          <Typography variant={"muted"} className="text-center">
            Don't have an account?{" "}
            <Link className="text-blue-400" href={"/signUp"}>
              Sign up
            </Link>
          </Typography>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
