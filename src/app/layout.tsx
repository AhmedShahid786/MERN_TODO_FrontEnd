import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Taskify",
  description: "Mern stack todo app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 font-poppins">
        <AuthContextProvider>
          <header className="w-screen py-6 text-center">
            <h1 className="text-primary text-3xl font-orbitron font-semibold tracking-wider">
              Taskify
            </h1>
          </header>
          {children}
          <Toaster />
        </AuthContextProvider>
      </body>
    </html>
  );
}
