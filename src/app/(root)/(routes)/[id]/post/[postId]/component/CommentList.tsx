import { Models } from "appwrite";
import Comment from "./Comment";

type Comment = {
  id: string;
  message: string;
  parentId: string;
  // post: Models.Document;
};

type CommentsListProps = {
  post?: Models.Document;
  comments?: Comment[];
};

const CommentList = ({ comments }: CommentsListProps) => {
  // const parsedComment = post?.com?.map((post: string) => JSON.parse(post));

  // const flattenedComments = comments?.flatMap((innerArray) => innerArray);
  console.log("yolo", comments);

  return comments?.map((comment: Comment, idx: number) => {
    return (
      <div key={idx} className="mb-2">
        <Comment comment={comment} />
        {/* <Comment message={comment?.message} post={post} id={comment.id} /> */}
      </div>
    );
  });
};

export default CommentList;
