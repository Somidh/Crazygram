"use client";

import sideImage from "@/assets/Images/side-img(1).svg";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUserContext();
  const router = useRouter();

  // if (!isAuthenticated) {
  //   router.push("/signIn");
  //   return;
  // }

  return (
    <>
      {isAuthenticated ? (
        router.push("/")
      ) : (
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
      )}
    </>
  );
}
