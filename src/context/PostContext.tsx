"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { Typography } from "@/components/typography";
import { useGetPostById } from "@/lib/react-query/queries";
import { TComment } from "@/types";
import { useParams } from "next/navigation";

type INITIAL_STATE_TYPE = {
  post: {
    post: any;
    postId: string;
  };
  getReplies: (parentId: string) => TComment[] | undefined;
  rootComments: TComment[] | undefined;
  createLocalComment: (comment: TComment) => void;
  updateLocalComment: (commentId: string, commentText: string) => void;
  deleteLocalComment: (commentId: string) => void;
};
const INITIAL_STATE: INITIAL_STATE_TYPE = {
  post: {
    post: "",
    postId: "",
  },
  getReplies: () => undefined,
  rootComments: undefined,
  createLocalComment: () => {},
  updateLocalComment: () => {},
  deleteLocalComment: () => {},
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
  const [comments, setComments] = useState<TComment[]>([]);
  const parsedComment = post?.com.map((post: string) => JSON.parse(post));

  // const commentByParentId = useMemo(() => {
  //   const group: any = {};
  //   comments?.forEach((comment: TComment) => {
  //     group[comment.parentId] ||= [];
  //     group[comment.parentId].push(comment);
  //   });

  //   return group;
  // }, [comments]);
  const commentByParentId = useMemo(() => {
    const group: Record<string, TComment[]> = {};
    comments?.forEach((comment: TComment) => {
      const parentId = comment.parentId ?? "undefined"; // Nullish coalescing operator to handle undefined
      group[parentId] ||= [];
      group[parentId].push(comment);
    });

    return group;
  }, [comments]);

  useEffect(() => {
    if (post?.com == null) return;
    setComments(parsedComment);
  }, [post?.com]);

  function getReplies(parentId: string): TComment[] | undefined {
    const replies = commentByParentId[parentId];
    // if (replies) {
    // Assuming TComment can be directly cast to Comment
    return replies as TComment[];
    // }
    // return undefined;
  }
  function createLocalComment(comment: TComment) {
    setComments((prevComments: TComment[]) => {
      return [comment, ...prevComments];
    });
  }

  function updateLocalComment(commentId: string, newText: string) {
    setComments((prevComments: TComment[]) => {
      return prevComments.map((comment: TComment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            commentText: newText,
          };
        } else {
          // For other comments, return them unchanged
          return comment;
        }
      });
    });
  }

  function deleteLocalComment(commentId: string) {
    setComments((prevComments: TComment[]) => {
      return prevComments.filter(
        (comment: TComment) => comment.id !== commentId,
      );
    });
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

  function toggleLocalCommentLike(id: string, addLike: boolean) {}

  const undefinedReplies = getUndefinedReplies(commentByParentId);
  return (
    <Context.Provider
      value={{
        post: { post, postId: params.postId },
        getReplies,
        rootComments: undefinedReplies,
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
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
