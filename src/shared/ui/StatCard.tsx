"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "green" | "red" | "blue" | "gold" | "gray";
}

const colorMap = {
  green: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-600" },
  red: { bg: "bg-red-50", text: "text-red-700", icon: "text-red-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" },
  gold: { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-600" },
  gray: { bg: "bg-gray-50", text: "text-gray-700", icon: "text-gray-500" },
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => {
  const c = colorMap[color];

  return (
    <Card className="py-3">
      <CardContent className="flex items-center gap-3 px-4">
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-xl font-bold ${c.text}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;