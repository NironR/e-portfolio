import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Portfolio | Your Name",
  description: "A personal e-portfolio showcasing projects, experience, and contact information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-foreground text-background px-3 py-2 rounded">Skip to content</a>
        {/* App Shell */}
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main id="content" className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
