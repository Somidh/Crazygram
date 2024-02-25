import { TComment } from "@/types";
import { Models } from "appwrite";
import Comment from "./Comment";

type CommentsListProps = {
  post?: Models.Document;
  comments?: TComment[];
};

const CommentList = ({ comments }: CommentsListProps) => {
  return comments?.map((comment: TComment, idx: number) => {
    return (
      <div key={idx} className="mb-4 space-y-2">
        <Comment comment={comment} />
      </div>
    );
  });
};

export default CommentList;
