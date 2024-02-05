"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { Typography } from "@/components/typography";
import Link from "next/link";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { SignUpValidations } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpValidations>>({
    resolver: zodResolver(SignUpValidations),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (user: z.infer<typeof SignUpValidations>) => {
    try {
      const newUser = await createUserAccount(user);
      // console.log({ newUser });

      if (!newUser) {
        return toast({ title: "Sign up failed. hola." });
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        return toast({ title: "Sign in failed. Please try again." });
      }

      const isLoggedIn = await checkAuthUser();
      console.log(isLoggedIn);

      if (isLoggedIn) {
        form.reset();
        router.push("/");
      } else {
        return toast({ title: "Sign up failed. Please try again." });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <div className="flex items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" type="text" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" type="text" />
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
            {isCreatingAccount ? <Loader /> : "Sign up"}
          </Button>
          <Typography variant={"muted"} className="text-center">
            Already have an account?{" "}
            <Link className="text-blue-400" href={"/signIn"}>
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;
