import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Backend'den gelen kullanıcıyı kabul et
        if (credentials?.email) {
          return {
             id: "1",
             name: credentials.email.split("@")[0],
             email: credentials.email,
             image: ""
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "http://localhost:3000", // Hata olursa Landing Page'e at
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // .env'den okuması için
});

export { handler as GET, handler as POST };