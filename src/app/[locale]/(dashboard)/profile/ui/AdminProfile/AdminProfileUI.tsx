"use client";

import React from "react";
import { useMyOrganization } from "../../hooks/profile.hooks";
import { useTranslations } from "next-intl";
import Loader from "../../../../../../shared/ui/Loader";
import PageHeader from "../../../../../../shared/ui/PageHeader";
import OrgQrCode from "./OrgQrCode";
import OrgImage from "./OrgImage";
import OrgName from "./OrgName";

const AdminProfileUI: React.FC = () => {
  const t = useTranslations("pages.profile");
  const { data, isLoading, isError } = useMyOrganization();

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
      <PageHeader title={t("title")} description={t("desc")} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <OrgName name={data.organizationName} />
          <OrgImage
            imagePath={data.organizationImagePath}
            orgName={data.organizationName}
          />
        </div>

        <OrgQrCode
          organizationId={data.organizationId}
          organizationName={data.organizationName}
        />
      </div>
    </div>
  );
};

export default AdminProfileUI;