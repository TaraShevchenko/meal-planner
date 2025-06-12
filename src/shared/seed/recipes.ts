import { PrismaClient } from '@prisma/client'

import { RECIPES } from './data/Recipe.data'

const prisma = new PrismaClient()

async function seedRecipes() {
    console.log('🌱 Seeding recipes...')

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

seedRecipes()
    .catch((e) => {
        console.error('❌ Critical error during recipes seeding:', e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })
