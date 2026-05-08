import { getLocale, getTranslations } from "next-intl/server";
import AuthHeader from "./ui/AuthHeader";
import CopticPattern from "./ui/CopticPattern";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("app");
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen flex relative">
      {/* ═══ Left/Right Panel — Branding ═══ */}
      <div
        className={`hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-10 ${
          isRTL ? "order-2" : "order-1"
        }`}
        style={{
          background: "linear-gradient(135deg, #1a1a6e 0%, #0d0d4a 60%, #12125a 100%)",
        }}
      >
        {/* Floating crosses background */}
        <CopticPattern />

        {/* Top — Logo */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Logo circle */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: "#c4943d", background: "rgba(196, 148, 61, 0.15)" }}
          >
            <svg width="24" height="24" viewBox="0 0 200 200" fill="none">
              <rect x="85" y="10" width="30" height="180" rx="4" fill="#c4943d" />
              <rect x="10" y="65" width="180" height="30" rx="4" fill="#c4943d" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Agápē
            </h2>
            <p className="text-xs text-white/50">— church · service —</p>
          </div>
        </div>

        {/* Middle — Headline */}
        <div className="relative z-10 flex flex-col gap-6">
          {/* Cross + tagline */}
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 200 200" fill="none">
              <rect x="85" y="10" width="30" height="180" rx="4" fill="#c4943d" />
              <rect x="10" y="65" width="180" height="30" rx="4" fill="#c4943d" />
            </svg>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase"
              style={{ color: "#c4943d" }}
            >
              — {t("taglineShort")} —
            </p>
          </div>

          {/* Main text */}
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              {t("heroLine1")}
            </h1>
            <h1
              className="text-4xl xl:text-5xl font-bold leading-tight mt-2"
              style={{ color: "#c4943d" }}
            >
              {t("heroLine2")}
            </h1>
          </div>

          {/* Verse */}
          <div className="mt-4">
            <p className="text-white/60 text-sm italic leading-relaxed max-w-md">
              &ldquo;{t("verse")}&rdquo;
            </p>
            <p
              className="text-sm font-medium mt-2"
              style={{ color: "#c4943d" }}
            >
              — {t("verseRef")}
            </p>
          </div>
        </div>

        {/* Bottom — Copyright */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">
            © Agápē {new Date().getFullYear()} · {t("builtFor")}
          </p>
        </div>

        {/* Decorative crosses scattered */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[
            { top: "8%", left: "15%", size: 16, opacity: 0.08 },
            { top: "20%", right: "10%", size: 24, opacity: 0.06 },
            { top: "45%", left: "5%", size: 20, opacity: 0.05 },
            { top: "60%", right: "20%", size: 18, opacity: 0.07 },
            { top: "75%", left: "25%", size: 14, opacity: 0.06 },
            { top: "85%", right: "8%", size: 22, opacity: 0.05 },
            { top: "30%", left: "40%", size: 12, opacity: 0.04 },
            { top: "50%", right: "35%", size: 16, opacity: 0.06 },
          ].map((cross, i) => (
            <svg
              key={i}
              width={cross.size}
              height={cross.size}
              viewBox="0 0 200 200"
              fill="none"
              className="absolute"
              style={{
                top: cross.top,
                left: cross.left,
                right: cross.right,
                opacity: cross.opacity,
              }}
            >
              <rect x="85" y="10" width="30" height="180" rx="4" fill="#c4943d" />
              <rect x="10" y="65" width="180" height="30" rx="4" fill="#c4943d" />
            </svg>
          ))}
        </div>
      </div>

      {/* ═══ Right/Left Panel — Form ═══ */}
      {/* ═══ Right/Left Panel — Form (SCROLLABLE) ═══ */}
      <div
        className={`w-full lg:w-1/2 flex flex-col min-h-screen bg-white ${
          isRTL ? "order-1" : "order-2"
        }`}
      >
        {/* Language Switch — top */}
        <div className="sticky top-0 z-20 bg-white flex justify-end p-4 lg:p-6">
          <AuthHeader />
        </div>

        {/* Form — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-16 pb-10">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* ═══ Mobile: Show branding at top ═══ */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, #1a1a6e, #c4943d, #1a1a6e)",
        }}
      />
    </div>
  );
}