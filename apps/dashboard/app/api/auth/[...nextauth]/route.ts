import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  // --- KRİTİK AYARLAR ---
  // NextAuth'un session'ı nerede tutacağını ve debug modunu ayarlıyoruz
  session: {
    strategy: "jwt",
  },
  debug: true, // Terminalde hatayı görmek için
  
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Giriş başarılıysa KESİN Dashboard'a git
      return baseUrl + "/dashboard";
    },
  },
});

export { handler as GET, handler as POST };