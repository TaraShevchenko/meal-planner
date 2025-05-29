import { PrismaClient } from '@prisma/client'

import { INGREDIENT_NAMES } from './data/Ingredients.data'
import { MEAL_TIMES, createMealTime, logProgress } from './utils'

const prisma = new PrismaClient()

type MealPlan = {
    day: string
    date: string
    breakfast: string
    lunch: string
    dinner: string
    fruitSnack: string[]
    sweetSnack: string[]
}

const MEAL_PLANS: MealPlan[] = [
    {
        day: 'Понедельник',
        date: '2025-06-01',
        breakfast: 'Омлет із шинкою та салатом',
        lunch: 'Булгур з курячими котлетами',
        dinner: 'Булгур з буряком та олією',
        fruitSnack: [INGREDIENT_NAMES.APPLE, INGREDIENT_NAMES.WALNUTS],
        sweetSnack: [INGREDIENT_NAMES.DARK_CHOCOLATE],
    },
    {
        day: 'Вторник',
        date: '2025-06-02',
        breakfast: 'Сир з медом та сметаною',
        lunch: 'Тушкована картопля з мʼясом',
        dinner: 'Картопляне пюре з салатом',
        fruitSnack: [INGREDIENT_NAMES.BANANA],
        sweetSnack: [INGREDIENT_NAMES.DRIED_FRUITS],
    },
    {
        day: 'Среда',
        date: '2025-06-03',
        breakfast: 'Яйця з овочевим салатом',
        lunch: 'Макарони з куркою',
        dinner: 'Макарони з морквою по-корейськи',
        fruitSnack: [INGREDIENT_NAMES.MANDARIN],
        sweetSnack: [INGREDIENT_NAMES.COTTAGE_CHEESE, INGREDIENT_NAMES.HONEY],
    },
    {
        day: 'Четверг',
        date: '2025-06-04',
        breakfast: 'Яєчня з салатом та хлібом',
        lunch: 'Гречка з курячими крильцями',
        dinner: 'Гречка з квашеною капустою',
        fruitSnack: [INGREDIENT_NAMES.KIWI],
        sweetSnack: [INGREDIENT_NAMES.GRAIN_BAR],
    },
    {
        day: 'Пятница',
        date: '2025-06-05',
        breakfast: 'Омлет із сосисками',
        lunch: 'Локшина з курячими котлетами',
        dinner: 'Локшина з морквою та сиром',
        fruitSnack: [INGREDIENT_NAMES.APPLE, INGREDIENT_NAMES.WALNUTS],
        sweetSnack: [INGREDIENT_NAMES.DARK_CHOC_WITH_NUTS],
    },
    {
        day: 'Суббота',
        date: '2025-06-06',
        breakfast: 'Сир з бананом',
        lunch: 'Рис з тефтелями',
        dinner: 'Рис з буряком та зеленню',
        fruitSnack: [INGREDIENT_NAMES.GRAPES],
        sweetSnack: [INGREDIENT_NAMES.YOGURT, INGREDIENT_NAMES.HONEY],
    },
    {
        day: 'Воскресенье',
        date: '2025-06-07',
        breakfast: 'Яйця з зеленню та хлібом',
        lunch: 'Пюре з курячими крильцями',
        dinner: 'Пюре з буряком та сиром',
        fruitSnack: [INGREDIENT_NAMES.PLUMS],
        sweetSnack: [INGREDIENT_NAMES.OATMEAL_COOKIES],
    },
]

async function seedMenus(userId: string = '8fa71687-a622-4e68-bf31-0a42d37df994') {
    console.log(`Начало сидинга меню для пользователя ${userId}...`)

    let currentIndex = 0
    for (const mealPlan of MEAL_PLANS) {
        currentIndex++
        logProgress('Создание меню', currentIndex, MEAL_PLANS.length)

        // Создаём меню на день
        const menu = await prisma.menu.create({
            data: {
                date: new Date(mealPlan.date),
                userId: userId,
            },
        })

        console.log(`📅 Создано меню на ${mealPlan.day} (${mealPlan.date})`)

        // Создаём завтрак
        const breakfastRecipe = await prisma.recipe.findFirst({
            where: { name: mealPlan.breakfast },
        })

        if (breakfastRecipe) {
            const breakfastMeal = await prisma.meal.create({
                data: {
                    type: 'breakfast',
                    mealTime: createMealTime(mealPlan.date, MEAL_TIMES.breakfast),
                    menuId: menu.id,
                },
            })

            await prisma.mealToRecipe.create({
                data: {
                    mealId: breakfastMeal.id,
                    recipeId: breakfastRecipe.id,
                    servings: 1,
                },
            })
            console.log(`   🌅 Завтрак: ${mealPlan.breakfast}`)
        } else {
            console.warn(`   ⚠️  Рецепт для завтрака не найден: ${mealPlan.breakfast}`)
        }

        // Создаём обед
        const lunchRecipe = await prisma.recipe.findFirst({
            where: { name: mealPlan.lunch },
        })

        if (lunchRecipe) {
            const lunchMeal = await prisma.meal.create({
                data: {
                    type: 'lunch',
                    mealTime: createMealTime(mealPlan.date, MEAL_TIMES.lunch),
                    menuId: menu.id,
                },
            })

            await prisma.mealToRecipe.create({
                data: {
                    mealId: lunchMeal.id,
                    recipeId: lunchRecipe.id,
                    servings: 1,
                },
            })

            // Добавляем сладкий перекус к обеду
            for (const ingredientName of mealPlan.sweetSnack) {
                const ingredient = await prisma.ingredients.findFirst({
                    where: { name: ingredientName },
                })

                if (ingredient) {
                    await prisma.mealToIngredients.create({
                        data: {
                            mealId: lunchMeal.id,
                            ingredientId: ingredient.id,
                            quantity: getIngredientQuantity(ingredientName),
                        },
                    })
                }
            }
            console.log(`   ☀️  Обед: ${mealPlan.lunch} + сладкий перекус`)
        } else {
            console.warn(`   ⚠️  Рецепт для обеда не найден: ${mealPlan.lunch}`)
        }

        // Создаём ужин
        const dinnerRecipe = await prisma.recipe.findFirst({
            where: { name: mealPlan.dinner },
        })

        if (dinnerRecipe) {
            const dinnerMeal = await prisma.meal.create({
                data: {
                    type: 'dinner',
                    mealTime: createMealTime(mealPlan.date, MEAL_TIMES.dinner),
                    menuId: menu.id,
                },
            })

            await prisma.mealToRecipe.create({
                data: {
                    mealId: dinnerMeal.id,
                    recipeId: dinnerRecipe.id,
                    servings: 1,
                },
            })
            console.log(`   🌙 Ужин: ${mealPlan.dinner}`)
        } else {
            console.warn(`   ⚠️  Рецепт для ужина не найден: ${mealPlan.dinner}`)
        }

        // Создаём фруктовый перекус
        const snackMeal = await prisma.meal.create({
            data: {
                type: 'snack',
                mealTime: createMealTime(mealPlan.date, MEAL_TIMES.snack),
                menuId: menu.id,
            },
        })

        let snackItems: string[] = []
        for (const ingredientName of mealPlan.fruitSnack) {
            const ingredient = await prisma.ingredients.findFirst({
                where: { name: ingredientName },
            })

            if (ingredient) {
                await prisma.mealToIngredients.create({
                    data: {
                        mealId: snackMeal.id,
                        ingredientId: ingredient.id,
                        quantity: getIngredientQuantity(ingredientName),
                    },
                })
                snackItems.push(ingredientName)
            }
        }
        console.log(`   🍎 Перекус: ${snackItems.join(', ')}`)
    }

    console.log('\n✅ Сидинг меню завершен!')
}

function getIngredientQuantity(ingredientName: string): number {
    // Определяем количество ингредиентов для перекусов
    const quantities: Record<string, number> = {
        [INGREDIENT_NAMES.APPLE]: 150, // 1 яблоко
        [INGREDIENT_NAMES.WALNUTS]: 25, // горсть орехов
        [INGREDIENT_NAMES.DARK_CHOCOLATE]: 20, // 2-3 дольки
        [INGREDIENT_NAMES.BANANA]: 120, // 1 банан
        [INGREDIENT_NAMES.DRIED_FRUITS]: 30, // 3-4 штуки
        [INGREDIENT_NAMES.MANDARIN]: 100, // 1 мандарин
        [INGREDIENT_NAMES.COTTAGE_CHEESE]: 100, // 100г творога
        [INGREDIENT_NAMES.HONEY]: 5, // 1 ч.л. мёда
        [INGREDIENT_NAMES.KIWI]: 80, // 1 киви
        [INGREDIENT_NAMES.PEAR]: 150, // 1 груша
        [INGREDIENT_NAMES.GRAIN_BAR]: 30, // 1 батончик
        [INGREDIENT_NAMES.DARK_CHOC_WITH_NUTS]: 20, // 2 квадратика
        [INGREDIENT_NAMES.GRAPES]: 100, // горсть винограда
        [INGREDIENT_NAMES.YOGURT]: 150, // 150г йогурта
        [INGREDIENT_NAMES.PLUMS]: 120, // несколько слив
        [INGREDIENT_NAMES.APRICOTS]: 100, // несколько абрикосов
        [INGREDIENT_NAMES.OATMEAL_COOKIES]: 30, // 1-2 печенья
    }

    return quantities[ingredientName] || 50 // дефолтное значение
}

// Функция для запуска сида
export async function runMenuSeed(userId: string) {
    try {
        await seedMenus(userId)
    } catch (e) {
        console.error('Ошибка при сидинге меню:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

runMenuSeed('8fa71687-a622-4e68-bf31-0a42d37df994')
