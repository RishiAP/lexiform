import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Lexiform | Modern React Rich Text Editor",
  description: "A highly polished, ultra-lightweight, headless-compatible drop-in React rich text editor built on Lexical. Made by RishiAP.",
  openGraph: {
    title: "Lexiform | Modern React Rich Text Editor",
    description: "A highly polished, ultra-lightweight drop-in React rich text editor built on Lexical.",
    url: "https://github.com/RishiAP/lexiform",
    siteName: "Lexiform Demo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexiform | Modern React Rich Text Editor",
    description: "A highly polished, ultra-lightweight drop-in React rich text editor built on Lexical.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
