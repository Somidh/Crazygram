import { Bookmark, Clapperboard, Home, PlusSquare, Search } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { Typography } from "./typography";

const sideBarLinks = [
  {
    Icon: <Home />,
    url: "/",
    text: "Home",
  },
  {
    Icon: <Search />,
    url: "/explore",
    text: "Search",
  },
  {
    Icon: <PlusSquare />,
    url: "/create",
    text: "Create",
  },
  {
    Icon: <Clapperboard />,
    url: "/reels",
    text: "Reels",
  },
  {
    Icon: <Bookmark />,
    url: "/saved",
    text: "Saved",
  },
];

const Sidebar = () => {
  return (
    <div className="hidden md:block fixed left-0 top-0 pl-4 pr-48 py-8 h-screen bg-black border-r border-gray-800">
      <Logo />
      <ul className="flex flex-col items-start gap-12 mt-16 ">
        {sideBarLinks.map((link, idx) => (
          <Link href={link.url} key={idx} className="flex items-center gap-4">
            <li className="pointer-cursor">{link.Icon}</li>
            <Typography variant={"smallTitle"}>{link.text}</Typography>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
