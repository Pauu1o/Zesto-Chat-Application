import { authOptions } from "./../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
export default async function getSession() {
  return await getServerSession(authOptions); //Async Function
}
