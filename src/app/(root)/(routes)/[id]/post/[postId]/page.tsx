"use client";

import { PostCard } from "@/components/PostCard";
import { useGetPostById } from "@/lib/react-query/queries";
import { Loader } from "lucide-react";

const PostDetailsPage = ({
  params,
}: {
  params: { id: string; postId: string };
}) => {
  const { data: post } = useGetPostById(params.postId);

  if (!post)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div>
      <PostCard post={post} />
    </div>
  );
};

export default PostDetailsPage;
