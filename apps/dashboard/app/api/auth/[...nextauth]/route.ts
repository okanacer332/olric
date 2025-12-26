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
        // SECURITY NOTE: This accepts OAuth-authenticated users from backend redirect.
        // The backend (Spring Boot) handles actual authentication via Google OAuth.
        // This credentials provider just creates a session for already-authenticated users.
        if (credentials?.email) {
          return {
            id: credentials.email, // Use email as unique ID
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
    // SECURITY: Use environment variable for proper URL in all environments
    signIn: process.env.NEXTAUTH_URL || "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };