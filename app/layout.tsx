import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import JsonLd from "./components/JsonLd";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "신주쿠 밤문화 가이드 | 15년 거주 현지인 추천 걸즈바",
  description: "일본 15년 거주 현지인이 소개하는 신주쿠 밤문화 가이드. 2030 한국인 여행객을 위한 안전하고 핫한 걸즈바, 바 추천.",
  keywords: ["신주쿠 밤문화", "도쿄 여행", "신주쿠 바", "걸즈바 추천", "가부키초", "신오오쿠보", "도쿄 현지인 추천", "2030 도쿄 여행", "신주쿠 걸즈바"],
  openGraph: {
    title: "신주쿠 밤문화 가이드 | 15년 거주 현지인 추천 걸즈바",
    description: "일본 15년 거주 현지인이 소개하는 신주쿠 밤문화 가이드. 2030 한국인 여행객을 위한 안전하고 핫한 걸즈바, 바 추천.",
    type: "website",
    locale: "ko_KR",
    siteName: "K-Night Shinjuku",
  },
  verification: {
    google: "pet1OVUuE5c7TPQqC9QcgdgOfDmttMGCp7eqcUB09Cw",
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <JsonLd />
        <div className="mx-auto max-w-[640px] min-h-screen bg-[var(--md-sys-color-background)] shadow-2xl relative pb-20 overflow-x-hidden">
          {children}
          <BottomNav />
        </div>

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3019197254307208"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B45VRJ8G18"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-B45VRJ8G18');
          `}
        </Script>
      </body>
    </html>
  );
}
