import { Heart, MessageSquare, SquarePen, Trash } from "lucide-react";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { usePost } from "@/context/PostContext";
import { useState } from "react";
import CommentList from "./CommentList";
import ReplyForm from "./ReplyForm";

type CommentProps = {
  id: string;
  message: string;
  parentId: string;
  //   post: Models.Document;
};

const Comment = ({ comment }: { comment: CommentProps }) => {
  const [isReplying, setIsReplying] = useState(false);

  const { getReplies } = usePost();

  const childComments = getReplies(comment?.id) || [];
  const areChildrenHidden = false;

  console.log({ childComments });


  return (
    <>
      <div className="border border-gray-800 w-full p-4 space-y-4 ">
        <div className="flex items-center justify-between">
          <Typography variant={"muted"}>luffy</Typography>
          <Typography variant={"muted"}>
            {/* {dateFormatter.format(createdAt)} */}
            {/* {formatDate(createdAt)} */}
          </Typography>
        </div>
        <div>
          <Typography>{comment.message}</Typography>
        </div>
        <div>
          <ul className="flex items-enter gap-4">
            <li>
              <Heart />
            </li>
            <li>
              <MessageSquare
                onClick={() => setIsReplying((prev) => !prev)}
                className="cursor-pointer "
              />
            </li>
            <li>
              <SquarePen />
            </li>
            <li>
              <Trash />
            </li>
          </ul>
        </div>
      </div>
      {isReplying && (
        <div className="ml-3">
          <ReplyForm id={comment.id} />
        </div>
      )}

      {childComments?.length > 0 && (
        <>
          <div className={` flex ${areChildrenHidden ? "hidden" : ""}`}>
            <Button className="collapse-line" />
            <div className="pl-2 flex-grow">
              <CommentList comments={childComments} />
            </div>
          </div>
        </>
      )}

    </>
  );
};

export default Comment;
