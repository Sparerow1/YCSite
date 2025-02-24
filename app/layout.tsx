import type { Metadata } from "next";
import Navbar from "./navbar/navbar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yanheng Chen's Blog",
  description: "Yanheng Chen's Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
      <Navbar />
      {children}</body>
  </html>
  );
}
