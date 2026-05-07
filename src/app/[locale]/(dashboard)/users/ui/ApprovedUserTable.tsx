"use client";

import React, { useState } from "react";
import { useApprovedUsers, useAvailableRoles } from "../hooks/user.hooks";
import { removeApprovalAction, addRoleAction, removeRoleAction } from "../action/users.action";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserX, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";
import Loader from "@/src/shared/ui/Loader";
import { ConfirmDialog } from "@/src/shared/ui/ConfirmDialog";

const ApprovedUsersTable: React.FC = () => {
  const t = useTranslations("pages.users");
  const { data: users, isLoading } = useApprovedUsers();
  const { data: availableRoles } = useAvailableRoles();
  const queryClient = useQueryClient();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [roleLoadingKey, setRoleLoadingKey] = useState<string | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [removePending, setRemovePending] = useState(false);

  // Add role
  const handleAddRole = async (userId: string, role: string) => {
    const key = `${userId}-${role}`;
    setRoleLoadingKey(key);
    try {
      const result = await addRoleAction(userId, role);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        toast.error(result.message);
      }
    } finally {
      setRoleLoadingKey(null);
    }
  };

  // Remove role
  const handleRemoveRole = async (userId: string, role: string) => {
    const key = `${userId}-${role}`;
    setRoleLoadingKey(key);
    try {
      const result = await removeRoleAction(userId, role);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        toast.error(result.message);
      }
    } finally {
      setRoleLoadingKey(null);
    }
  };

  // Remove approval
  const handleRemoveApproval = async () => {
    if (!selectedUserId) return;
    setRemovePending(true);
    try {
      const result = await removeApprovalAction(selectedUserId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setRemoveDialogOpen(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setRemovePending(false);
    }
  };

  if (isLoading) return <Loader />;

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          {t("noApproved")}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">{t("approvedTitle")}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.username")}</TableHead>
                <TableHead>{t("table.roles")}</TableHead>
                <TableHead>{t("table.addRole")}</TableHead>
                <TableHead>{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                // Roles the user doesn't have yet
                const assignableRoles = (availableRoles || []).filter(
                  (r) => !user.roles.map((ur) => ur.toLowerCase()).includes(r.toLowerCase()),
                );

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">@{user.userName}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="text-xs gap-1 cursor-pointer hover:bg-destructive/10"
                            onClick={() => handleRemoveRole(user.id, role)}
                          >
                            {role}
                            {roleLoadingKey === `${user.id}-${role}` ? (
                              <Spinner className="size-3!" />
                            ) : (
                              <X size={10} />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {assignableRoles.map((role) => (
                          <Button
                            key={role}
                            variant="outline"
                            size="xs"
                            onClick={() => handleAddRole(user.id, role)}
                            disabled={roleLoadingKey === `${user.id}-${role}`}
                            className="gap-1 text-xs"
                          >
                            {roleLoadingKey === `${user.id}-${role}` ? (
                              <Spinner className="size-3!" />
                            ) : (
                              <Plus size={10} />
                            )}
                            {role}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive gap-1"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setRemoveDialogOpen(true);
                        }}
                      >
                        <UserX size={14} />
                        {t("removeApproval")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title={t("removeDialog.title")}
        description={t("removeDialog.desc")}
        confirmLabel={t("removeDialog.confirm")}
        cancelLabel={t("removeDialog.cancel")}
        onConfirm={handleRemoveApproval}
        isPending={removePending}
        variant="danger"
      />
    </>
  );
};

export default ApprovedUsersTable;