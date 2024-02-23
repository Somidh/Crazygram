"use client";

import { PostCard } from "@/components/PostCard";
import { usePost } from "@/context/PostContext";
import {
  useCreateComment,
  useGetCurrentUser,
  useGetPostById,
} from "@/lib/react-query/queries";
import { CommentFormValidation } from "@/lib/validations";
import { Loader } from "lucide-react";
import { z } from "zod";
import CommentList from "./component/CommentList";

import { TComment } from "@/types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CommentForm from "./component/CommentForm";
const PostDetailsPage = ({
  params,
}: {
  params: { id: string; postId: string };
}) => {
  const { data: post } = useGetPostById(params.postId);
  const { data: currentUser } = useGetCurrentUser();
  const { rootComments } = usePost();
  const { mutateAsync: createComment } = useCreateComment();
  const parsedComment = post?.com.map((comment: string) => comment);
  const [comments, setComments] = useState<string[]>(parsedComment);

  const flattenedComments = rootComments?.flatMap((innerArray) => innerArray);

  if (!post || !currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const handleCreateComment = async (
    data: z.infer<typeof CommentFormValidation>,
  ) => {
    const { commentText } = data;

    const newComment: TComment = {
      id: uuidv4(),
      commentText,
      user: {
        id: currentUser?.$id,
        name: currentUser?.name,
      },
    };

    console.log({ newComment });

    const str = JSON.stringify(newComment);

    await createComment({ postId: post.$id, comments: [str, ...comments] });
    setComments((prev) => [str, ...prev]);
  };
  return (
    <div>
      <PostCard post={post} />
      <div className="mt-10">
        {/* <CommentsInput post={post} /> */}
        <CommentForm action="Comment" />
      </div>
      <div className="mt-5">
        <CommentList post={post} comments={flattenedComments} />
      </div>
    </div>
  );
};

export default PostDetailsPage;
