import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Montserrat, Sacramento, Allura, Familjen_Grotesk } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Geometric sans for oversized editorial typography (the "Dakshithaa V" banner).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

// Thin monoline script for the "signed blueprint" signature accent.
const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// A flowing, more cursive signature script for the hero "portfolio" accent.
const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Modern grotesk for the Projects section title (label + big title + subtitle).
const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — Portfolio`,
  description: `${profile.name} | ${profile.subtitle}. ${profile.bio}`,
  keywords: ["portfolio", "computer science", "big data analytics", "machine learning", "data engineering"],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — Portfolio`,
    description: profile.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Portfolio`,
    description: profile.tagline,
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
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} ${montserrat.variable} ${sacramento.variable} ${allura.variable} ${familjenGrotesk.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-[#111B2F] text-[#E8EEFF]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
