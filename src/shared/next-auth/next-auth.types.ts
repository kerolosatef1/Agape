import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    token?: string;
    user: User & {
      userName: string;
      email: string;
      organizationId: string;
      roles: string[];
      token: string;
      expiresOn: string;
    };
  }
  interface User {
    token?: string;
    userName?: string;
    organizationId?: string;
    roles?: string[];
    expiresOn?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user: any;
  }
}