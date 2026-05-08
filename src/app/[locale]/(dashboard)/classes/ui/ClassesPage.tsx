"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/src/shared/ui/PageHeader";
import { useAllClasses, useClassUsers } from "../hooks/classes.hooks";
import ClassCard from "./ClassCard";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";
import DeleteClassDialog from "./DeleteClassDialog";
import AddClassUserDialog from "./AddClassUserDialog";
import Loader from "@/src/shared/ui/Loader";
import { IClass } from "../types/types";

const ClassesPage: React.FC = () => {
  const t = useTranslations("pages.classes");
  const { data: session } = useSession();

  const roles: string[] = (session?.user as any)?.roles || [];
  const isAdmin = roles.includes("Admin");

  const { data: classes, isLoading } = useAllClasses();
  const { data: allClassUsers } = useClassUsers();

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title={t("title")} description={t("desc")} />
        {isAdmin && (
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus size={16} />
            {t("addBtn")}
          </Button>
        )}
      </div>

      {!classes || classes.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <ClassCard
              key={cls.classId}
              classData={cls}
              classUsers={(allClassUsers || []).filter(
                (u: any) => u.classId === cls.classId,
              )}
              isAdmin={isAdmin}
              onEdit={(c) => {
                setSelectedClass(c);
                setEditOpen(true);
              }}
              onDelete={(c) => {
                setSelectedClass(c);
                setDeleteOpen(true);
              }}
              onAddUser={(id) => {
                setSelectedClassId(id);
                setAddUserOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Dialogs — Admin only */}
      {isAdmin && (
        <>
          <AddClassDialog open={addOpen} onOpenChange={setAddOpen} />
          <EditClassDialog open={editOpen} onOpenChange={setEditOpen} classData={selectedClass} />
          <DeleteClassDialog open={deleteOpen} onOpenChange={setDeleteOpen} classData={selectedClass} />
          <AddClassUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} classId={selectedClassId} />
        </>
      )}
    </div>
  );
};

export default ClassesPage;