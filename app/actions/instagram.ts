'use server';

// import { JSDOM } from 'jsdom'; // Wait, I don't have jsdom installed. Using regex is safer for no-install.

export async function scrapeInstagram(url: string) {
    if (!url.includes('instagram.com')) {
        return { error: '유효한 인스타그램 URL이 아닙니다.' };
    }

    try {
        // Try acting like Googlebot (Smartphone) - often whitelisted for SEO
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            next: { revalidate: 0 } // Don't cache for debugging
        });

        const html = await response.text();

        console.log(`Scraping ${url} - Status: ${response.status} - Length: ${html.length}`);

        // Simple Regex for OG Tags
        const getMeta = (property: string) => {
            const regex = new RegExp(`<meta property="${property}" content="([^"]+)"`);
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        let title = getMeta('og:title');
        let description = getMeta('og:description');
        let image = getMeta('og:image');

        // Fallback: Check standard <title> and <meta name="description">
        if (!title) {
            const titleMatch = html.match(/<title>([^<]*)<\/title>/);
            if (titleMatch) title = titleMatch[1];
        }
        if (!description) {
            const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
            if (descMatch) description = descMatch[1];
        }

        if (!title && !description) {
            console.log("Failed to find tags. HTML preview:", html.substring(0, 500));
            // Check for login wall indicators
            if (html.includes('Login') || html.includes('Instagram')) {
                return { error: '인스타그램이 접속을 차단했습니다. (로그인 페이지 감지됨). 서버 IP 문제일 수 있습니다.' };
            }
            return { error: '정보를 가져올 수 없습니다. 비공개 계정이거나 차단되었습니다.' };
        }

        // Clean up title (Instagram usually puts "Name (@handle) • Instagram photos..." in title)
        // Format: "Name (@handle)" or just "Name"
        let cleanName = title || '';
        // Remove "Canvas" or standard titles if scrape failed gently
        if (cleanName === 'Instagram') cleanName = '';

        if (cleanName.includes('•')) {
            cleanName = cleanName.split('•')[0].trim();
        }

        // Extract Name from "Name (@handle)"
        const nameMatch = cleanName.match(/^(.+?)\s*\(@/);
        if (nameMatch) {
            cleanName = nameMatch[1];
        }

        return {
            success: true,
            data: {
                name: cleanName,
                description: description || '',
                image: image || null
            }
        };

    } catch (e) {
        console.error("Scrape failed", e);
        return { error: '데이터를 가져오는 중 오류가 발생했습니다.' };
    }
}
