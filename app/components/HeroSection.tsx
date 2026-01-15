'use client';

import Image from "next/image";

export default function HeroSection() {
    return (
        <div className="relative w-full h-[300px] rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/10 group">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-bg-v2.png"
                    alt="Shinjuku Night"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
                <div className="space-y-2 animate-fade-in-up">
                    <span className="inline-block px-3 py-1 bg-pink-600/90 text-white text-[10px] font-bold rounded-full mb-2 backdrop-blur-md shadow-lg shadow-pink-600/20 border border-pink-400/30">
                        K-NIGHT OPEN ✨
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                        신주쿠의 밤놀이,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                            한국어로 통하다
                        </span>
                    </h1>
                    <p className="text-gray-300 text-sm font-medium opacity-90 max-w-[80%]">
                        도쿄거주 15년차 "일본어는 못하지만 신주쿠 놀만한곳 어디없어?에 대답하기 귀찮아서 만든 서비스
                    </p>
                </div>
            </div>
        </div>
    );
}
