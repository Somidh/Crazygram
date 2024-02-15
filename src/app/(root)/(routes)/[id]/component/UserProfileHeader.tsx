"use client";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import Image from "next/image";
import Link from "next/link";

type UserProfileHeaderProps = {
  user: Models.Document;
};

type StatsType = {
  title: string;
  count: number;
  link: string;
}[];

export const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  const stats: StatsType = [
    {
      title: "post",
      count: user.posts.length,
      link: "#",
    },
    {
      title: "followers",
      count: user.followers.length,
      link: `${user.$id}/followers`,
    },
    {
      title: "following",
      count: user.following.length,
      link: `${user.$id}/followings`,
    },
  ];

  const { user: currentUser } = useUserContext();
  const isCurrentUser = currentUser.id === user.$id;

  return (
    <header className="flex items-start gap-6 ">
      <section>
        <Image
          src={user.imageUrl}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
      </section>
      <section className="w-full space-y-3">
        {/* NAME/USERNAME */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant={"h3"} className="capitalize">
              {user.name}
            </Typography>
            <Typography variant={"muted"} className="capitalize">
              @{user.username}
            </Typography>
          </div>
          {!isCurrentUser && (
            <div>
              <Button>Follow</Button>
            </div>
          )}
        </div>
        {/* USER STATS */}
        <div>
          <ul className="flex items-center justify-between gap-5 w-full">
            {stats.map((stat, idx) => (
              <Link href={stat.link} key={idx}>
                <li className="flex flex-col items-center gap-2">
                  <Typography>{stat.count}</Typography>
                  <Typography variant={"small"}>{stat.title}</Typography>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        {/* USER BIO */}
        <div>
          <Typography variant={"paragraph"}>
            MeMes are gonna be LEGENDARY Please DM for Credits/Removals Send a
            clip to be featured sendyourclip.com/6.memes.9
          </Typography>
        </div>
      </section>
    </header>
  );
};
