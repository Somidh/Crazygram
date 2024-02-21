"use client";

import { PostCard } from "@/components/PostCard";
import { usePost } from "@/context/PostContext";
import { useGetPostById } from "@/lib/react-query/queries";
import { Loader } from "lucide-react";
import CommentList from "./component/CommentList";
import CommentsInput from "./component/CommentsInput";

const PostDetailsPage = ({
  params,
}: {
  params: { id: string; postId: string };
}) => {
  const { data: post } = useGetPostById(params.postId);

  console.log({ post });

  const { rootComments } = usePost();

  const flattenedComments = rootComments?.flatMap((innerArray) => innerArray);
  console.log({ flattenedComments });


  if (!post)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  return (
    <div>
      <PostCard post={post} />
      <div className="mt-10">
        <CommentsInput post={post} />
      </div>
      <div className="mt-5">
        <CommentList post={post} comments={flattenedComments} />
      </div>
    </div>
  );
};

export default PostDetailsPage;
