"use client";

import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Avatar from "./Avatar";
import LoadingModal from "@/app/components/LoadingModal";

interface UserBoxProps {
  data: User;
}
const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  //block of code where if the user clicks another userbox it will initiate a conversation and goes to the conversation page using the Axios API.
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/conversations", { userId: data.id })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-neutral-900 p-3 hover:bg-gradient-to-r from-orange-500 to-neutral-900 rounded-lg transition cursor-pointer"
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-semibold text-white">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
