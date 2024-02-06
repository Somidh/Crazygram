import Link from "next/link";
import { Typography } from "./typography";

const Logo = () => {
  return (
    <Link href={"/"}>
      {/* <Image
        src={logo}
        alt="logo"
        height={133}
        width={133}
        className="cursor-pointer"
      /> */}
      <Typography variant={"h4"}>CrazyGram</Typography>
    </Link>
  );
};

export default Logo;
