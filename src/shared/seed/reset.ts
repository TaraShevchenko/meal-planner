import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
    console.log('Начало очистки базы данных...')

    try {
        await prisma.menu.deleteMany({})
        console.log('Удалены все меню')

        // Удаление связей
        await prisma.mealToRecipe.deleteMany({})
        await prisma.mealToIngredients.deleteMany({})
        await prisma.recipeToIngredients.deleteMany({})

        await prisma.meal.deleteMany({})
        console.log('Удалены все блюда')

        await prisma.recipe.deleteMany({})
        console.log('Удалены все рецепты')

        await prisma.ingredients.deleteMany({})
        console.log('Удалены все ингредиенты')

        console.log('Очистка базы данных завершена успешно!')
    } catch (error) {
        console.error('Ошибка при очистке базы данных:', error)
        throw error
    }
}

resetDatabase()
    .catch((e) => {
        console.error('Критическая ошибка:', e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })
