'use server';

export async function scrapeGoogleMaps(url: string) {
    try {
        console.log(`[GoogleMaps] Scraping URL: ${url}`);

        // Strategy: Use Googlebot User-Agent. 
        // Google often serves the "Place" metadata to its own bot for indexing.
        const headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        };

        // 1. Follow Redirect (Short URL -> Long URL)
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: headers,
            next: { revalidate: 0 }
        });

        const finalUrl = response.url;
        console.log(`[GoogleMaps] Final URL: ${finalUrl}`);

        const html = await response.text();
        // console.log(`HTML Preview: ${html.substring(0, 500)}`); // Debug

        // 3. Parse Metadata
        const getMeta = (property: string) => {
            const regex = new RegExp(`<meta property="${property}" content="([^"]+)"`);
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        // Also check itemprop for Google's own schema
        const getItemProp = (prop: string) => {
            const regex = new RegExp(`<meta itemprop="${prop}" content="([^"]+)"`);
            const match = html.match(regex);
            return match ? match[1] : null;
        }

        let title = getMeta('og:title') || getItemProp('name');
        let image = getMeta('og:image') || getItemProp('image');
        let description = getMeta('og:description') || getItemProp('description');

        // Fallback: Check standard <title> tag
        if (!title) {
            const titleMatch = html.match(/<title>([^<]*)<\/title>/);
            if (titleMatch) title = titleMatch[1];
        }

        console.log(`[GoogleMaps] Extracted Title: ${title}`);

        if (!title) {
            console.error("No title found in HTML");
            return { error: '정보를 가져올 수 없습니다. (페이지 제목 없음)' };
        }

        // Clean Title: "Store Name - Google Maps" -> "Store Name"
        let cleanTitle = title
            .replace(/ - Google 지도/g, '')
            .replace(/ - Google Maps/g, '');

        // Check if we just got the generic map page
        if (cleanTitle.trim() === 'Google 지도' || cleanTitle.trim() === 'Google Maps') {
            return { error: '특정 가게 정보를 찾지 못했습니다. (메인 지도 페이지로 리다이렉트됨). 링크를 다시 확인해주세요.' };
        }

        // 4. Extract Name and Address from Title
        // Typical OG Title Format: "Store Name · Address" (separated by Middle Dot)
        let name = cleanTitle;
        let address = '';

        if (cleanTitle.includes('·')) {
            const parts = cleanTitle.split('·');
            name = parts[0].trim();
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
