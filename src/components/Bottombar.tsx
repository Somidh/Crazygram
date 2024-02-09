import { Bookmark, Clapperboard, Home, PlusSquare, Search } from "lucide-react";
import Link from "next/link";

const bottomBarLinks = [
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

const Bottombar = () => {
  return (
    <div className="md:hidden w-full  fixed bottom-0 flex items-center justify-center px-4 py-4 bg-black border-t border-gray-800">
      <ul className="flex items-center gap-12 ">
        {bottomBarLinks.map((link, idx) => (
          <Link href={link.url} key={idx} aria-label={link.text}>
            <li className="pointer-cursor">{link.Icon}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Bottombar;
