import { useGetUserById } from "@/lib/react-query/queries";
import { Loader } from "lucide-react";
import Image from "next/image";

type PostsProps = {
  id: string;
};

const Posts = ({ id }: PostsProps) => {
  const { data: user } = useGetUserById(id);

  if (!id) return;
  if (!user) return;
  if (!user)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="w-full grid grid-cols-3 gap-1 max-w-5xl">
      {user?.posts.map((post: any) => {
        return (
          <div key={post?.$id}>
            <Image
              src={post?.imageUrl}
              alt="image"
              width={500}
              height={500}
              className="w-full aspect-square object-cover"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
