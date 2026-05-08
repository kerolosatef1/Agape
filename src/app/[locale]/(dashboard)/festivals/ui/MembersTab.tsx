"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/src/shared/ui/Loader";
import Spinner from "@/src/shared/ui/Spinner";
import { useFamilies, useFestivalUsers } from "../hooks/festivals.hooks";
import { useApprovedUsers } from "../../users/hooks/user.hooks";
import {
  addFestivalUserAction,
  deleteFestivalUserAction,
  editFestivalUserAction,
} from "../action/festivals.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const MembersTab: React.FC = () => {
  const t = useTranslations("pages.festivalModule");
  const queryClient = useQueryClient();
  const { data: families, isLoading: familiesLoading } = useFamilies();
  const { data: festivalUsers } = useFestivalUsers();
  const { data: approvedUsers } = useApprovedUsers();

  const [selectedFamily, setSelectedFamily] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [togglingLead, setTogglingLead] = useState<string | null>(null);

  const teamMembers =
    festivalUsers?.filter((u) => u.festivalFamilyId === selectedFamily) || [];

  const handleAdd = async () => {
    if (!selectedUser || !selectedFamily) return;
    setIsAdding(true);
    try {
      const result = await addFestivalUserAction(selectedUser, selectedFamily);
      if (result.success) { toast.success(result.message); queryClient.invalidateQueries({ queryKey: ["festivalUsers"] }); setSelectedUser(""); }
      else toast.error(result.message);
    } finally { setIsAdding(false); }
  };

  const handleRemove = async (userId: string) => {
    if (!selectedFamily) return;
    setRemovingId(userId);
    try {
      const result = await deleteFestivalUserAction(userId, selectedFamily);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["festivalUsers"] });
      } else toast.error(result.message);
    } finally {
      setRemovingId(null);
    }
  };

  const handleToggleLead = async (userId: string, currentLead: boolean) => {
    if (!selectedFamily) return;
    setTogglingLead(userId);
    try {
      const result = await editFestivalUserAction(
        userId,
        selectedFamily,
        !currentLead,
      );
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["festivalUsers"] });
      } else toast.error(result.message);
    } finally {
      setTogglingLead(null);
    }
  };

  if (familiesLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">
          {t("members.selectTeam")}
        </label>
        <select
          value={selectedFamily ?? ""}
          onChange={(e) =>
            setSelectedFamily(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full max-w-md px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a6e]/20 focus-within:outline-none"
        >
          <option value="">{t("members.chooseTeam")}</option>
          {families?.map((f) => (
            <option key={f.festivalFamilyId} value={f.festivalFamilyId}>
              {f.festivalFamilyName}
            </option>
          ))}
        </select>
      </div>

      {selectedFamily && (
        <>
          {/* Add member */}
          <div className="flex gap-2 max-w-md">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus-within:outline-none"
            >
              <option value="">{t("members.selectUser")}</option>
              {approvedUsers
                ?.filter((u) => !teamMembers.some((m) => m.userId === u.id))
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (@{u.userName})
                  </option>
                ))}
            </select>
            <Button
              onClick={handleAdd}
              disabled={!selectedUser || isAdding}
              className="gap-1 rounded-xl"
              style={{ backgroundColor: "#1a1a6e" }}
            >
              {isAdding ? <Spinner className="size-4!" /> : <Plus size={16} />}
            </Button>
          </div>

          {/* Members list */}
          {teamMembers.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              {t("members.empty")}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => {
                const user = approvedUsers?.find((u) => u.id === member.userId);
                return (
                  <Card
                    key={member.festivalUserId}
                    className={`border-0 shadow-sm ${member.isLead ? "ring-2 ring-amber-400" : ""}`}
                  >
                    <CardContent className="pt-4 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {user?.name || member.userId}
                        </span>
                        {member.isLead && (
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] gap-1">
                            <Crown size={10} />
                            {t("members.leader")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() =>
                            handleToggleLead(member.userId, member.isLead)
                          }
                          disabled={togglingLead === member.userId}
                        >
                          {togglingLead === member.userId ? (
                            <Spinner className="size-3!" />
                          ) : (
                            <Crown
                              size={12}
                              className={member.isLead ? "text-amber-600" : ""}
                            />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-destructive"
                          onClick={() => handleRemove(member.userId)}
                          disabled={removingId === member.userId}
                        >
                          {removingId === member.userId ? (
                            <Spinner className="size-3!" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MembersTab;
