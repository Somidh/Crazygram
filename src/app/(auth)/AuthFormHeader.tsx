import logo from "@/assets/Images/logo.svg";
import { Typography } from "@/components/typography";
import Image from "next/image";

type AuthFormHeaderProps = {
  title: string;
  subtitle: string;
};

export const AuthFormHeader = ({ title, subtitle }: AuthFormHeaderProps) => {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <Image src={logo} alt="logo" height={133} width={133} className="mb-14" />
      <div className="space-y-3 mb-8">
        <Typography variant={"h2"}>{title}</Typography>
        <Typography variant={"muted"}>{subtitle}</Typography>
      </div>
    </div>
  );
};
