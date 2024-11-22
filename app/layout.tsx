import type { Metadata } from "next";
import { AuthProvider } from "./auth/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easy Cards",
  description: "Your flashcards app!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" className="dark">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}