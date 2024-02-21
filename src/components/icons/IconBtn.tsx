import { LucideIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

type IconBtnProps = {
  Icon: LucideIcon;
  isActive: boolean;
  color: string;
  children: React.ReactNode;
};

export const IconBtn = ({
  Icon,
  isActive,
  color,
  children,
  ...props
}: IconBtnProps) => {
  return <Button></Button>;
};
