import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeStudio } from "@/components/ThemeStudio";
import { AnnouncementBar } from "@/components/AnnouncementBar";

export const metadata: Metadata = {
  title: "LingYun FengShui — Ancient Chinese Metaphysics & Destiny Reading",
  description:
    "LingYun FengShui inherits the orthodox lineage of the Zhengyi Jiulong School. We offer BaZi (Four Pillars), Five Elements and Zodiac readings to help you decode your destiny and harmonize your life.",
  keywords: [
    "FengShui",
    "BaZi",
    "Four Pillars of Destiny",
    "Five Elements",
    "Chinese Zodiac",
    "Horoscope",
    "Taoist Divination",
    "LingYun FengShui",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ThemeProvider>
          <div className="relative min-h-screen">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-mystic-radial" />
            <div className="pointer-events-none fixed inset-0 -z-10 bg-stars opacity-30" />
            <AnnouncementBar />
            <Header />
            <main className="relative">{children}</main>
            <Footer />
            <ThemeStudio />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
