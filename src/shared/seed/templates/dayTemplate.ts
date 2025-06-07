import { PrismaClient } from '@prisma/client'

import { INGREDIENTS } from '../data/Ingredients.data'
import { RECIPES } from '../data/Recipe.data'
import type { SeedDayData, SeedDayPlan, SeedIngredient, SeedRecipe } from '../types'
import { createMealTime, logProgress } from '../utils'

const prisma = new PrismaClient()

/**
 * Универсальный шаблон сида для любого дня
 * Создает все ингредиенты, рецепты и заполняет меню для указанной даты
 */
async function seedDayTemplate(dayData: SeedDayData, userId: string = '8fa71687-a622-4e68-bf31-0a42d37df994') {
    console.log(`🌟 Начало сида для дня ${dayData.dayPlan.date}`)
    console.log(`👤 Пользователь: ${userId}`)
    console.log(`📦 Общих ингредиентов: ${INGREDIENTS.length}`)
    console.log(`🍳 Общих рецептов: ${RECIPES.length}`)

    try {
        // 1. Создание ингредиентов
        await seedIngredients(INGREDIENTS)

        // 2. Создание рецептов
        await seedRecipes(RECIPES)

        // 3. Создание меню и приемов пищи
        await seedMenu(dayData.dayPlan, userId)

        console.log(`✅ Сид для дня ${dayData.dayPlan.date} успешно завершен!`)
    } catch (error) {
        console.error('❌ Ошибка при выполнении сида:', error)
        throw error
    }
}

/**
 * Создает все ингредиенты из переданных данных
 */
async function seedIngredients(ingredients: SeedIngredient[]) {
    console.log('\n📦 Создание ингредиентов...')

    // Проверяем на дубликаты в данных
    const names = ingredients.map((ing) => ing.name)
    const uniqueNames = new Set(names)
    if (names.length !== uniqueNames.size) {
        console.warn('⚠️  Обнаружены дублирующиеся имена ингредиентов в данных!')
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
        console.warn('Дубликаты:', [...new Set(duplicates)])
    }

    let currentIndex = 0
    for (const ingredient of ingredients) {
        currentIndex++
        logProgress('Ингредиенты', currentIndex, ingredients.length)

        await prisma.ingredients.upsert({
            where: { name: ingredient.name },
            update: {
                calories: ingredient.calories,
                protein: ingredient.protein,
                carbs: ingredient.carbs,
                fat: ingredient.fat,
            },
            create: ingredient,
        })
    }

    console.log(`✅ Обработано ${ingredients.length} ингредиентов`)
}

/**
 * Создает все рецепты из переданных данных
 */
async function seedRecipes(recipes: SeedRecipe[]) {
    console.log('\n🍳 Создание рецептов...')

    let currentIndex = 0
    for (const recipe of recipes) {
        currentIndex++
        logProgress('Рецепты', currentIndex, recipes.length)

        // Проверяем, существует ли рецепт
        const existingRecipe = await prisma.recipe.findFirst({
            where: { name: recipe.name },
        })

        let createdRecipe
        if (existingRecipe) {
            console.log(`   📝 Рецепт уже существует: ${recipe.name}`)
            createdRecipe = existingRecipe
        } else {
            createdRecipe = await prisma.recipe.create({
                data: {
                    name: recipe.name,
                },
            })
            console.log(`   ✨ Создан новый рецепт: ${recipe.name}`)
        }

        // Удаляем старые связи с ингредиентами
        await prisma.recipeToIngredients.deleteMany({
            where: { recipeId: createdRecipe.id },
        })

        // Создаем новые связи с ингредиентами
        for (const ingredientData of recipe.ingredients) {
            const ingredient = await prisma.ingredients.findUnique({
                where: { name: ingredientData.ingredientName },
            })

            if (!ingredient) {
                console.error(`   ❌ Ингредиент не найден: ${ingredientData.ingredientName}`)
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

    console.log(`✅ Обработано ${recipes.length} рецептов`)
}

/**
 * Создает меню и все приемы пищи для дня
 */
async function seedMenu(dayPlan: SeedDayPlan, userId: string) {
    console.log('\n🗓️  Создание меню и приемов пищи...')

    // Удаляем существующее меню на эту дату
    const existingMenu = await prisma.menu.findFirst({
        where: {
            date: new Date(dayPlan.date),
            userId: userId,
        },
        include: {
            meals: true,
        },
    })

    if (existingMenu) {
        // Удаляем все связанные приемы пищи
        await prisma.mealToRecipe.deleteMany({
            where: { mealId: { in: existingMenu.meals.map((meal) => meal.id) } },
        })
        await prisma.mealToIngredients.deleteMany({
            where: { mealId: { in: existingMenu.meals.map((meal) => meal.id) } },
        })
        await prisma.meal.deleteMany({
            where: { menuId: existingMenu.id },
        })
        await prisma.menu.delete({
            where: { id: existingMenu.id },
        })
        console.log(`   🗑️  Удалено существующее меню на ${dayPlan.date}`)
    }

    // Создаем новое меню
    const menu = await prisma.menu.create({
        data: {
            date: new Date(dayPlan.date),
            userId: userId,
        },
    })

    console.log(`   📅 Создано меню на ${dayPlan.date}`)

    // Создаем приемы пищи
    let currentIndex = 0
    for (const mealData of dayPlan.meals) {
        currentIndex++
        logProgress('Приемы пищи', currentIndex, dayPlan.meals.length)

        // Создаем прием пищи
        const meal = await prisma.meal.create({
            data: {
                type: mealData.type,
                mealTime: createMealTime(dayPlan.date, mealData.mealTime),
                menuId: menu.id,
            },
        })

        // Добавляем рецепты
        for (const recipeData of mealData.recipes) {
            const recipe = await prisma.recipe.findFirst({
                where: { name: recipeData.recipeName },
                include: {
                    ingredients: true,
                },
            })

            if (recipe) {
                let servings = recipeData.servings

                // Если указаны граммы, вычисляем количество порций
                if (recipeData.grams && !recipeData.servings) {
                    // Считаем общий вес рецепта из всех ингредиентов
                    const totalWeight = recipe.ingredients.reduce((sum, ing) => sum + ing.quantity, 0)

                    if (totalWeight > 0) {
                        // Рассчитываем долю порции на основе указанных граммов
                        servings = recipeData.grams / totalWeight
                        console.log(
                            `      📏 Рецепт ${recipeData.recipeName}: ${recipeData.grams}г из ${totalWeight}г = ${servings.toFixed(3)} порций`,
                        )
                    } else {
                        console.warn(`      ⚠️  Рецепт ${recipeData.recipeName} имеет нулевой общий вес`)
                        servings = 1 // fallback
                    }
                }

                if (servings !== undefined) {
                    await prisma.mealToRecipe.create({
                        data: {
                            mealId: meal.id,
                            recipeId: recipe.id,
                            servings: servings,
                        },
                    })

                    const portionInfo = recipeData.grams
                        ? `${recipeData.grams}г (${servings.toFixed(3)} порций)`
                        : `${servings} порций`
                    console.log(`      🍽️  Добавлен рецепт: ${recipeData.recipeName} (${portionInfo})`)
                } else {
                    console.warn(`      ⚠️  Для рецепта ${recipeData.recipeName} не указаны ни порции, ни граммы`)
                }
            } else {
                console.warn(`      ⚠️  Рецепт не найден: ${recipeData.recipeName}`)
            }
        }

        // Добавляем ингредиенты
        for (const ingredientData of mealData.ingredients) {
            const ingredient = await prisma.ingredients.findFirst({
                where: { name: ingredientData.ingredientName },
            })

            if (ingredient) {
                await prisma.mealToIngredients.create({
                    data: {
                        mealId: meal.id,
                        ingredientId: ingredient.id,
                        quantity: ingredientData.quantity,
                    },
                })
                console.log(
                    `      🥕 Добавлен ингредиент: ${ingredientData.ingredientName} (${ingredientData.quantity}г)`,
                )
            } else {
                console.warn(`      ⚠️  Ингредиент не найден: ${ingredientData.ingredientName}`)
            }
        }

        const mealTypeNames: Record<typeof mealData.type, string> = {
            breakfast: 'Завтрак',
            lunch: 'Обед',
            dinner: 'Ужин',
            snack: 'Перекус',
        }

        console.log(`   ✅ ${mealTypeNames[mealData.type]} создан`)
    }

    console.log(`✅ Создано ${dayPlan.meals.length} приемов пищи`)
}

/**
 * Экспортируемая функция запуска сида с обработкой ошибок
 */
export async function runDaySeed(dayData: SeedDayData, userId?: string) {
    console.log('⚡ Вход в runDaySeed')

    try {
        console.log('🔄 Проверка подключения к БД...')
        await prisma.$connect()
        console.log('✅ Подключение к БД успешно')

        await seedDayTemplate(dayData, userId)
    } catch (e) {
        console.error('💥 Критическая ошибка при выполнении сида:', e)
        if (e instanceof Error) {
            console.error('Stack trace:', e.stack)
        }
        process.exit(1)
    } finally {
        console.log('🔌 Отключение от БД...')
        await prisma.$disconnect()
    }
}

// Экспорт типов для удобства
export type {
    SeedDayData,
    SeedIngredient,
    SeedRecipe,
    SeedMeal,
    SeedDayPlan,
    SeedMealIngredient,
    SeedMealRecipe,
    SeedRecipeIngredient,
} from '../types'
