import { AddBlockForm } from "@/components/add-block-form";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/libs/auth";
import NextAuthProvider from "@/providers/auth";
import TrpcProvider from "@/providers/trpc";
import UserProvider from "@/providers/user";
import { cn } from "@/utils/cn";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blocks",
  description: "Share your react component to world",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <NextAuthProvider>
      <TrpcProvider>
        <UserProvider>
          <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, "bg-gray-100")}>
              <header className="border-b border-b-slate-300">
                <div className="container">
                  <div className="flex flex-row items-center justify-between gap-2 py-2">
                    <Link href="/">
                      <h1 className="text-2xl font-bold uppercase">Blocks</h1>
                    </Link>
                    <div className="flex-1 flex items-center justify-center">
                      <Input placeholder="Search Blocks" />
                    </div>
                    <nav>
                      <AddBlockForm title="" description="" />
                    </nav>
                  </div>
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
