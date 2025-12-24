import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Kullanıcı giriş yapmamışsa yönlendirileceği sayfa (NextAuth default olarak /api/auth/signin'e atar, biz bunu landing page yapabiliriz ama genelde login sayfası mantıklıdır)
  pages: {
    signIn: "/", // Giriş yapmamış biri dashboard'a girmeye çalışırsa Landing Page'e atılsın
  },
});

export const config = { 
  // Hangi sayfalar korunsun? Dashboard ve altındaki her şey.
  matcher: ["/dashboard/:path*"] 
};