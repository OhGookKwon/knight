export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "K-Night Shinjuku",
        "description": "일본 15년 거주 현지인이 소개하는 신주쿠 밤문화 가이드",
        "url": "https://www.k-night.com",
        "image": "https://www.k-night.com/og-image.jpg",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Shinjuku",
            "addressRegion": "Tokyo",
            "addressCountry": "JP"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 35.6938,
            "longitude": 139.7034
        },
        "founder": {
            "@type": "Person",
            "name": "15-Year Local Expert",
            "description": "Expert in Shinjuku nightlife with 15 years of residency."
        },
        "priceRange": "$$"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
