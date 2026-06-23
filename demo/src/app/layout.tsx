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
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/lexiform-icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Lexiform | Modern React Rich Text Editor",
    description: "A highly polished, ultra-lightweight drop-in React rich text editor built on Lexical.",
    url: "https://github.com/RishiAP/lexiform",
    siteName: "Lexiform Demo",
    type: "website",
    images: [
      {
        url: "/lexiform-banner.svg",
        width: 1200,
        height: 630,
        alt: "Lexiform Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexiform | Modern React Rich Text Editor",
    description: "A highly polished, ultra-lightweight drop-in React rich text editor built on Lexical.",
    images: ["/lexiform-banner.svg"],
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
