"use client";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useFollowUser } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  const { mutateAsync: followUser } = useFollowUser();

  const [following, setFollowing] = useState<Array<string>>(user.following);
  const [followers, setFollowers] = useState<Array<string>>(user.followers);

  const { toast } = useToast();

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();

    let followingArray = [...following];
    let followersArray = [...followers];

    if (followingArray.includes(user.$id)) {
      followingArray = followingArray.filter(
        (followingId) => followingId !== user.$id,
      );
      followersArray = followersArray.filter(
        (followersId) => followersId !== user.id,
      );
    } else {
      followingArray.push(user.$id);
      followersArray.push(user.$id);
      toast({ title: "Followed success" });
    }

    setFollowing(followingArray);
    setFollowers(followersArray);
    followUser({
      userId: user.$id,
      followerId: user.$id,
      followingArray,
      followersArray,
    });
  };

  const isFollowing = following?.includes(user.$id);

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
            <Button onClick={(e) => handleFollow(e)}>
              {" "}
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
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
