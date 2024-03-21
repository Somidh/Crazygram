import * as z from "zod";

export const SignUpValidations = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(20, { message: "Name should be lesser than 20 characters" }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(20, { message: "Username should be lesser than 20 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const SignInValidations = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const PostValidation = z.object({
  caption: z.string().min(2).max(2200),
  file: z.custom<File[]>(),
  location: z.string(),
  altText: z.string().min(2).max(40),
});

export const CommentFormValidation = z.object({
  id: z.string(),
  commentText: z.string().min(10),
  parentId: z.string().optional(),
});
