import { TNewPost, TNewUser } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  getAllPosts,
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
