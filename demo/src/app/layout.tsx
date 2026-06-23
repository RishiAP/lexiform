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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Lexiform | Modern React Rich Text Editor",
  description: "A highly polished, ultra-lightweight, headless-compatible drop-in React rich text editor built on Lexical. Made by RishiAP.",
  openGraph: {
    title: "Lexiform | Modern React Rich Text Editor",
    description: "A highly polished, ultra-lightweight drop-in React rich text editor built on Lexical.",
    url: "https://github.com/RishiAP/lexiform",
    siteName: "Lexiform Demo",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Lexiform Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexiform | Modern React Rich Text Editor",
    description: "A highly polished, ultra-lightweight drop-in React rich text editor built on Lexical.",
    images: ["/android-chrome-512x512.png"],
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
