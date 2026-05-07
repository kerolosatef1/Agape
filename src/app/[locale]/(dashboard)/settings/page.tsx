import { getTranslations } from "next-intl/server";
import PageHeader from "@/src/shared/ui/PageHeader";

export default async function SettingsPage() {
  const t = await getTranslations("pages.settings");
  return (
    <div>
      <PageHeader title={t("title")} description={t("desc")} />
      <p className="text-muted-foreground">{t("comingSoon")}</p>
    </div>
  );
}
