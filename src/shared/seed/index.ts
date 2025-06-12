import { PrismaClient } from '@prisma/client'

import { INGREDIENTS } from './data/Ingredients.data'
import { RECIPES } from './data/Recipe.data'
import { UNPLANNED_MEALS } from './data/UnplannedMeals.data'

const prisma = new PrismaClient()

async function seedIngredients() {
    console.log('🥕 Seeding ingredients...')

    const names = INGREDIENTS.map((ing) => ing.name)
    const uniqueNames = new Set(names)
    if (names.length !== uniqueNames.size) {
        console.warn('⚠️ Duplicate ingredient names found in data!')
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
        console.warn('Duplicates:', [...new Set(duplicates)])
    }

    for (const ingredient of INGREDIENTS) {
        await prisma.ingredients.upsert({
            where: { name: ingredient.name },
            update: ingredient,
            create: ingredient,
        })
    }

    console.log(`✅ Ingredients seeded successfully! Processed ${INGREDIENTS.length} ingredients.`)
}

async function seedRecipes() {
    console.log('🍳 Seeding recipes...')

    for (const recipe of RECIPES) {
        const createdRecipe = await prisma.recipe.upsert({
            where: { name: recipe.name },
            update: { name: recipe.name },
            create: { name: recipe.name },
        })

        await prisma.recipeToIngredients.deleteMany({
            where: { recipeId: createdRecipe.id },
        })

        for (const ingredientData of recipe.ingredients) {
            const ingredient = await prisma.ingredients.findUnique({
                where: { name: ingredientData.ingredientName },
            })

            if (!ingredient) {
                console.error(`❌ Ingredient not found: ${ingredientData.ingredientName}`)
                continue
            }

            await prisma.recipeToIngredients.create({
                data: {
                    quantity: ingredientData.quantity,
                    ingredientId: ingredient.id,
                    recipeId: createdRecipe.id,
                },
            })
        }
    }

    console.log('✅ Recipes seeded successfully')
}

async function seedUnplannedMeals() {
    console.log('🍽️ Seeding unplanned meals...')

    for (const meal of UNPLANNED_MEALS) {
        await prisma.unplannedMeal.upsert({
            where: { name: meal.name },
            update: meal,
            create: meal,
        })
    }

    console.log('✅ Unplanned meals seeded successfully')
}

async function seedDailyPlans(userId?: string) {
    console.log('📅 Seeding daily meal plans...')

    const dailyDates = [
        '2025-06-02',
        '2025-06-03',
        '2025-06-04',
        '2025-06-05',
        '2025-06-06',
        '2025-06-07',
        '2025-06-08',
        '2025-06-09',
        '2025-06-10',
        '2025-06-11',
    ]

    for (const date of dailyDates) {
        console.log(`📆 Seeding daily plan for ${date}...`)

        try {
            const { runDaySeed } = await import('./templates/dayTemplate')
            const { PLAN } = await import(`./data/days/${date}/Meals.data`)

            const dayData = { dayPlan: PLAN }
            await runDaySeed(dayData, userId)

            console.log(`✅ Daily plan for ${date} seeded successfully`)
        } catch (error) {
            console.error(`❌ Failed to seed daily plan for ${date}:`, error)
            throw error
        }
    }

    console.log('✅ All daily meal plans seeded successfully')
}

async function seedAll(userId?: string) {
    console.log('🚀 Starting complete seeding process...')

    try {
        await seedIngredients()
        await seedRecipes()
        await seedUnplannedMeals()
        await seedDailyPlans(userId)

        console.log('🎉 All seeding completed successfully!')
    } catch (error) {
        console.error('❌ Seeding process failed:', error)
        throw error
    }
}

seedAll()
    .catch((e) => {
        console.error('❌ Critical error during seeding:', e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })

export { seedAll, seedIngredients, seedRecipes, seedUnplannedMeals, seedDailyPlans }
