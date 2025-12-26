import NextAuth from "next-auth";

/**
 * Extended NextAuth types for Olric application.
 * Adds plan field to user object for premium feature access control.
 */
declare module "next-auth" {
    interface User {
        id: string;
        plan?: "FREE" | "PREMIUM";
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            plan?: "FREE" | "PREMIUM";
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        plan?: "FREE" | "PREMIUM";
    }
}
