import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNav from "@/components/layout/BottomNav";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { HeaderTitleProvider } from "@/contexts/HeaderTitleContext";
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
    template: "%s | CheckMo", // 하위 페이지에서 제목을 설정하면 "페이지명 | CheckMo"로 표시됨
    default: "CheckMo", // 제목이 없는 페이지의 기본값
  },
  description: "함께 읽고, 나누고, 성장하는 독서 모임 플랫폼 CheckMo",
  openGraph: {
    title: "CheckMo",
    description: "함께 읽고, 나누고, 성장하는 독서 모임 플랫폼 CheckMo",
    url: "https://check-mo-psi.vercel.app",
    siteName: "CheckMo",
    locale: "ko_KR",
    type: "website",
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
        <AuthProvider>
          <HeaderTitleProvider>
            {children}
            <BottomNav />
            <Toaster position="top-center" />
          </HeaderTitleProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
