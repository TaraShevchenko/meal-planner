import { PrismaClient } from '@prisma/client'

import { UNPLANNED_MEALS } from './data/UnplannedMeals.data'

const prisma = new PrismaClient()

export async function seedUnplannedMeals() {
    console.log('🌱 Seeding unplanned meals...')

    for (const meal of UNPLANNED_MEALS) {
        await prisma.unplannedMeal.upsert({
            where: { name: meal.name },
            update: meal,
            create: meal,
        })
    }

    console.log('✅ Unplanned meals seeded successfully')
}

seedUnplannedMeals()
    .catch((e) => {
        console.error('❌ Critical error during unplanned meals seeding:', e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })
