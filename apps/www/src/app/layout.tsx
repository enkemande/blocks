import { Input } from "@/components/ui/input";
import { authOptions } from "@/libs/auth";
import NextAuthProvider from "@/providers/auth";
import TrpcProvider from "@/providers/trpc";
import UserProvider from "@/providers/user";
import { cn } from "@/utils/cn";
import { Plus, User } from "lucide-react";
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
              <header>
                <div className="container ">
                  <div className="flex flex-row items-center justify-between gap-4 py-4">
                    <div className="flex-1">
                      <Input placeholder="Search Blocks" />
                    </div>
                    <nav>
                      <ul className="flex flex-row gap-4">
                        <li>
                          <Link href="/new">
                            <Plus className="h-6 w-6" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`/${session?.user.username || session?.user.id}`}
                          >
                            <User className="h-6 w-6" />
                          </Link>
                        </li>
                      </ul>
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
