import { PrismaClient } from '@prisma/client'

import { RECIPES } from './data/Recipe.data'

const prisma = new PrismaClient()

async function seedRecipes() {
    console.log('Начало сидинга рецептов...')

    for (const recipe of RECIPES) {
        const createdRecipe = await prisma.recipe.create({
            data: {
                name: recipe.name,
            },
        })

        for (const ingredientData of recipe.ingredients) {
            const ingredient = await prisma.ingredients.findUnique({
                where: { name: ingredientData.ingredientName },
            })

            if (!ingredient) {
                console.error(`Ингредиент не найден: ${ingredientData.ingredientName}`)
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

    console.log('Сидинг рецептов завершен!')
}

seedRecipes()
    .catch((e) => {
        console.error('Ошибка при сидинге рецептов:', e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })
