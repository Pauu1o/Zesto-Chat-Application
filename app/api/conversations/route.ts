import getCurrentUsers from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUsers();
    const body = await request.json();
    const { userId, isGroup, members, name } = body; //create group chat

    if (!currentUser?.id || !currentUser?.email) {
      //checks if their is a current user
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      //checks if the group chat has more than two members.
      return new NextResponse("Invalid data", { status: 400 });
    }
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        //created a new conversation
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                //Spreads and iterates result of mapping over the members array. This also creates an object that has an id containing value each of the member. TLDR Connects to the members to the conversation
                id: member.value,
              })),
              {
                id: currentUser.id, //seperates our own id, with other people in the group chat.
              },
            ],
          },
        },
        include: {
          users: true, //Include users relateds to the conversation, allowing their avatars and names to be rendered.
        },
      });
      return NextResponse.json(newConversation);
    }
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId], //Purpose of this is to know if their is an already existing conversation between two users, and stops creating if it already exist.
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });
    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }
    const newConversation = await prisma.conversation.create({
      //The actual logic for the conversation between two users. Creates, connects the users.
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true, //Shows the users data including pictures, and names.
      },
    });
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });
    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//Personal Note: This Code creates logic for the the group chat, and one to one conversation.
