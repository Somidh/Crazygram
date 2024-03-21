"use client";

import GridPostList from "@/components/GridPostList";
import { Typography } from "@/components/typography";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queries";
import { Loader, Search } from "lucide-react";
import { useState } from "react";

const Explore = () => {
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState<string>("");

  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearching } =
    useSearchPosts(debouncedValue);

  const showSearchResults = searchValue !== "";

  if (!posts) {
    return (
      <div className="flex items-center justify-center ">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <Typography variant={"h2"} className="mb-5">
          Explore Posts
        </Typography>
        <div className="flex items-center gap-1 px-4 py-2 w-full rounded-lg bg-gray-900">
          <Search />
          <Input
            type="text"
            placeholder="Search"
            value={searchValue}
            className="border-none focus-visible:ring-0 bg-transparent focus-visible:ring-offset-0 ring-offset-0"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="">
        {posts?.pages.map((item, idx) => (
          <GridPostList key={idx} posts={item?.documents} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
