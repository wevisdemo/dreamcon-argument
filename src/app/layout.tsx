import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@wevisdemo/ui/styles/index.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`wv-ibmplexlooped`}>{children}</body>
    </html>
  );
}
