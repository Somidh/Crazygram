"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FileUploader from "@/components/File";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useCreatePost,
  useDeletePost,
  useUpdatePost,
} from "@/lib/react-query/queries";
import { PostValidation } from "@/lib/validations";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
type CreatePostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

export const CreatePostForm = ({ post, action }: CreatePostFormProps) => {
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      altText: post ? post?.altText : "",
    },
  });

  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdatingPost } =
    useUpdatePost();
  const { mutateAsync: deletePost, isPending: isDeletingPost } =
    useDeletePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const router = useRouter();

  const handleCreatePost = async (values: z.infer<typeof PostValidation>) => {
    // UPDATE POST

    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post?.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });

      if (!updatedPost) {
        toast({ title: "Updating post failed" });
      }

      return router.push(`/${user.id}/post/${post?.$id}`);
    }

    // CREATE POST
    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      router.replace("/");
      return toast({ title: "Something went wrong, Please try again" });
    }

    form.reset();
    router.replace("/");
    return toast({ title: "Post created successfully" });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreatePost)}
        className="space-y-8 w-full mb-20"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Photos/Videos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  url={post?.imageUrl}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="altText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photos/Videos Alt Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUpdatingPost || isCreatingPost}>
          {isUpdatingPost || isCreatingPost ? <Loader /> : action}
        </Button>
      </form>
    </Form>
  );
};
