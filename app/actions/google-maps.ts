'use server';

export async function scrapeGoogleMaps(url: string) {
    try {
        console.log(`Scraping Google Maps URL: ${url}`);

        // Strategy: Use a Bot User-Agent (Facebook/Twitter). 
        // Google Maps usually expects these bots and serves static HTML with OG tags immediately.
        // Standard Browser UA often gets redirected to a Consent page or dynamic JS loader.
        const headers = {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        };

        // 1. Follow Redirect (Short URL -> Long URL)
        // We use 'follow' automatically now, as manual handling is complex with cookies
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: headers,
            next: { revalidate: 0 }
        });

        const finalUrl = response.url;
        console.log(`Final URL: ${finalUrl}`);

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

        if (!title) {
            console.error("No title found in HTML");
            return { error: '정보를 가져올 수 없습니다. (Google이 봇 접근을 막았거나 페이지 구조가 다릅니다)' };
        }

        // Clean Title: "Store Name - Google Maps" -> "Store Name"
        title = title.replace(/ - Google 지도/g, '').replace(/ - Google Maps/g, '');

        // 4. Extract Name and Address from Title
        // Typical OG Title Format: "Store Name · Address" (separated by Middle Dot)
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
