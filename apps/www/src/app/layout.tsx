import { Input } from "@/components/ui/input";
import NextAuthProvider from "@/providers/auth";
import TrpcProvider from "@/providers/trpc";
import UserProvider from "@/providers/user";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blocks",
  description: "Share your react component to world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <TrpcProvider>
        <UserProvider>
          <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
              <header>
                <div className="container flex flex-row items-center justify-between gap-4 p-4">
                  <h1>BLOCKS</h1>
                  <div className="flex-1">
                    <Input placeholder="Search Blocks" />
                  </div>
                  <nav>
                    <ul className="flex flex-row gap-4">
                      <li>
                        <Link href="/">Account</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </header>
              {children}
            </body>
          </html>
        </UserProvider>
      </TrpcProvider>
    </NextAuthProvider>
  );
}
