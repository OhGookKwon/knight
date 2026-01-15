'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function GoogleAd() {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            if (adRef.current && adRef.current.innerHTML === '') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense Error:", e);
        }
    }, []);

    return (
        <div className="w-full my-6 overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center min-h-[100px]">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client="ca-pub-3019197254307208" // Replace with your actual Publisher ID
                data-ad-slot="8710030407" // TODO: Replace with your actual Ad Slot ID
                data-ad-format="fluid"
                data-layout-key="-fb+5w+4e-db+86"
                data-full-width-responsive="true"
            />
            {/* Placeholder for development */}
            <div className="text-xs text-gray-700 absolute font-mono">ADVERTISEMENT AREA</div>
        </div>
    );
}
