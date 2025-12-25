import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { searchParams } = req.nextUrl;
        const cookies = req.cookies;

        // 1. URL'de bizim gönderdiğimiz 'user' (token) parametresi varsa -> GEÇ
        // (Bu, backend'den dönerken takılmamak için kritik)
        if (searchParams.get("success") === "true" && searchParams.has("user")) {
          return true;
        }

        // 2. Cookie'de bizim 'auth_token' varsa -> GEÇ
        // (Sayfa yenilendiğinde takılmamak için kritik)
        if (cookies.has("auth_token")) {
          return true;
        }

        // 3. NextAuth token'ı varsa -> GEÇ
        if (token) return true;

        // Hiçbiri yoksa -> KAL
        return false;
      },
    },
    pages: {
      signIn: "http://localhost:3000", // Yetkisizleri buraya at
    },
  }
);

export const config = { 
  // API, static dosyalar ve favicon hariç her yeri koru
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] 
};