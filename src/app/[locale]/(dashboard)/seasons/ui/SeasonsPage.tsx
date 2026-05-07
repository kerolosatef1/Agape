"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/src/shared/ui/PageHeader";
import SeasonsList from "./SeasonsList";
import AddSeasonDialog from "./AddSeasonDialog";

const SeasonsPage: React.FC = () => {
  const t = useTranslations("pages.seasons");
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title={t("title")} description={t("desc")} />
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus size={16} />
          {t("addBtn")}
        </Button>
      </div>

      <SeasonsList />
      <AddSeasonDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};

export default SeasonsPage;