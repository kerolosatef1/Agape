import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/src/shared/provider/Providers";
import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "@//src/shared/lib/i18n/routing";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agápē",
  description: "Orthodox Church Service Management System",
};

function resolveLocale(raw: string | undefined): Locale {
  return raw && (locales as readonly string[]).includes(raw)
    ? (raw as Locale)
    : defaultLocale;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const cookieLocale = store.get("NEXT_LOCALE")?.value;
  const locale = resolveLocale(cookieLocale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={cn("font-sans", geist.variable)}>
      
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
