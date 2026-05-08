"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { PartyPopper, Tag, Users, UserPlus, Award } from "lucide-react";
import PageTitle from "@/src/shared/ui/PageTitle";
import FestivalsTab from "./FestivalsTab";
import ClassificationsTab from "./ClassificationsTab";
import TeamsTab from "./TeamsTab";
import MembersTab from "./MembersTab";
import { FestivalTab } from "../types/types";

const tabs: { key: FestivalTab; icon: React.ElementType; labelKey: string }[] = [
  { key: "festivals", icon: PartyPopper, labelKey: "tabs.festivals" },
  { key: "classifications", icon: Tag, labelKey: "tabs.classifications" },
  { key: "teams", icon: Users, labelKey: "tabs.teams" },
  { key: "members", icon: UserPlus, labelKey: "tabs.members" },
  { key: "points", icon: Award, labelKey: "tabs.points" },
];

const FestivalModulePage: React.FC = () => {
  const t = useTranslations("pages.festivalModule");
  const [activeTab, setActiveTab] = useState<FestivalTab>("festivals");

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("desc")} />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-gray-200">
        {tabs.map(({ key, icon: Icon, labelKey }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all cursor-pointer border-b-2 -mb-px ${
              activeTab === key
                ? "border-[#1a1a6e] text-[#1a1a6e]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={16} />
            {t(labelKey)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "festivals" && <FestivalsTab />}
      {activeTab === "classifications" && <ClassificationsTab />}
      {activeTab === "teams" && <TeamsTab />}
      {activeTab === "members" && <MembersTab />}
    </div>
  );
};

export default FestivalModulePage;