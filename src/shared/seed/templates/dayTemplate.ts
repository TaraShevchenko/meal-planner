import { PrismaClient } from '@prisma/client'

import { mealTypesConfig } from 'module/Planner/model/config'

import { INGREDIENTS } from '../data/Ingredients.data'
import { RECIPES } from '../data/Recipe.data'
import type { SeedDayData, SeedDayPlan, SeedIngredient, SeedRecipe } from '../types'
import { createMealTime, logProgress } from '../utils'

const prisma = new PrismaClient()

/**
 * Находит пользователя по имени
 */
async function findUserByName(userName: string) {
    const user = await prisma.user.findFirst({
        where: { name: userName },
    })

    if (!user) {
        throw new Error(
            `❌ Пользователь с именем "${userName}" не найден в базе данных. Создайте пользователя или укажите существующее имя.`,
        )
    }

    console.log(`   👤 Найден пользователь: ${userName} (ID: ${user.id})`)
    return user
}

/**
 * Универсальный шаблон сида для любого дня
 * Создает все ингредиенты, рецепты и заполняет меню для указанной даты
 */
async function seedDayTemplate(dayData: SeedDayData, userName: string = 'Taras Shevchenko') {
    console.log(`🌟 Начало сида для дня ${dayData.dayPlan.date}`)
    console.log(`👤 Поиск пользователя: ${userName}`)
    console.log(`📦 Общих ингредиентов: ${INGREDIENTS.length}`)
    console.log(`🍳 Общих рецептов: ${RECIPES.length}`)

    try {
        // 0. Поиск пользователя
        const user = await findUserByName(userName)

        // 1. Создание ингредиентов
        await seedIngredients(INGREDIENTS)

        // 2. Создание рецептов
        await seedRecipes(RECIPES)

        // 3. Создание меню и приемов пищи
        await seedMenu(dayData.dayPlan, user.id)

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

    // Сортируем приемы пищи по времени для правильного sortOrder при множественных приемах одного типа
    const sortedMeals = [...dayPlan.meals].sort((a, b) => {
        // Сначала по типу (по defaultSortOrder), затем по времени
        const typeA = mealTypesConfig[a.type]?.defaultSortOrder ?? 999
        const typeB = mealTypesConfig[b.type]?.defaultSortOrder ?? 999

        if (typeA !== typeB) {
            return typeA - typeB
        }

        // Если типы одинаковые, сортируем по времени
        const timeA = a.mealTime.replace(':', '')
        const timeB = b.mealTime.replace(':', '')
        return parseInt(timeA) - parseInt(timeB)
    })

    // Создаем приемы пищи
    let currentIndex = 0
    const mealTypeCounters = new Map<string, number>()

    for (const mealData of sortedMeals) {
        currentIndex++
        logProgress('Приемы пищи', currentIndex, sortedMeals.length)

        // Получаем sortOrder для типа приема пищи
        const mealConfig = mealTypesConfig[mealData.type]
        let sortOrder = mealConfig ? mealConfig.defaultSortOrder : 0

        // Если у этого типа уже есть приемы пищи, увеличиваем sortOrder
        const typeKey = mealData.type
        const currentCount = mealTypeCounters.get(typeKey) || 0
        mealTypeCounters.set(typeKey, currentCount + 1)

        // Для множественных приемов одного типа добавляем счетчик
        if (currentCount > 0) {
            sortOrder = sortOrder + currentCount * 0.1 // Добавляем дробную часть для сохранения порядка
        }

        // Создаем прием пищи
        const meal = await prisma.meal.create({
            data: {
                type: mealData.type,
                mealTime: createMealTime(dayPlan.date, mealData.mealTime),
                sortOrder: sortOrder,
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

        console.log(
            `   ✅ ${mealTypeNames[mealData.type]} создан (sortOrder: ${sortOrder}, время: ${mealData.mealTime})`,
        )
    }

    console.log(`✅ Создано ${sortedMeals.length} приемов пищи`)
}

/**
 * Экспортируемая функция запуска сида с обработкой ошибок
 */
export async function runDaySeed(dayData: SeedDayData, userName?: string) {
    console.log('⚡ Вход в runDaySeed')

    try {
        console.log('🔄 Проверка подключения к БД...')
        await prisma.$connect()
        console.log('✅ Подключение к БД успешно')

        await seedDayTemplate(dayData, userName)
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
