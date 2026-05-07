"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { IChild, CHILD_MANAGEMENT_ROLES } from "../types/types";
import { IClass } from "../../classes/types/types";
import ChildCardShared from "@/src/shared/ui/ChildCard";

interface ChildCardProps {
  child: IChild;
  classes: IClass[];
  userRoles: string[];
  onEdit: (child: IChild) => void;
  onDelete: (child: IChild) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({
  child,
  classes,
  userRoles,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations("pages.children");
  const canManage = userRoles.some((r) => CHILD_MANAGEMENT_ROLES.includes(r));
  const classLabel = classes.find((c) => c.classId === child.classId)?.className || "—";

  return (
    <ChildCardShared
      name={child.chiledName}
      gender={child.gender}
      classLabel={classLabel}
      description={child.description}
      needsSupport={child.typeNeedy}
      needsSupportLabel={t("needy")}
      sessionsLabel={t("sessions")}
      actions={
        canManage ? (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => { e.stopPropagation(); onEdit(child); }}
            >
              <Pencil size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(child); }}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        ) : undefined
      }
    />
  );
};

export default ChildCard;