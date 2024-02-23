import { Heart, MessageSquare, SquarePen, Trash } from "lucide-react";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { usePost } from "@/context/PostContext";
import { useGetCurrentUser } from "@/lib/react-query/queries";
import { TComment } from "@/types";
import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const Comment = ({ comment }: { comment: TComment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { getReplies } = usePost();
  const { data: currentUser } = useGetCurrentUser();

  const childComments = getReplies(comment?.id) || [];
  console.log({ childComments });
  console.log({ isReplying });

  return (
    <>
      <div className="border border-gray-800 w-full p-4 space-y-4 ">
        <div className="flex items-center justify-between">
          <Typography variant={"muted"}>{comment?.user?.name}</Typography>
          <Typography variant={"muted"}>
            {/* {dateFormatter.format(createdAt)} */}
            {/* {formatDate(createdAt)} */}
          </Typography>
        </div>

        {isEditing ? (
          <CommentForm
            initialValue={comment.commentText}
            commentId={comment.id}
            action="Edit"
            setIsReplying={setIsReplying}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div>
            <Typography>{comment.commentText}</Typography>
          </div>
        )}

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
            {comment?.user?.id === currentUser?.$id && (
              <>
                <li>
                  <SquarePen
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="cursor-pointer"
                  />
                </li>
                <li>
                  <Trash />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {isReplying && (
        <div className="ml-3">
          <CommentForm autoFocus commentParentId={comment.id} action="Reply" />
        </div>
      )}

      {childComments?.length > 0 && (
        <>
          <div className={` flex ${areChildrenHidden ? "hidden" : ""}`}>
            <button
              className="collapse-line"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="pl-2 flex-grow">
              <CommentList comments={childComments} />
            </div>
          </div>
          <Button
            className={` mt-1 ${!areChildrenHidden ? "hidden" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </Button>
        </>
      )}
    </>
  );
};

export default Comment;
