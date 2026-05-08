"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface UserRolesProps {
  roles: string[];
}

const UserRoles: React.FC<UserRolesProps> = ({ roles }) => {
  const t = useTranslations("pages.profile");

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-3">{t("userProfile.roles")}</h3>
        <div className="flex gap-2 flex-wrap">
          {roles.map((role) => (
            <Badge key={role} variant="secondary" className="text-sm">
              {role}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoles;