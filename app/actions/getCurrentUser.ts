import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
const getCurrentUsers = async () => {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });
    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch (error: any) {
    return null;
  }
};
export default getCurrentUsers;

//personal note, this part of the code basically awaits for the server to retrieve the user own unique email via use of asynchronous functions.
