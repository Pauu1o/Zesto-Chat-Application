import getCurrentUsers from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUsers();
    const body = await request.json();
    const { message, image, conversationId } = body;
    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    await pusherServer.trigger(conversationId, "messages:new", newMessage);
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, "ERROR MESSAGE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
//Personal Note:
// This function handles the creation of a new message in a conversation. It retrieves the current user's information and the message details from the request body.
// If the current user is not authorized (missing ID or email), it returns a 401 Unauthorized response. Otherwise, it creates a new message in the database, connects it to the conversation and the sender, updates the conversation's last message timestamp, and includes the necessary data for the response.
// If an error occurs, it logs the error and returns a 500 Internal Server Error response.
