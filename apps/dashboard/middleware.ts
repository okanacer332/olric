import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/auth/signin", // NextAuth'un default sayfası yerine bunu kullanabiliriz
  },
  callbacks: {
    authorized({ req, token }) {
      // Eğer token yoksa (login değilse)
      if (!token) {
        return false; 
      }
      return true;
    },
  },
});

// Middleware tetiklendiğinde ama yetki yoksa ne olacağını burası yönetir:
// NextAuth konfigürasyonundan bağımsız, "unauthorized" durumunu manuel yönetelim
export const config = { 
  matcher: ["/dashboard/:path*"] 
};