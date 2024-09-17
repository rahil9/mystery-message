import NextAuth from "next-auth/next";
import { authOptions } from "./options";

// name should be 'handler' only
const handler = NextAuth(authOptions)

// these files work on these verbs
export {handler as GET, handler as POST}