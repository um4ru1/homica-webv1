// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";            // keep if you need it
import { AuthProvider } from "@/src/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Homica",
  description: "Migrated from Vite to Next.js (Tailwind v4)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pre-hydrate theme sync to avoid mismatches (class strategy) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var t = localStorage.getItem('theme');
    var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && m)) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground">
        {/* Render children ONCE. If Providers already wraps ThemeProvider, great. */}
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
