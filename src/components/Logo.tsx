import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/Images/logo.svg";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image
        src={logo}
        alt="logo"
        height={133}
        width={133}
        className="cursor-pointer"
      />
    </Link>
  );
};

export default Logo;
