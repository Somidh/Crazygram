import { Models } from "appwrite";
import Comment from "./Comment";

type Comment = {
  message: string;
  parentId: string;
  createdAt: string;
  updatedAt?: string;
};

type CommentsListProps = {
  post: Models.Document;
};

const CommentList = ({ post }: CommentsListProps) => {
  const parsedComment = post.com.map((post: string) => JSON.parse(post));

  console.log(parsedComment);

  return parsedComment.map((comment: Comment, idx: number) => (
    <div key={idx} className="mb-2">
      <Comment message={comment?.message} createdAt={comment.createdAt} />
    </div>
  ));
};

export default CommentList;
