"use client";

import React from "react";
import { useUserProfile } from "../../hooks/profile.hooks";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Loader from "@/src/shared/ui/Loader";
import PageHeader from "@/src/shared/ui/PageHeader";
import UserName from "./UserName";
import UserEmail from "./UserEmail";
import UserRoles from "./UserRoles";
import UserImage from "./UserImage";

const UserProfileUI: React.FC = () => {
  const t = useTranslations("pages.profile");
  const { data, isLoading, isError } = useUserProfile();

  if (isLoading) return <Loader />;
  if (isError || !data) {
    return (
      <div className="text-center text-muted-foreground py-10">
        {t("error")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("userProfile.title")} description={t("userProfile.desc")} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* Username (read only) */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">{t("userProfile.username")}</h3>
              <p className="text-xl font-medium text-muted-foreground">@{data.userName}</p>
            </CardContent>
          </Card>

          <UserName name={data.name} />
          <UserEmail email={data.email} />
          <UserRoles roles={data.rules} />
        </div>

        <UserImage imagePath={data.pathImg} userName={data.name} />
      </div>
    </div>
  );
};

export default UserProfileUI;