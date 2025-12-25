import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Allow OAuth callback to pass through without auth check
  // This prevents redirect loop when users return from Google OAuth
  if (searchParams.get("success") === "true" && searchParams.has("user")) {
    return NextResponse.next();
  }

  // For all other routes, use NextAuth middleware
  return (withAuth(
    function middleware(req) {
      return NextResponse.next();
    },
    {
      callbacks: {
        authorized: ({ token, req }) => {
          const cookies = req.cookies;

          // Check for our custom auth token cookie
          if (cookies.has("auth_token")) {
            return true;
          }

          // Check for NextAuth token
          if (token) return true;

          return false;
        },
      },
      pages: {
        signIn: "http://localhost:3000",
      },
    }
  ) as any)(req);
}

export const config = {
  // API, static dosyalar ve favicon hariç her yeri koru
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};