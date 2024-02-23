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
import {
  useCreateComment,
  useGetCurrentUser,
  useGetPostById,
  useUpdateComment,
} from "@/lib/react-query/queries";
import { CommentFormValidation } from "@/lib/validations";
import { TComment } from "@/types";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type CommentFormProps = {
  commentParentId?: string;
  autoFocus?: boolean;
  initialValue?: string;
  action: "Comment" | "Edit" | "Reply";
  commentId?: string;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReplying?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentForm = ({
  autoFocus = false,
  initialValue = "",
  action,
  commentParentId,
  commentId,
  setIsReplying,
  setIsEditing,
}: CommentFormProps) => {
  const form = useForm<z.infer<typeof CommentFormValidation>>({
    resolver: zodResolver(CommentFormValidation),
    defaultValues: {
      id: "",
      commentText: "",
      parentId: "",
    },
  });

  const params = useParams<{ postId: string }>();
  const [comment, setComment] = useState(initialValue);
  const { data: post } = useGetPostById(params.postId);
  const { data: currentUser } = useGetCurrentUser();
  const { mutateAsync: createComment } = useCreateComment();
  const { mutateAsync: updateComment } = useUpdateComment();
  const parsedComment = post?.com.map((comment: string) => comment);
  const [comments, setComments] = useState<string[]>(parsedComment);

  function handleCommentPost(data: z.infer<typeof CommentFormValidation>) {
    if (!post || !currentUser) {
      // Render loading indicator if post or currentUser is not available
      return (
        <div className="flex-center w-full h-full">
          <Loader />
        </div>
      );
    }

    const { commentText } = data;

    let newComment: TComment | undefined;
    switch (action) {
      case "Comment":
        console.log("doing comment boi");
        newComment = {
          id: uuidv4(),
          commentText,
          user: {
            id: currentUser?.$id,
            name: currentUser?.name,
          },
        };
        break;
      case "Reply":
        console.log("doing reply boi");
        newComment = {
          id: uuidv4(),
          commentText,
          parentId: commentParentId,
          user: {
            id: currentUser?.$id,
            name: currentUser?.name,
          },
        };
        break;
      case "Edit":
        if (commentId) {
          // If commentId exists, it's an edit action
          updateComment({
            postId: post.$id,
            commentId,
            updatedText: commentText,
          });
          if (setIsEditing) setIsEditing(false);
          // .then((response) => {
          //   // Handle success
          //   console.log("Comment updated successfully:", response);
          // })
          // .catch((error) => {
          //   // Handle error
          //   console.error("Error updating comment:", error);
          //   // Display error message to the user
          //   // You can implement a notification system or any other error handling mechanism here
          // });
        }
        break;

      default:
        return;
    }

    if (setIsReplying) setIsReplying(false);

    console.log({ newComment });
    const str = JSON.stringify(newComment);

    // Update comments state
    setComments((prevComments) => [str, ...prevComments]);

    // Create comment
    createComment({ postId: post.$id, comments: [str, ...comments] });
    //   .then((response) => {
    //     // Handle success
    //     console.log("Comment created successfully:", response);
    //   })
    //   .catch((error) => {
    //     // Handle error
    //     console.error("Error creating comment:", error);
    //     // Rollback changes if necessary
    //     setComments((prevComments) =>
    //       prevComments.filter((comment) => comment !== str),
    //     );
    //     // Display error message to the user
    //     // You can implement a notification system or any other error handling mechanism here
    //   });

    // Reset form
    form.reset();
  }
  console.log({ comments });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCommentPost)}
        className="w-full  space-y-2"
      >
        <FormField
          control={form.control}
          name="commentText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add a comment</FormLabel>
              <FormControl>
                <Textarea
                  autoFocus={autoFocus}
                  defaultValue={comment}
                  placeholder={
                    action === "Edit"
                      ? "Update your comment"
                      : "what's on your though"
                  }
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">{loading ? <Loader /> : "Post"}</Button> */}
        <Button type="submit">Comment</Button>
      </form>
    </Form>
  );
};

export default CommentForm;
