"use client";

import React, { useState } from "react";
import { usePendingUsers } from "../hooks/user.hooks";
import { approveUserAction } from "../action/users.action";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";
import Loader from "@/src/shared/ui/Loader";

const PendingUsersTable: React.FC = () => {
  const t = useTranslations("pages.users");
  const { data: users, isLoading } = usePendingUsers();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    setLoadingId(userId);
    try {
      const result = await approveUserAction(userId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        toast.error(result.message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <Loader />;

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          {t("noPending")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">{t("pendingTitle")}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.username")}</TableHead>
              <TableHead>{t("table.roles")}</TableHead>
              <TableHead>{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">@{user.userName}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.id)}
                    disabled={loadingId === user.id}
                    className="gap-1"
                  >
                    {loadingId === user.id ? (
                      <Spinner />
                    ) : (
                      <>
                        <UserCheck size={14} />
                        {t("approve")}
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingUsersTable;