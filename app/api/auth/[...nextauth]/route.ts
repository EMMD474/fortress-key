import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prismaConnect";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        // find user in DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("User not found");

        // check password
        const isValid = await bcrypt.compare(credentials.password, user.masterHash);
        if (!isValid) throw new Error("Invalid password");

        // return the user object for the session
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.userName = token.userName as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // don’t store in DB
    maxAge: 60 * 15, // 15 minutes
  },
  pages: {
    signIn: "/auth", // custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
