"use client";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType } from "../types";
import useOtherUser from "../hooks/useOtherUser";
import { Router } from "next/router";
import Avatar from "../users/components/Avatar";
interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}
const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data); //block of code to provide logic to be able to retrieve the last message.
  const session = useSession();
  const router = useRouter();
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);
  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }
    const seenArray = lastMessage.seen || [];
    if (!userEmail) {
      return false;
    }
    return seenArray.filter((user) => user.email === userEmail).length != 0;
  }, [userEmail, lastMessage]);
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "sent an image";
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return "Started a Conversation";
  }, [lastMessage]);
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full relative flex items-center space-x-3 hover:bg-gradient-to-r from-orange-500 to-neutral-900 rounded-lg transition-all cursor-pointer p-3",
        selected
          ? "bg-gradient-to-r from-orange-500 to-neutral-900"
          : " bg-neutral-900 "
      )}
    >
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center nm-1">
            <p className="text-md font-medium text-white">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className={clsx(
                  "text-xs text-gray-400 font-light",
                  selected ? "text-white" : ""
                )}
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              "truncate text-sm",
              hasSeen ? "text-gray-400" : "text-white font font-medium",
              selected ? "text-white" : ""
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;

//Personal Note: This entire code displays UI for each conversation, showing the other user's avatar, name, and the last message they sent. It also indicates whether the current user has seen the last message.
