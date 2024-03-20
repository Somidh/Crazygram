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
import { usePost } from "@/context/PostContext";
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
  const { mutateAsync: createComment, isPending: isCreatingComment } =
    useCreateComment();
  const { mutateAsync: updateComment } = useUpdateComment();
  const parsedComment = post?.com.map((comment: string) => comment);
  const [comments, setComments] = useState<string[]>(parsedComment);
  const { createLocalComment, updateLocalComment } = usePost();

  async function handleCommentPost(
    data: z.infer<typeof CommentFormValidation>,
  ) {
    if (!post || !currentUser) {
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
        newComment = {
          id: uuidv4(),
          commentText,
          user: {
            id: currentUser?.$id,
            name: currentUser?.name,
          },
          likes: [],
        };
        break;
      case "Reply":
        if (setIsReplying) setIsReplying(false);
        newComment = {
          id: uuidv4(),
          commentText,
          parentId: commentParentId,
          user: {
            id: currentUser?.$id,
            name: currentUser?.name,
          },
          likes: [],
        };
        break;
      case "Edit":
        if (commentId) {
          updateComment({
            postId: post.$id,
            commentId,
            updatedText: commentText,
          });
          updateLocalComment(commentId, commentText);
        }
        break;
    }

    if (setIsEditing) setIsEditing(false);
    if (setIsReplying) setIsReplying(false);

    const str = JSON.stringify(newComment);

    // Create comment
    await createComment({ postId: post.$id, comments: [str, ...comments] });
    if (newComment) {
      createLocalComment({
        commentText: newComment?.commentText,
        id: newComment?.id,
        likes: newComment.likes,
        parentId: newComment.parentId,
        user: newComment.user,
      });
    }
    // Update comments state
    setComments((prevComments) => [str, ...prevComments]);
    form.reset();
  }

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
              <FormLabel>
                {action === "Edit" ? "Update your comment" : "Add you comment"}
              </FormLabel>
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
        <Button type="submit" disabled={isCreatingComment}>
          {isCreatingComment ? "Posting" : "Comment"}
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
