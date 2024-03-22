"use client";

import { Typography } from "@/components/typography";
import { useGetPostById } from "@/lib/react-query/queries";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { CreatePostForm } from "../../create/components/createPostForm";

const EditPost = () => {
  const params = useParams<{ id: string }>();
  const { data: post, isPending } = useGetPostById(params.id || "");

  if (isPending) return <Loader className="mx-auto " />;

  return (
    <div className="max-w-5xl mx-auto">
      <Typography variant={"h3"} className="mb-10">
        Edit Post
      </Typography>
      <CreatePostForm action="Update" post={post} />
      {/* <div className="flex items-center justify-center">
          <PostOptions />
        </div> */}
    </div>
  );
};

export default EditPost;
