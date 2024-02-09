import { useLikePost } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import { MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import like from "../assets/Images/Icons/like.svg";
import liked from "../assets/Images/Icons/liked.svg";
import save from "../assets/Images/Icons/save.svg";
import saved from "../assets/Images/Icons/saved.svg";

type PostStatsProp = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProp) => {
  const isSaved = false;

  const likeList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<Array<string>>(likeList);
  const { mutateAsync: likePost } = useLikePost();
  const handleLike = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((likeId) => likeId != userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };
  const isLiked = likes.includes(userId);

  return (
    <div>
      <div className="flex items-center justify-between w-full ">
        <div className="flex items-center gap-4">
          <Image
            src={isLiked ? liked : like}
            alt="like"
            width={100}
            height={100}
            className="w-7 h-7 cursor-pointer"
            onClick={(e) => handleLike(e)}
          />
          <MessageCircle className="cursor-pointer w-7 h-7" />
          <Send className="cursor-pointer w-7 h-7" />
        </div>
        <div>
          <Image
            src={isSaved ? saved : save}
            alt="save"
            width={100}
            height={100}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      </div>
      <p>10 likes</p>
      <p>{`${post.creator.name} ${post.caption}`}</p>
    </div>
  );
};

export default PostStats;
