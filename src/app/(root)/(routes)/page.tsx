"use client";

import { PostCard } from "@/components/PostCard";
import { useGetAllPosts } from "@/lib/react-query/queries";
import { Models } from "appwrite";

const HomePage = () => {
  const { data: posts } = useGetAllPosts();
  return (
    <div>
      {posts?.documents.map((post: Models.Document) => {
        return (
          <div key={post.$id} className="mb-10  border border-gray-800 p-2">
            <PostCard post={post} />
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
