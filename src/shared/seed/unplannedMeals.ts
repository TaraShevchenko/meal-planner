import { db } from 'shared/lib/prisma'

import { UNPLANNED_MEALS } from './data/UnplannedMeals.data'

export async function seedUnplannedMeals() {
    console.log('🌱 Seeding unplanned meals...')

    for (const meal of UNPLANNED_MEALS) {
        await db.unplannedMeal.upsert({
            where: { name: meal.name },
            update: meal,
            create: meal,
        })
    }

    console.log('✅ Unplanned meals seeded successfully')
}
