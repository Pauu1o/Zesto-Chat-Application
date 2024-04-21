"use client";
import { Conversation } from "@prisma/client";
import { FullConversationType } from "../types";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import useConversation from "../hooks/useConversation";
import { MdOutlineGroupAdd } from "react-icons/md";
import clsx from "clsx";
import ConversationBox from "./ConversationBox";
import { useSession } from "next-auth/react";
import { pusherClient } from "../libs/pusher";
import { find } from "lodash";
interface ConversationListProps {
  //Purpose of this code is strictly adhere what the defined structure is. In this case defined as an initialitems that contains an conversation array.
  initialItems: FullConversationType[];
}
const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);
  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    pusherClient.subscribe(pusherKey);
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const removeHanlder = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id != conversation.id)];
      });
      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHanlder);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHanlder);
    };
  }, [pusherKey, conversationId, router]);
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-neutral-700",
        isOpen ? "hidden" : "block w-full left-0"
      )}
    >
      <div className="px-1">
        <div className="flex justify-between mb-4 pt-4">
          <div className=" text-2xl font-bold text-white"> Messages </div>
        </div>
        {items.map((item) => (
          <ConversationBox
            key={item.id}
            data={item}
            selected={conversationId === item.id}
          />
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;

//Personal Note: This code provides  both the UI, and the extracted data per user and shows it the current user. It also manages the current state of the conversation and renders each conversation present.
//Also uses the useConversation hook determines which conversation is selected and open by the user.
