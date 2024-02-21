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
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment, useGetPostById } from "@/lib/react-query/queries";
import { useParams } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

//
type Comment = {
  id: string;
  message: string;
  parentId?: string;
};
type ReplyFormProps = {
  id: string;
};

const FormSchema = z.object({
  id: z.string(),
  comment: z.string().min(10),
  parentId: z.string().optional(),
});

const ReplyForm = ({ id }: ReplyFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
      comment: "",
      parentId: "",
    },
  });

  const params = useParams<{ postId: string }>();

  const { mutateAsync: createComment } = useCreateComment();
  const { data: post } = useGetPostById(params.postId);
  const parsedComment = post?.com.map((comment: string) => comment);
  const [comments, setComments] = useState<string[]>(parsedComment);
  //   const queryClient = useQueryClient();

  if (!post) return <h1>Loading..</h1>;

  const handleReplyComment = async (data: z.infer<typeof FormSchema>) => {
    const { comment } = data;

    const newReply: Comment = {
      id: uuidv4(),
      message: comment,
      parentId: id,
    };

    const str = JSON.stringify(newReply);

    createComment({ postId: post?.$id, comments: [str, ...comments] });
    setComments((prev) => [str, ...prev]);
    form.reset();

    console.log({ data });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleReplyComment)}
        className="w-full  space-y-2"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Add a reply</FormLabel> */}
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
        <Button type="submit">Reply</Button>
      </form>
    </Form>
  );
};

export default ReplyForm;
