"use client";

import { useGetUserById } from "@/lib/react-query/queries";
import Content from "./component/Content";
import { UserProfileHeader } from "./component/UserProfileHeader";

const Username = ({ params }: { params: { id: string } }) => {
  const { data: user } = useGetUserById(params.id);

  if (!user) return;

  return (
    <div className="space-y-10 max-w-xl mx-auto">
      <UserProfileHeader user={user} />
      <Content id={params.id} />
    </div>
  );
};

export default Username;
