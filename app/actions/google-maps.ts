'use server';

export async function scrapeGoogleMaps(url: string) {
    try {
        // 1. Follow Redirect (Short URL -> Long URL)
        // Google Maps Share links (maps.app.goo.gl) redirect to google.com/maps/...
        const response = await fetch(url, {
            method: 'HEAD', // Try HEAD first to get redirect URL efficiently
            redirect: 'manual',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        });

        let finalUrl = response.headers.get('location') || url;

        // If it was a manual redirect, we have the new URL. If not (200 OK), use original.
        // Google sometimes does client-side redirect or 302.
        // Let's just do a GET follow functionality if HEAD didn't give location (or if it was 200).
        if (!finalUrl.includes('google.com/maps')) {
            const getResp = await fetch(url, {
                redirect: 'follow',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                }
            });
            finalUrl = getResp.url;
        }

        console.log("Scraping Final URL:", finalUrl);

        // 2. Fetch HTML content of the Final URL (in Korean to get Korean address)
        const htmlResp = await fetch(finalUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            },
            next: { revalidate: 60 }
        });

        const html = await htmlResp.text();

        // 3. Parse Metadata
        const getMeta = (property: string) => {
            const regex = new RegExp(`<meta property="${property}" content="([^"]+)"`);
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        const title = getMeta('og:title'); // Format: "Store Name · Address" or "Store Name · City"
        const image = getMeta('og:image');
        const description = getMeta('og:description'); // Often contains rating/reviews count

        if (!title) {
            return { error: '정보를 가져올 수 없습니다. 유효한 구글 맵 링크인지 확인해주세요.' };
        }

        // 4. Extract Name and Address from Title
        // Typical Format: "Store Name · Address" (separated by Middle Dot)
        let name = title;
        let address = '';

        if (title.includes('·')) {
            const parts = title.split('·');
            name = parts[0].trim();
            // Join the rest as address (in case address also has dots, though unlikely for middle dot)
            address = parts.slice(1).join('·').trim();
        }

        return {
            success: true,
            data: {
                name,
                address,
                image,
                description,
                originalTitle: title
            }
        };

    } catch (e) {
        console.error("Google Maps Scrape Error:", e);
        return { error: '구글 맵 정보를 가져오는 중 오류가 발생했습니다.' };
    }
}
