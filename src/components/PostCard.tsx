import { useUserContext } from "@/context/AuthContext";
import { useFollowUser } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PostStats from "./PostStats";
import { Typography } from "./typography";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

type PostCardProp = {
  post: Models.Document;
};

export const PostCard = ({ post }: PostCardProp) => {
  const { user } = useUserContext();
  const { mutateAsync: followUser } = useFollowUser();

  const [following, setFollowing] = useState<Array<string>>(user.following);
  const [followers, setFollowers] = useState<Array<string>>(
    post.creator.followers,
  );
  const { toast } = useToast();

  if (!post.creator) return;

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();

    let followingArray = [...following];
    let followersArray = [...followers];

    if (followingArray.includes(post.creator.$id)) {
      followingArray = followingArray.filter(
        (followingId) => followingId !== post.creator.$id,
      );
      followersArray = followersArray.filter(
        (followersId) => followersId !== user.id,
      );
    } else {
      followingArray.push(post?.creator?.$id);
      followersArray.push(user.id);
      toast({ title: "Followed success" });
    }

    setFollowing(followingArray);
    setFollowers(followersArray);
    followUser({
      userId: user.id,
      followerId: post.creator.$id,
      followingArray,
      followersArray,
    });
  };
  const isFollowing = following?.includes(post.creator.$id);

  return (
    <div className="w-full border border-gray-800 p-2">
      {/* POST HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image
            src={post.creator.imageUrl}
            alt="avatar"
            width={100}
            height={100}
            className="w-8 h-8 rounded-full object-cover "
          />
          <Link href={`/${post.creator.$id}`}>
            <Typography>{post.creator.name}</Typography>
          </Link>
        </div>
        {user.id !== post.creator.$id && (
          <Button variant={"default"} onClick={(e) => handleFollow(e)}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>

      {/* POST IMAGE */}
      <div className="w-full h-96 mb-2 ">
        <Image
          src={post.imageUrl}
          alt="post-image"
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-md "
        />
      </div>

      {/* POST STATS */}

      <PostStats post={post} userId={user.id} />
    </div>
  );
};
