"use client";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useGetUserById } from "@/lib/react-query/queries";
import { Loader } from "lucide-react";

const Following = ({ params }: { params: { id: string } }) => {
  const { data: users, isLoading } = useGetUserById(params.id);

  if (!users) return;

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div>
      <Typography variant={"h4"} className="border-b border-gray-500">
        Following
      </Typography>
      <section>
        {users?.following.map((user: any) => {
          return (
            <div
              key={user.$id}
              className="flex items-center justify-between mb-10"
            >
              <Typography variant={"paragraph"}>{user}</Typography>
              <div>
                <Button>Follow</Button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Following;
