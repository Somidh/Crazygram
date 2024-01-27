"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import sideImage from "@/assets/Images/side-img(1).svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = true;
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/");
    return;
  }
  return (
    <div className="flex">
      <section className="flex flex-1 items-center justify-center flex-col py-10">
        {children}
      </section>

      <Image
        src={sideImage}
        alt="side-img"
        width={500}
        height={100}
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </div>
  );
}
