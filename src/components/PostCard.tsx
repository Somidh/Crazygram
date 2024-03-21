import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserContext } from "@/context/AuthContext";
import { useFollowUser } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ellipsis from "../assets/Images/Icons/ellipsis-vertical.svg";
import PostStats from "./PostStats";
import { Typography } from "./typography";
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
    <div className="w-full  ">
      {/* POST HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link href={""}>
            <Image
              src={post.creator.imageUrl}
              alt="avatar"
              width={100}
              height={100}
              className="w-8 h-8 rounded-full object-cover "
            />
          </Link>

          <Link href={`/${post.creator.$id}`}>
            <Typography>{post.creator.name}</Typography>
          </Link>
        </div>
        {/* ------------------TODO------------------- */}
        {/* REMOVE FOLLOW BUTTON FROM HERE */}
        {/* {user.id !== post.creator.$id && (
          <Button variant={"default"} onClick={(e) => handleFollow(e)}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )} */}
        <Popover>
          <PopoverTrigger>
            <Image src={ellipsis} width={20} height={20} alt="options" />
          </PopoverTrigger>
          <PopoverContent>
            {user.id === post.creator.$id && (
              <Link href={`/update-post/${post.$id}`}>
                <div className="flex items-center gap-2">
                  <SquarePen />
                  <Typography variant={"muted"}>Edit</Typography>
                </div>
              </Link>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* POST IMAGE */}
      <Link href={`${user.id}/post/${post.$id}`}>
        <div className="w-full h-[32rem] mb-2 ">
          <Image
            src={post.imageUrl}
            alt="post-image"
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-md "
          />
        </div>
      </Link>

      {/* POST STATS */}

      <PostStats post={post} userId={user.id} />
    </div>
  );
};
