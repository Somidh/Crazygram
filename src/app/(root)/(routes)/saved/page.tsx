"use client";

import { useGetCurrentUser } from "@/lib/react-query/queries";
import { Models } from "appwrite";

import GridPostList from "@/components/GridPostList";
import { Typography } from "@/components/typography";
import { Loader } from "lucide-react";
import Image from "next/image";
import save from "../../../../assets/Images/Icons/save.svg";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-2 w-full max-w-5xl items-center mb-5">
        <Image src={save} alt="edit" width={36} height={36} />
        <Typography variant={"h2"}>Saved Posts</Typography>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <div>
          {savePosts.length === 0 ? (
            <Typography variant={"paragraph"}>No available posts</Typography>
          ) : (
            <GridPostList posts={savePosts} />
          )}
        </div>
      )}
    </div>
  );
};

export default Saved;
