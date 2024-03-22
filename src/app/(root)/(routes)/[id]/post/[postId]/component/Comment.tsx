import { MessageSquare, SquarePen, Trash } from "lucide-react";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { usePost } from "@/context/PostContext";
import {
  useDeleteComment,
  useGetCurrentUser,
  useGetPostById,
  useToggleLikeComment,
} from "@/lib/react-query/queries";
import { TComment } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import like from "../../../../../../../assets/Images/Icons/like.svg";
import liked from "../../../../../../../assets/Images/Icons/liked.svg";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const Comment = ({ comment }: { comment: TComment }) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [areChildrenHidden, setAreChildrenHidden] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { mutateAsync: toggleLikeComment } = useToggleLikeComment();
  const {
    mutateAsync: deleteComment,
    isSuccess,
    isPending: isDeleting,
  } = useDeleteComment();
  const params = useParams<{ postId: string }>();
  const { deleteLocalComment } = usePost();

  const { getReplies } = usePost();
  const { data: currentUser } = useGetCurrentUser();
  const { data: post } = useGetPostById(params.postId);
  const { data: user } = useGetCurrentUser();

  const childComments = getReplies(comment?.id) || [];

  const [likes, setLikes] = useState<Array<string>>(comment.likes);
  if (!user) {
    return <div>loading...</div>;
  }

  function handleLike(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();

    if (!post || !user) {
      return <div>loading...</div>;
    }

    let commentLikesArray = [...likes];

    if (commentLikesArray.includes(user?.$id)) {
      commentLikesArray = commentLikesArray.filter(
        (likeId) => likeId != user?.$id,
      );
    } else {
      commentLikesArray.push(user?.$id);
    }

    setLikes(commentLikesArray);
    toggleLikeComment({
      postId: post.$id,
      commentId: comment.id,
      commentLikesArray,
      userId: user.$id,
    });
  }

  async function handleDeleteComment() {
    if (!post) {
      return <div>loading...</div>;
    }
    await deleteComment({ postId: post.$id, commentId: comment.id });
    deleteLocalComment(comment.id);
  }
  const isLiked = likes?.includes(user.$id);

  return (
    <>
      <div className="border border-gray-800 w-full p-4 space-y-4 ">
        <div className="flex items-center justify-between">
          <Typography variant={"muted"}>{comment?.user?.name}</Typography>
          <Typography variant={"muted"}>
            {/* {dateFormatter.format(createdAt)} */}
            {/* {formatDate()} */}
          </Typography>
        </div>

        {isEditing ? (
          <CommentForm
            initialValue={comment.commentText}
            commentId={comment.id}
            action="Edit"
            setIsEditing={setIsEditing}
          />
        ) : (
          <div>
            <Typography>{comment.commentText}</Typography>
          </div>
        )}

        <div>
          <div className="flex items-enter">
            <div className="flex flex-col items-center">
              <Button variant={"ghost"}>
                <Image
                  src={isLiked ? liked : like}
                  alt="like"
                  width={100}
                  height={100}
                  className="w-7 h-7 cursor-pointer"
                  onClick={(e) => handleLike(e)}
                />
              </Button>
              <span>{likes.length}</span>
            </div>
            <Button variant={"ghost"}>
              <MessageSquare
                onClick={() => setIsReplying((prev) => !prev)}
                className="cursor-pointer "
              />
            </Button>
            {comment?.user?.id === currentUser?.$id && (
              <div className="">
                <Button variant={"ghost"}>
                  <SquarePen
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="cursor-pointer"
                  />
                </Button>
                {/* <Button variant={"ghost"} disabled={isDeleting}> */}
                <Button variant={"ghost"}>
                  <Trash
                    onClick={handleDeleteComment}
                    className="cursor-pointer"
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isReplying && (
        <div className="ml-3">
          <CommentForm
            autoFocus
            commentParentId={comment.id}
            action="Reply"
            setIsReplying={setIsReplying}
          />
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
