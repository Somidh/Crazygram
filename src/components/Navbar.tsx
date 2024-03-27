"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";

type NavbarProp = {
  imageUrl: string;
};

const Navbar = () => {
  const { setTheme } = useTheme();
  const {
    mutateAsync: signOut,
    isPending: isSigningOut,
    isSuccess,
  } = useSignOutAccount();
  const { user, isAuthenticated } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) router.push("/signIn");
  }, [isSuccess]);

  return (
    <nav className="flex items-center justify-between w-full px-4 py-8">
      <Logo />
      <div className="flex items-center gap-5">
        {/* GITHUB LINK */}

        <Link href={"https://github.com/Somidh/Crazygram"} target="_blank">
          <Button variant={"outline"}>
            <GitHubLogoIcon />
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={user.imageUrl} alt="logo" />
              {/* <AvatarFallback>CN</AvatarFallback> */}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={`/${user.id}`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={() => signOut()}>
              {/* {isSigningOut ? <Loader /> : "Log out"} */}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
