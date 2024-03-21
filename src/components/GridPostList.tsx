import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import Image from "next/image";
import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

type GridPostListProps = {
  posts: Models.Document[] | undefined;
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  console.log({ posts });
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry gutter="5px">
        {posts?.map((post, idx) => (
          <Link key={idx} href={`${post.creator.$id}/post/${post.$id}`}>
            <Image
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
              width={500}
              height={500}
            />
          </Link>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default GridPostList;
