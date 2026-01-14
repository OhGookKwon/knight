
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Attempting to fetch stores with _count...");
    try {
        const stores = await prisma.store.findMany({
            include: {
                _count: {
                    select: { reviews: true }
                }
            }
        });
        console.log("Success!", stores);
    } catch (e) {
        console.error("Error caught:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
