"use client";

import React from "react";
import { useTranslations } from "next-intl";
import PageHeader from "@/src/shared/ui/PageHeader";
import PendingUsersTable from "./PendingUserTable";
import ApprovedUsersTable from "./ApprovedUserTable";

const UsersPage: React.FC = () => {
  const t = useTranslations("pages.users");

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("desc")} />
      <PendingUsersTable />
      <ApprovedUsersTable />
    </div>
  );
};

export default UsersPage;