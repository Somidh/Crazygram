"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type CommentsInputProps = {
  post: Models.Document;
};

type Comment = {
  id: string;
  message: string;
  parentId?: string;
};

const FormSchema = z.object({
  id: z.string(),
  comment: z.string().min(10),
  parentId: z.string().optional(),

});

const CommentsInput = ({ post }: CommentsInputProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
      comment: "",
    },
  });

  const { mutateAsync: createComment } = useCreateComment();
  const parsedComment = post.com.map((comment: string) => comment);
  const [comments, setComments] = useState<string[]>(parsedComment);

  const handleCreateComment = async (data: z.infer<typeof FormSchema>) => {
    const { comment } = data;

    let newComment: Comment = {
      id: uuidv4(),
      message: comment,
    };

    const str = JSON.stringify(newComment);

    createComment({ postId: post.$id, comments: [str, ...comments] });
    setComments((prev) => [str, ...prev]);
    form.reset();

    // try {
    //   const str = JSON.stringify(newComment);
    //   const createdComment = await createComment({
    //     postId: post.$id,
    //     comments: [str, ...comments],
    //   });

    //   // Extract createdAt from createdComment and assign it to createdDate field
    //   newComment.createdDate = createdComment?.createdAt;
    //   // Update state with the new comment
    //   setComments((prev) => [str, ...prev]);

    //   // Optionally, you can perform additional actions with the created comment here
    //   console.log("Newly created comment:", createdComment);

    //   // Invalidate the query to refetch the comments for the post
    //   queryClient.invalidateQueries({
    //     queryKey: ["GET_COMMENTS_BY_POST_ID", post.$id],
    //   });
    // } catch (error) {
    //   console.error("Error creating comment:", error);
    // }


    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateComment)}
        className="w-full  space-y-2"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add a comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are your thoughts?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
              You can <span>@mention</span> other users and organizations.
            </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Post comment</Button>
      </form>
    </Form>
  );
};

export default CommentsInput;
