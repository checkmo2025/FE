import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNav from "@/components/layout/BottomNav";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { HeaderTitleProvider } from "@/contexts/HeaderTitleContext";
import Providers from "@/app/providers";
import GlobalLoginModal from "@/components/base-ui/Login/GlobalLoginModal";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | 책모",
    default: "책모",
  },
  description: "함께 읽고, 나누고, 성장하는 독서 모임 플랫폼 책모",
  openGraph: {
    title: "책모",
    description: "함께 읽고, 나누고, 성장하는 독서 모임 플랫폼 책모",
    url: "https://www.checkmo.co.kr",
    siteName: "책모",
    locale: "ko_KR",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-[70px] t:pb-0`}
      >
        <Providers>
          <AuthProvider>
            <HeaderTitleProvider>
              {children}
              <BottomNav />
              <GlobalLoginModal />
              <Toaster position="top-center" />
            </HeaderTitleProvider>
          </AuthProvider>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
