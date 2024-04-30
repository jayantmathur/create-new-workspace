import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Credentials = {
  password: string;
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "your access key",
      credentials: {
        password: {
          label: "Enter the key below",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { password } = credentials as Credentials;

        return (
          (password === process.env.MAIN_ACCESS_KEY && {
            id: "guest",
            name: "Wedding Guest",
          }) ||
          null
        );
      },
    }),
  ],
  // theme: {
  //   logo: "/icons/icon.svg",
  // },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
