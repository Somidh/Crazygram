"use client";

import { PostCard } from "@/components/PostCard";
import { usePost } from "@/context/PostContext";
import { useGetCurrentUser, useGetPostById } from "@/lib/react-query/queries";
import { Loader } from "lucide-react";
import CommentList from "./component/CommentList";

import CommentForm from "./component/CommentForm";
const PostDetailsPage = ({
  params,
}: {
  params: { id: string; postId: string };
}) => {
  const { data: post } = useGetPostById(params.postId);
  const { data: currentUser } = useGetCurrentUser();
  const { rootComments } = usePost();
  const flattenedComments = rootComments?.flatMap((innerArray) => innerArray);

  if (!post || !currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-md mx-auto">
      <PostCard post={post} />
      <div className="max-w-lg mx-auto">
        <div className="mt-10">
          <CommentForm action="Comment" />
        </div>
        <div className="mt-5">
          <CommentList
            post={post}
            // comments={rootComments?.flatMap((comment) => comment)}
            comments={flattenedComments}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
