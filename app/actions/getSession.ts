import { authOptions } from "./../../utils/authOptions";
import { getServerSession } from "next-auth";
export default async function getSession() {
  return await getServerSession(authOptions); //Async Function
}
