import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kooon59.work'

    // Static routes
    const routes = [
        '',
        '/login',
        '/search',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Dynamic routes (Stores)
    const stores = await prisma.store.findMany({
        select: {
            id: true,
            createdAt: true, // or updatedAt if available
        },
        where: {
            isVisible: true,
        }
    })

    const storeRoutes = stores.map((store) => ({
        url: `${baseUrl}/stores/${store.id}`,
        lastModified: store.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...storeRoutes]
}
