import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/super-admin/login", "/clinic/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const authCookie = req.cookies.get("dentaflow-auth")?.value;

  // console.log("authCookie", authCookie);

  if (!authCookie) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(authCookie)) as {
      state: { isAuthenticated: boolean; isSuperAdmin: boolean };
    };

    const { isAuthenticated, isSuperAdmin } = parsed.state;

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/super-admin") && !isSuperAdmin) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
