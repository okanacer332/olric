import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 1. Zaten giriş yapılmışsa İZİN VER
        if (token) return true;

        // 2. URL'de 'user' parametresi varsa İZİN VER (Backend'den yeni gelmiş)
        if (req.nextUrl.searchParams.has("user")) return true;

        // 3. Yetkisiz ise REDDET
        return false;
      },
    },
    pages: {
      signIn: "http://localhost:3000", 
    },
  }
);

export const config = { 
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] 
};