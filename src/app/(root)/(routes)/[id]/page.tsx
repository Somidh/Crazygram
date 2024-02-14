"use client";

import { useGetUserById } from "@/lib/react-query/queries";
import { UserProfileHeader } from "./component/UserProfileHeader";

const Username = ({ params }: { params: { id: string } }) => {
  const { data: user } = useGetUserById(params.id);

  if (!user) return;

  return (
    <div>
      <UserProfileHeader user={user} />
    </div>
  );
};

export default Username;
