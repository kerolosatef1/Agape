"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserPlus, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { deleteClassUserAction } from "../action/classes.action";
import { useQueryClient } from "@tanstack/react-query";
import { IClass, IClassUser } from "../types/types";
import Spinner from "@/src/shared/ui/Spinner";
import { useApprovedUsers } from "../../users/hooks/user.hooks";
interface ClassCardProps {
  classData: IClass;
  classUsers: IClassUser[];
  isAdmin: boolean;
  onEdit: (classData: IClass) => void;
  onDelete: (classData: IClass) => void;
  onAddUser: (classId: number) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({
  classData,
  classUsers,
  isAdmin,
  onEdit,
  onDelete,
  onAddUser,
}) => {
  const t = useTranslations("pages.classes");
  const queryClient = useQueryClient();
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
const { data: approvedUsers } = useApprovedUsers();
  const handleRemoveUser = async (userId: string) => {
    setRemovingUserId(userId);
    try {
      const result = await deleteClassUserAction(userId, classData.classId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["classes"] });
      } else {
        toast.error(result.message);
      }
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{classData.className}</h3>
            <p className="text-sm text-muted-foreground">
              {t("serialNo")}: {classData.classSerialNo}
            </p>
          </div>

          {isAdmin && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => onEdit(classData)}>
                <Pencil size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive"
                onClick={() => onDelete(classData)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Class Users */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users size={14} />
              {t("classUsers.title")} ({classUsers.length})
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="xs"
                className="gap-1"
                onClick={() => onAddUser(classData.classId)}
              >
                <UserPlus size={12} />
                {t("classUsers.add")}
              </Button>
            )}
          </div>

          {classUsers.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t("classUsers.empty")}</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {classUsers.map((user) => {
                const userInfo = approvedUsers?.find((u) => u.id === user.userId);
                const displayName = userInfo?.name || user.userName || user.userId;

                return (
                  <Badge
                    key={user.userId}
                    variant="secondary"
                    className="text-xs gap-1 py-1"
                  >
                    {displayName}
                    {isAdmin && (
                      <button
                        onClick={() => handleRemoveUser(user.userId)}
                        className="hover:text-destructive transition-colors"
                        disabled={removingUserId === user.userId}
                      >
                        {removingUserId === user.userId ? (
                          <Spinner className="size-3!" />
                        ) : (
                          <X size={10} />
                        )}
                      </button>
                    )}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;