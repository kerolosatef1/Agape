import { AppTopbar, AppSidebar } from "@/src/shared/ui/AppShell";
import { getLocale } from "next-intl/server";
import GoldenBackground from "@/src/shared/ui/GoldenBackGround";

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const locale = await getLocale();

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#f8f7f4" }}>
      <GoldenBackground />
      <AppTopbar />
      <div className="flex relative z-10">
        <aside
          className="hidden lg:flex lg:fixed lg:top-16 lg:bottom-0 lg:w-[272px] lg:start-0"
          style={{ background: "linear-gradient(180deg, #1a1a6e 0%, #0d0d4a 100%)" }}
        >
          <AppSidebar />
        </aside>

        <div className={`w-full ${locale === "ar" ? "lg:pr-[272px]" : "lg:pl-[272px]"}`}>
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}