import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/src/shared/lib/axios/axios.instance";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data: apiResponse } = await api.post("/Auth/token", {
            username: credentials?.username || "",
            password: credentials?.password || "",
          });

          if (apiResponse.isAuthenticated && apiResponse.token) {
            return {
              id: apiResponse.userName,
              name: apiResponse.userName,
              email: apiResponse.email,
              token: apiResponse.token,
              userName: apiResponse.userName,
              organizationId: apiResponse.organizationId,
              roles: apiResponse.roles,
              expiresOn: apiResponse.expiresOn,
            };
          }

          // API returned but not authenticated
          throw new Error(apiResponse.message || "Login failed");
        } catch (error: any) {
          // Get the real error message from backend
          const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            error?.message ||
            "Login failed";

          throw new Error(
            typeof message === "string" ? message : "Login failed",
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.token = token.accessToken as string;
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export default NextAuth(authOptions);