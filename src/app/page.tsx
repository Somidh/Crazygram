"use client";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import * as React from "react";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useUserContext } from "@/context/AuthContext";

export default function Home() {
  const { user } = useUserContext();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? (
        <Navbar imageUrl={user.imageUrl} />
      ) : (
        <>
          <Link href={"/signIn"}>
            <Button>Sign In</Button>
          </Link>
          <Link href={"/signUp"}>
            <Button>Sign Up</Button>
          </Link>
        </>
      )}
    </main>
  );
}
