'use server';

// import { JSDOM } from 'jsdom'; // Wait, I don't have jsdom installed. Using regex is safer for no-install.

export async function scrapeInstagram(url: string) {
    if (!url.includes('instagram.com')) {
        return { error: '유효한 인스타그램 URL이 아닙니다.' };
    }

    try {
        // Mock User-Agent to looks like a bot that is allowed to see OG tags (Facebook/Twitter bot)
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            },
            next: { revalidate: 60 } // Cache for a bit
        });

        const html = await response.text();

        // Simple Regex for OG Tags
        const getMeta = (property: string) => {
            const regex = new RegExp(`<meta property="${property}" content="([^"]+)"`);
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        const title = getMeta('og:title');
        const description = getMeta('og:description');
        const image = getMeta('og:image');

        if (!title && !description) {
            return { error: '정보를 가져올 수 없습니다. 비공개 계정이거나 차단되었을 수 있습니다.' };
        }

        // Clean up title (Instagram usually puts "Name (@handle) • Instagram photos..." in title)
        // Format: "Name (@handle)" or just "Name"
        let cleanName = title || '';
        if (cleanName.includes('(')) {
            cleanName = cleanName.split('(')[0].trim();
        } else if (cleanName.includes('•')) {
            cleanName = cleanName.split('•')[0].trim();
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
