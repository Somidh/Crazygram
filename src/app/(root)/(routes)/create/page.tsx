import { Typography } from "@/components/typography";
import { CreatePostForm } from "./components/createPostForm";

const Create = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Typography variant={"h3"} className="mb-10">
        Create a Post
      </Typography>
      <CreatePostForm action="Create" />
      {/* <div className="flex items-center justify-center">
        <PostOptions />
      </div> */}
    </div>
  );
};

export default Create;
