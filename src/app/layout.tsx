import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
// 1. Import your Navbar component
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free Course Hub | 400+ Free Courses",
  description: "Find the best free courses across the web in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 2. Added pt-20 to ensure content starts below the fixed navbar */}
      <body className={`${inter.className} pt-20`}>
        {/* 3. Add the Navbar here so it shows on every page */}
        <Navbar />
        
        {children}
        
        <Analytics />
      </body>
    </html>
  );
}