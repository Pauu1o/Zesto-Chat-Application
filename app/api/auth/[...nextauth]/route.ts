import { authOptions } from "./authOptions";
import NextAuth from "next-auth";
export { handler as GET, handler as POST };
const handler = NextAuth(authOptions);
