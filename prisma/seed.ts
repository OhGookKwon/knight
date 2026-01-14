import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Users
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: { username: 'admin', password: 'password123', role: 'SUPER_ADMIN' },
    })

    const owner1 = await prisma.user.upsert({
        where: { username: 'owner_bluemoon' },
        update: {},
        create: { username: 'owner_bluemoon', password: 'password123', role: 'OWNER' },
    })

    const owner2 = await prisma.user.upsert({
        where: { username: 'owner_seoul' },
        update: {},
        create: { username: 'owner_seoul', password: 'password123', role: 'OWNER' },
    })

    // Store 1: Blue Moon (Kabukicho)
    await prisma.store.create({
        data: {
            name: 'Blue Moon Bar',
            region: 'KABUKICHO',
            address: 'Kabukicho 1-2-3, Shinjuku',
            mainImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
            description: 'The best K-Pop bar in Kabukicho! Fluent Korean speakers available.',
            isVerified: true,
            isVisible: true,
            likes: 120,

            // New System Fields
            basicCharge: '60min 3000yen',
            openingHours: '19:00 - 05:00',
            systemDescription: 'All-you-can-drink for 60 mins. Extensions available.',
            menuImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80',
            notice: 'Open all night during weekends!',

            ownerId: owner1.id,
            staffs: {
                create: [
                    {
                        name: 'Minho', age: 24, language: 'Korean, Japanese', koreanLevel: 5,
                        styleTags: 'Funny,Cute,Singer', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
                    },
                    {
                        name: 'Kenji', age: 22, language: 'Japanese, English', koreanLevel: 3,
                        styleTags: 'Cool,Tall,Listen', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
                    }
                ]
            },
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80', caption: 'Interior' },
                    { url: 'https://images.unsplash.com/photo-1574096079513-d82599605eb1?auto=format&fit=crop&w=800&q=80', caption: 'Cocktails' },
                    { url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', caption: 'Vibe' },
                ]
            },
            reviews: { create: { rating: 5, content: 'Great atmosphere!', userId: admin.id } }
        },
    })

    // Store 2: Seoul Pocha (Shin-Okubo)
    await prisma.store.create({
        data: {
            name: 'Seoul Pocha',
            region: 'SHIN_OKUBO',
            address: 'Shin-Okubo 2-4-1, Shinjuku',
            mainImage: 'https://images.unsplash.com/photo-1535916707207-353d43d3c280?auto=format&fit=crop&w=800&q=80',
            description: 'Authentic Korean street food and soju! Feels like Itaewon.',
            isVerified: true,
            isVisible: true,
            likes: 45,

            basicCharge: 'Table Charge 500yen',
            openingHours: '17:00 - 02:00',
            systemDescription: 'Order per drink/food. No time limit.',

            ownerId: owner2.id,
            staffs: {
                create: [
                    {
                        name: 'Ji-u', age: 21, language: 'Korean', koreanLevel: 5,
                        styleTags: 'Pretty,Kind,Dancer', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
                    }
                ]
            },
            reviews: { create: { rating: 4, content: 'Spicy food is amazing.', userId: admin.id } }
        },
    })

    console.log("Seeding completed.")
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
