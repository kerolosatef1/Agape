"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { changeUserEmailAction } from "../../action/profile.action";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";

interface UserEmailProps {
  email: string;
}

const UserEmail: React.FC<UserEmailProps> = ({ email }) => {
  const t = useTranslations("pages.profile");
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!newEmail.trim()) return;
    setIsSaving(true);
    try {
      const result = await changeUserEmailAction(newEmail.trim());
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
        <h3 className="text-lg font-semibold mb-3">{t("userProfile.email")}</h3>
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent focus-within:outline-black"
              autoFocus
            />
            <Button size="icon" onClick={handleSave} disabled={isSaving || !newEmail.trim()}>
              {isSaving ? <Spinner /> : <Check size={16} />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => { setNewEmail(email); setIsEditing(false); }}>
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">{email}</p>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserEmail;