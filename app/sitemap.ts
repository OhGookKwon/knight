import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Replace this with your actual domain
    const baseUrl = 'https://knight-shinjuku.vercel.app';

    const stores = await prisma.store.findMany({
        where: { isVisible: true },
        select: { id: true, createdAt: true },
    })

    const storeUrls = stores.map((store) => ({
        url: `${baseUrl}/stores/${store.id}`,
        lastModified: store.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...storeUrls,
    ]
}
