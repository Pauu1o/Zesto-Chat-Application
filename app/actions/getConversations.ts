import prisma from "@/app/libs/prismadb";
import getCurrentUsers from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUsers();
  if (!currentUser?.id) {
    return [];
  }
  try {
    const conversation = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc", //Purpose of this block of code where new conversation will be ordered at the top of the list
      },
      where: {
        userIds: {
          has: currentUser.id, //This query loads all conversation, including one to one, and group chats.
        },
      },
      include: {
        // block of code that populates the conversation model
        users: true,
        messages: {
          include: {
            //block of code that populates the messages where it will show the sender, and the seen will be an array to show who had seen the message
            sender: true,
            seen: true,
          },
        },
      },
    });
    return conversation;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
