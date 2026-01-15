import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "K-Night Shinjuku | 도쿄바 신주쿠 걸즈바 - 한국어 가능",
  description: "도쿄 신주쿠, 신오오쿠보 지역의 한국어 가능한 걸즈바와 인기 바를 찾아보세요. 도쿄 여행의 밤을 책임질 K-Night 추천 명소.",
  keywords: ["도쿄바", "신주쿠 바", "걸즈바", "도쿄 걸즈바", "한국어 가능 바", "한국어 가능 걸즈바", "신주쿠", "신오오쿠보", "도쿄 술집", "걸즈바 추천"],
  openGraph: {
    title: "K-Night Shinjuku | 도쿄바 신주쿠 걸즈바",
    description: "도쿄 거주 14년차 개발자가 추천하는 신주쿠, 신오오쿠보 한국어 가능 걸즈바 & 바 가이드.",
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
        className={`${inter.className} antialiased pb-20`}
      >
        {children}
        <BottomNav />
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
