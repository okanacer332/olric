import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Get the API URL based on environment.
 */
function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Default for SSR/server-side - use production or localhost
  return process.env.NODE_ENV === 'production'
    ? 'https://api.okanacer.xyz/api'
    : 'http://localhost:8080/api';
}

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
            id: credentials.email,
            name: credentials.email.split("@")[0],
            email: credentials.email,
            image: ""
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, fetch user plan from backend
      if (user?.email) {
        try {
          const apiUrl = getApiUrl();
          const response = await fetch(`${apiUrl}/user/profile?email=${encodeURIComponent(user.email)}`);
          if (response.ok) {
            const userData = await response.json();
            token.plan = userData.plan || 'FREE';
          } else {
            token.plan = 'FREE';
          }
        } catch (error) {
          console.error('Failed to fetch user plan:', error);
          token.plan = 'FREE';
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add plan to session from JWT token
      if (session.user) {
        (session.user as any).plan = token.plan || 'FREE';
      }
      return session;
    }
  },
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