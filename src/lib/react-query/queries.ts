import { TNewPost, TNewUser } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  followUser,
  getAllPosts,
  likePost,
  signInAccount,
  signOutAccount,
} from "../appwrite/api";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: TNewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: TNewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GET_RECENT_POSTS"],
      });
    },
  });
};

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["GET_ALL_POSTS"],
    queryFn: getAllPosts,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["GET_POST_BY_ID", data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ["GET_RECENT_POSTS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["GET_POSTS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["GET_CURRENT_USER"],
      });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      followingArray,
    }: {
      userId: string;
      followingArray: string[];
    }) => followUser(userId, followingArray),
    // onSuccess: (data) => {
    //   queryClient.invalidateQueries({
    //     queryKey:
    //   })
    // }
  });
};
