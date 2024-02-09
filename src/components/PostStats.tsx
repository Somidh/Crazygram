import { Models } from "appwrite";
import { MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import like from "../assets/Images/Icons/like.svg";
import liked from "../assets/Images/Icons/liked.svg";
import save from "../assets/Images/Icons/save.svg";
import saved from "../assets/Images/Icons/saved.svg";

type PostStatsProp = {
  post: Models.Document;
};

const PostStats = ({ post }: PostStatsProp) => {
  const isLiked = false;
  const isSaved = false;

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
