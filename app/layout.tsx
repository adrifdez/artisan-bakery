import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Artisan Bakery Supply Store | Premium Flours, Bannetons & Ovens",
    template: "%s | Artisan Bakery Store",
  },
  description:
    "Discover premium artisan bakery supplies for professional bakers. Browse organic flours, handcrafted bannetons, and professional ovens. Fast search, smart filters, and real-time inventory.",
  keywords: [
    "artisan bakery supplies",
    "professional baking equipment",
    "organic flour",
    "bread flour",
    "sourdough supplies",
    "banneton baskets",
    "proofing baskets",
    "professional ovens",
    "steam ovens",
    "bakery store",
  ],
  authors: [{ name: "Artisan Bakery Store" }],
  creator: "Artisan Bakery Store",
  publisher: "Artisan Bakery Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://artisan-bakery-store.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://artisan-bakery-store.vercel.app",
    title: "Artisan Bakery Supply Store | Premium Baking Supplies",
    description:
      "Premium bakery supplies for professional bakers. Organic flours, handcrafted bannetons, professional ovens. Fast search and smart filters.",
    siteName: "Artisan Bakery Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Artisan Bakery Store - Premium Baking Supplies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisan Bakery Supply Store | Premium Baking Supplies",
    description:
      "Premium bakery supplies for professional bakers. Organic flours, handcrafted bannetons, professional ovens.",
    images: ["/og-image.jpg"],
    creator: "@artisanbakery",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
