import "./globals.css";
import { Providers } from "./providers";
import { DashboardShell } from "./components/DashboardShell"; // Az önce oluşturduğumuz bileşen
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olric Dashboard",
  description: "AI Powered Life Organizer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* DashboardShell burada SessionProvider'ın ÇOCUĞU olduğu için useSession çalışacak */}
          <DashboardShell>
             {children}
          </DashboardShell>
        </Providers>
      </body>
    </html>
  );
}