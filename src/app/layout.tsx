import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Import the Analytics component
import { Analytics } from "@vercel/analytics/react";

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
      <body className={inter.className}>
        {children}
        {/* 2. Add the Analytics component here */}
        <Analytics />
      </body>
    </html>
  );
import Navbar from '@/components/Navbar'; // Import the Navbar
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans pt-20"> {/* pt-20 adds space so content isn't hidden under the Navbar */}
        <Navbar /> {/* Place it here */}
        {children}
      </body>
    </html>
  );
}}