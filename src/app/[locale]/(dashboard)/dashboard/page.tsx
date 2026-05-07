import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Shield, LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const t = await getTranslations("pages.dashboard");

  const stats = [
    { key: "totalMembers", icon: Users, value: "—", color: "bg-purple-100 text-purple-600" },
    { key: "pendingApprovals", icon: UserCheck, value: "—", color: "bg-amber-100 text-amber-600" },
    { key: "totalUsers", icon: LayoutDashboard, value: "—", color: "bg-blue-100 text-blue-600" },
    { key: "activeRoles", icon: Shield, value: "—", color: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.key} className="py-4">
            <CardContent className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t(stat.key)}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
