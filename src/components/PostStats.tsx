import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queries";
import { formatDate } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import like from "../assets/Images/Icons/like.svg";
import liked from "../assets/Images/Icons/liked.svg";
import save from "../assets/Images/Icons/save.svg";
import saved from "../assets/Images/Icons/saved.svg";
import { Typography } from "./typography";

type PostStatsProp = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProp) => {
  const likeList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<Array<string>>(likeList);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: savePost, isPending: isSavingPost } = useSavePost();
  const { mutateAsync: deleteSavedPost, isPending: isDeletingSavedPost } =
    useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id,
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

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

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);

      return;
    }

    savePost({ postId: post.$id, userId });
    setIsSaved(true);
  };

  const isLiked = likes.includes(userId);

  return (
    <div>
      <div className="flex items-start justify-between w-full ">
        <div className="flex items-start gap-4">
          <div className="text-center">
            <Image
              src={isLiked ? liked : like}
              alt="like"
              width={100}
              height={100}
              className="w-7 h-7 cursor-pointer"
              onClick={(e) => handleLike(e)}
            />
            <p>{likes.length}</p>
          </div>
          <MessageCircle className="cursor-pointer w-7 h-7" />
          <Send className="cursor-pointer w-7 h-7" />
        </div>
        <div>
          {isSavingPost || isDeletingSavedPost ? (
            <Loader />
          ) : (
            <Image
              src={isSaved ? saved : save}
              alt="save"
              width={100}
              height={100}
              className="w-8 h-8 cursor-pointer"
              onClick={(e) => handleSavePost(e)}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Link href={`/${post.creator.$id}`} className="text-bold">
            @{post.creator.username}
          </Link>
          <Typography variant={"small"}>{` ${post.caption}`}</Typography>
        </div>
        <Typography variant={"small"}>{formatDate(post.$createdAt)}</Typography>
      </div>
    </div>
  );
};

export default PostStats;
