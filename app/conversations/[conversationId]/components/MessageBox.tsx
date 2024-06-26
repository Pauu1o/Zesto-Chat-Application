"use client";

import { FullMessageType } from "@/app/types";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { Container } from "postcss";
import Avatar from "@/app/users/components/Avatar";
import { format } from "date-fns";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}
const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email != data?.sender?.email)
    .map((user) => user.name)
    .join(",");
  const container = clsx("flex gap-3 p-5", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-orange-500 text-white py-2 px-3 rounded-full" : "text-white"
  );
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-white">{data.sender.name}</div>
          <div className="text-xs text-gray-300">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={message}>
          <div>{data.body}</div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
