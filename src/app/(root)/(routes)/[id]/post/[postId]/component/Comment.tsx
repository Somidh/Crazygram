import { Typography } from "@/components/typography";
import { formatDate } from "@/lib/utils";

const Comment = ({
  message,
  createdAt,
}: {
  message: string;
  createdAt: string;
}) => {
  return (
    <>
      <div className="border border-gray-800 w-full p-4 space-y-4 ">
        <div className="flex items-center justify-between">
          <Typography variant={"muted"}>Kyle</Typography>
          <Typography variant={"muted"}>
            {/* {dateFormatter.format(createdAt)} */}
            {formatDate(createdAt)}
          </Typography>
        </div>
        <div>
          <Typography>{message}</Typography>
        </div>
        <div>
          <ul className="flex items-enter gap-4">
            <li>I</li>
            <li>I</li>
            <li>I</li>
            <li>I</li>
          </ul>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Comment;
