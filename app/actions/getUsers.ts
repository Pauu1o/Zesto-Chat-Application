import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
const getUsers = async () => {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }
  try {
    const users = await prisma.user.findMany({
      //Personal Note: Purpose of this code is to be able to show other users but not yourself.
      orderBy: {
        createdAt: "desc", //Starting from top
      },
      where: {
        NOT: {
          email: session.user.email, //finding all users email but not yours.
        },
      },
    });
    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
