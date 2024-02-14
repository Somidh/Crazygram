"use client";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Models } from "appwrite";
import Image from "next/image";

type UserProfileHeaderProps = {
  user: Models.Document;
};

type StatsType = {
  title: string;
  count: number;
}[];

export const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  console.log({ user });

  const stats: StatsType = [
    {
      title: "post",
      count: user.posts.length + 1,
    },
    {
      title: "followers",
      count: user.followers.length + 1,
    },
    {
      title: "following",
      count: user.following.length + 1,
    },
  ];

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
        <div className="flex items-center justify-between ">
          <div>
            <Typography variant={"h3"} className="capitalize">
              {user.name}
            </Typography>
            <Typography variant={"muted"} className="capitalize">
              @{user.username}
            </Typography>
          </div>
          <div>
            <Button>Follow</Button>
          </div>
        </div>
        {/* USER STATS */}
        <div>
          <ul className="flex items-center justify-between gap-5 w-full">
            {stats.map((stat, idx) => (
              <li key={idx} className="flex flex-col items-center gap-2">
                <Typography>{stat.count}</Typography>
                <Typography variant={"small"}>{stat.title}</Typography>
              </li>
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
