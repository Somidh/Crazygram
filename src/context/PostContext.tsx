"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { Typography } from "@/components/typography";
import { useGetPostById } from "@/lib/react-query/queries";
import { useParams } from "next/navigation";

type GroupType = {
  [parentId: string]: Comment[];
};
type User = {
  id: string | undefined;
  name: string | undefined;
};

type INITIAL_STATE_Type = {
  post: {
    post: any;
    postId: string;
  };
  getReplies: (parentId: string) => Comment[] | undefined;
  rootComments: Comment[] | undefined;
};
type Comment = {
  id: string;
  commentText: string;
  parentId: string;
  user: User;
};

const INITIAL_STATE: INITIAL_STATE_Type = {
  post: {
    post: "",
    postId: "",
  },
  getReplies: () => undefined,
  rootComments: undefined,
};
const Context = createContext(INITIAL_STATE);

export function usePost() {
  return useContext(Context);
}

const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<{ postId: string }>();

  const {
    data: post,
    isLoading,
    error,
    isPending,
  } = useGetPostById(params.postId);
  const [comments, setComments] = useState([]);
  const parsedComment = post?.com.map((post: string) => JSON.parse(post));

  const commentByParentId = useMemo(() => {
    const group: any = {};
    parsedComment?.forEach((comment: Comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });

    return group;
  }, [post?.com]);
  console.log({ commentByParentId });

  // useEffect(() => {
  //   if (post?.com == null) return;
  //   setComments(parsedComment);
  // }, [parsedComment]);

  function getReplies(parentId: string) {
    return commentByParentId[parentId];
  }

  function getUndefinedReplies(commentByParentId: Record<string, any>) {
    // Get all keys of commentByParentId
    const keys = Object.keys(commentByParentId);

    // Filter out keys that are undefined
    const undefinedKeys = keys.filter((key) => key === "undefined");

    // If there are undefined keys, return the corresponding objects
    if (undefinedKeys.length > 0) {
      return undefinedKeys.map((key) => commentByParentId[key]);
    } else {
      return [];
    }
  }

  const undefinedReplies = getUndefinedReplies(commentByParentId);
  return (
    <Context.Provider
      value={{
        post: { post, postId: params.postId },
        getReplies,
        rootComments: undefinedReplies,
      }}
    >
      {isLoading ? (
        <Typography variant={"h1"}>Loading...</Typography>
      ) : error ? (
        <Typography variant={"h1"}>{error.message}</Typography>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export default PostProvider;
