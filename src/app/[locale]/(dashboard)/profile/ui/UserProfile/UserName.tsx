"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { changeUserNameAction } from "../../action/profile.action";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";

interface UserNameProps {
  name: string;
}

const UserName: React.FC<UserNameProps> = ({ name }) => {
  const t = useTranslations("pages.profile");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      const result = await changeUserNameAction(newName.trim());
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-3">{t("userProfile.name")}</h3>
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent focus-within:outline-black"
              autoFocus
            />
            <Button size="icon" onClick={handleSave} disabled={isSaving || !newName.trim()}>
              {isSaving ? <Spinner /> : <Check size={16} />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => { setNewName(name); setIsEditing(false); }}>
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">{name}</p>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserName;