"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Loader from "@/src/shared/ui/Loader";
import AdminProfileUI from "./AdminProfile/AdminProfileUI";
import UserProfileUI from "./UserProfile/UserProfileUI";

const ProfileUI: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loader />;

  const roles: string[] = (session?.user as any)?.roles || [];
  const isAdmin = roles.includes("Admin");

  if (isAdmin) return <AdminProfileUI />;
  return <UserProfileUI />;
};

export default ProfileUI;