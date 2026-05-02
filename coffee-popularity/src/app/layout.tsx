import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "咖啡热度 | Coffee Popularity",
  description: "探索城市咖啡热度，发现最受欢迎的咖啡馆 | Explore city coffee popularity, discover the most popular coffee shops",
  keywords: ["咖啡", "咖啡馆", "热度排名", "城市", "coffee", "coffee shop", "popularity", "ranking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}