import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { stripLocale } from "./shared/lib/utils";

const intlMiddleware = createMiddleware(routing);

const authPages = ["/login", "/register", "/register-user"];

const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const internalPath = stripLocale(pathname);

  const isAuthPage = authPages.some(
    (page) => internalPath === page || internalPath.startsWith(`${page}/`),
  );

  if (isAuthPage) {
    const token = await getToken({ req, secret });
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return intlMiddleware(req);
  }

  if (internalPath === "/" || internalPath.startsWith("/403")) {
    return intlMiddleware(req);
  }

  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // All authenticated users can access all pages for now
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|map)$).*)",
  ],
};