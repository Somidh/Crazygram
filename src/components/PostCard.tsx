import { Models } from "appwrite";
import Image from "next/image";
import PostStats from "./PostStats";
import { Typography } from "./typography";
import { Button } from "./ui/button";

type PostCardProp = {
  post: Models.Document;
};

export const PostCard = ({ post }: PostCardProp) => {
  console.log(post.creator);
  console.log({ post });

  if (!post.creator) return;
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
          <div>
            <Typography>{post.creator.name}</Typography>
          </div>
        </div>
        <Button variant={"secondary"}>Follow</Button>
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

      <PostStats post={post} />
    </div>
  );
};
