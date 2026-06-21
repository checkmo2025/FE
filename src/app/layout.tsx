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
import { GoogleTagManager } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.checkmo.co.kr"),
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
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "책모 - 함께 읽고, 나누고, 성장하는 독서 모임 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon",
  },
  verification: {
    other: {
      "naver-site-verification": "b449f2f0720582940b42ac7ab6b4233b",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
