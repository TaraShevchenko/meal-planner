import { existsSync } from 'fs'
import { mkdir, readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { pathToFileURL } from 'url'

import { INGREDIENTS_BY_NAMES } from '../data/Ingredients.data'
import { RECIPES_BY_NAMES } from '../data/Recipe.data'
import { UNPLANNED_MEALS_BY_NAMES } from '../data/UnplannedMeals.data'
import type { Meal } from '../types'

interface DayData {
    date: string
    meals: Meal[]
}

interface NutritionData {
    calories: number
    protein: number
    fat: number
    carbs: number
}

interface MealReportItem {
    name: string
    weight: number
    nutrition: NutritionData
}

interface MealReport {
    type: string
    time: string
    items: MealReportItem[]
    total: NutritionData
}

interface DayReport {
    date: string
    dayName: string
    meals: MealReport[]
    totalNutrition: NutritionData
}

const MEAL_TYPE_NAMES = {
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snack: 'Перекус',
} as const

const DAY_NAMES = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ]
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const dayName = DAY_NAMES[date.getDay()]

    return `${dayName} (${day} ${month} ${year})`
}

function calculateNutritionForIngredient(ingredientName: string, quantity: number): NutritionData {
    const ingredient = INGREDIENTS_BY_NAMES[ingredientName]
    if (!ingredient) {
        console.warn(`⚠️  Ингредиент не найден: ${ingredientName}`)
        return { calories: 0, protein: 0, fat: 0, carbs: 0 }
    }

    const multiplier = quantity / 100
    return {
        calories: Math.round(ingredient.calories * multiplier),
        protein: Math.round(ingredient.protein * multiplier * 10) / 10,
        fat: Math.round(ingredient.fat * multiplier * 10) / 10,
        carbs: Math.round(ingredient.carbs * multiplier * 10) / 10,
    }
}

function calculateNutritionForRecipe(
    recipeName: string,
    grams: number,
): { nutrition: NutritionData; totalWeight: number } {
    const recipe = RECIPES_BY_NAMES[recipeName]
    if (!recipe) {
        console.warn(`⚠️  Рецепт не найден: ${recipeName}`)
        return { nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 }, totalWeight: 0 }
    }

    const totalWeight = recipe.ingredients.reduce((sum, ing) => sum + ing.quantity, 0)
    const multiplier = grams / totalWeight

    let totalNutrition: NutritionData = { calories: 0, protein: 0, fat: 0, carbs: 0 }

    for (const ingredient of recipe.ingredients) {
        const ingredientWeight = ingredient.quantity * multiplier
        const nutrition = calculateNutritionForIngredient(ingredient.ingredientName, ingredientWeight)

        totalNutrition.calories += nutrition.calories
        totalNutrition.protein += nutrition.protein
        totalNutrition.fat += nutrition.fat
        totalNutrition.carbs += nutrition.carbs
    }

    return {
        nutrition: {
            calories: Math.round(totalNutrition.calories),
            protein: Math.round(totalNutrition.protein * 10) / 10,
            fat: Math.round(totalNutrition.fat * 10) / 10,
            carbs: Math.round(totalNutrition.carbs * 10) / 10,
        },
        totalWeight: Math.round(totalWeight),
    }
}

function calculateNutritionForUnplannedMeal(
    unplannedMealName: string,
    servings?: number,
    grams?: number,
): NutritionData {
    const unplannedMeal = UNPLANNED_MEALS_BY_NAMES[unplannedMealName]
    if (!unplannedMeal) {
        console.warn(`⚠️  Незапланированное блюдо не найдено: ${unplannedMealName}`)
        return { calories: 0, protein: 0, fat: 0, carbs: 0 }
    }

    let multiplier = 1

    if (grams) {
        // Данные в unplannedMeals указаны на 100г
        multiplier = grams / 100
    } else if (servings) {
        // Для кофе servings это миллилитры, для остального это количество порций
        if (
            unplannedMealName.includes('Coffee Boss') &&
            (unplannedMealName.includes('Лате') || unplannedMealName.includes('coffee'))
        ) {
            // Для кофе: данные на 100мл, servings в мл
            multiplier = servings / 100
        } else {
            // Для остальных продуктов: servings это количество порций (данные указаны на 1 порцию)
            multiplier = servings
        }
    }

    return {
        calories: Math.round(unplannedMeal.calories * multiplier),
        protein: Math.round(unplannedMeal.protein * multiplier * 10) / 10,
        fat: Math.round(unplannedMeal.fat * multiplier * 10) / 10,
        carbs: Math.round(unplannedMeal.carbs * multiplier * 10) / 10,
    }
}

function processMeal(meal: Meal): MealReport {
    const items: MealReportItem[] = []
    let mealTotal: NutritionData = { calories: 0, protein: 0, fat: 0, carbs: 0 }

    for (const ingredient of meal.ingredients) {
        const nutrition = calculateNutritionForIngredient(ingredient.ingredientName, ingredient.quantity)
        items.push({
            name: `${ingredient.ingredientName} ${ingredient.quantity}г`,
            weight: ingredient.quantity,
            nutrition,
        })

        mealTotal.calories += nutrition.calories
        mealTotal.protein += nutrition.protein
        mealTotal.fat += nutrition.fat
        mealTotal.carbs += nutrition.carbs
    }

    for (const recipe of meal.recipes) {
        const { nutrition, totalWeight } = calculateNutritionForRecipe(recipe.recipeName, recipe.grams!)
        const portions = Math.round((recipe.grams! / totalWeight) * 1000) / 1000

        items.push({
            name: `${recipe.recipeName} (${recipe.grams}г)`,
            weight: recipe.grams!,
            nutrition,
        })

        mealTotal.calories += nutrition.calories
        mealTotal.protein += nutrition.protein
        mealTotal.fat += nutrition.fat
        mealTotal.carbs += nutrition.carbs
    }

    if (meal.unplannedMeals) {
        for (const unplannedMeal of meal.unplannedMeals) {
            const nutrition = calculateNutritionForUnplannedMeal(
                unplannedMeal.unplannedMealName,
                unplannedMeal.servings,
                unplannedMeal.grams,
            )

            const weightInfo = unplannedMeal.grams ? `${unplannedMeal.grams}г` : `${unplannedMeal.servings} порций`

            items.push({
                name: `${unplannedMeal.unplannedMealName} (${weightInfo})`,
                weight: unplannedMeal.grams || unplannedMeal.servings || 0,
                nutrition,
            })

            mealTotal.calories += nutrition.calories
            mealTotal.protein += nutrition.protein
            mealTotal.fat += nutrition.fat
            mealTotal.carbs += nutrition.carbs
        }
    }

    return {
        type: MEAL_TYPE_NAMES[meal.type as keyof typeof MEAL_TYPE_NAMES] || meal.type,
        time: meal.mealTime,
        items,
        total: {
            calories: Math.round(mealTotal.calories),
            protein: Math.round(mealTotal.protein * 10) / 10,
            fat: Math.round(mealTotal.fat * 10) / 10,
            carbs: Math.round(mealTotal.carbs * 10) / 10,
        },
    }
}

function generateReportText(report: DayReport): string {
    let text = `${report.dayName}\n\n`

    report.meals.forEach((meal, index) => {
        text += `${index + 1} прием (${meal.type}) - ${meal.time}:\n`

        meal.items.forEach((item) => {
            text += `${item.name} - ${item.nutrition.calories} ккал (Б: ${item.nutrition.protein}г, Ж: ${item.nutrition.fat}г, У: ${item.nutrition.carbs}г)\n`
        })

        text += `Итого за прием: ${meal.total.calories} ккал (Б: ${meal.total.protein}г, Ж: ${meal.total.fat}г, У: ${meal.total.carbs}г)\n\n`
    })

    text += '===============================================\n'
    text += 'ОБЩИЙ ИТОГ ЗА ДЕНЬ:\n'
    text += `Калории: ${report.totalNutrition.calories} ккал\n`
    text += `Белки: ${report.totalNutrition.protein}г\n`
    text += `Жиры: ${report.totalNutrition.fat}г\n`
    text += `Углеводы: ${report.totalNutrition.carbs}г\n`
    text += '==============================================='

    return text
}

async function loadDayData(dayPath: string): Promise<DayData | null> {
    try {
        const mealsPath = join(dayPath, 'Meals.data.ts')
        if (!existsSync(mealsPath)) {
            console.warn(`⚠️  Файл не найден: ${mealsPath}`)
            return null
        }

        const fileUrl = pathToFileURL(mealsPath).href
        const importedModule = await import(fileUrl)
        const plan = importedModule.PLAN

        if (!plan || !plan.date || !plan.meals) {
            console.warn(`⚠️  Некорректная структура данных в ${mealsPath}`)
            return null
        }

        return {
            date: plan.date,
            meals: plan.meals,
        }
    } catch (error) {
        console.error(`❌ Ошибка загрузки данных из ${dayPath}:`, error)
        return null
    }
}

export async function generateReportsForAllDays(): Promise<void> {
    const dataPath = join(process.cwd(), 'src/shared/seed/data')

    try {
        const entries = await readdir(dataPath, { withFileTypes: true })
        const dayDirs = entries
            .filter((entry) => entry.isDirectory() && entry.name.match(/^\d{4}-\d{2}-\d{2}$/))
            .sort((a, b) => a.name.localeCompare(b.name))

        console.log(`📊 Найдено ${dayDirs.length} дней для обработки`)

        for (const dayDir of dayDirs) {
            const dayPath = join(dataPath, dayDir.name)
            const dayData = await loadDayData(dayPath)

            if (!dayData) {
                console.warn(`⚠️  Пропуск дня ${dayDir.name} - нет данных`)
                continue
            }

            console.log(`📅 Обработка дня: ${dayData.date}`)

            const meals = dayData.meals.map(processMeal)

            const totalNutrition: NutritionData = meals.reduce(
                (total, meal) => ({
                    calories: total.calories + meal.total.calories,
                    protein: total.protein + meal.total.protein,
                    fat: total.fat + meal.total.fat,
                    carbs: total.carbs + meal.total.carbs,
                }),
                { calories: 0, protein: 0, fat: 0, carbs: 0 },
            )

            const report: DayReport = {
                date: dayData.date,
                dayName: formatDate(dayData.date),
                meals,
                totalNutrition: {
                    calories: Math.round(totalNutrition.calories),
                    protein: Math.round(totalNutrition.protein * 10) / 10,
                    fat: Math.round(totalNutrition.fat * 10) / 10,
                    carbs: Math.round(totalNutrition.carbs * 10) / 10,
                },
            }

            const reportText = generateReportText(report)

            const reportDir = join(dayPath, 'data')
            if (!existsSync(reportDir)) {
                await mkdir(reportDir, { recursive: true })
            }

            const reportPath = join(reportDir, 'report.txt')
            await writeFile(reportPath, reportText, 'utf-8')

            console.log(`✅ Отчет сохранен: ${reportPath}`)
        }

        console.log(`🎉 Генерация отчетов завершена!`)
    } catch (error) {
        console.error('❌ Ошибка при генерации отчетов:', error)
        throw error
    }
}

export async function generateReportForDay(date: string): Promise<void> {
    const dataPath = join(process.cwd(), 'src/shared/seed/data')
    const dayPath = join(dataPath, date)

    if (!existsSync(dayPath)) {
        throw new Error(`Папка для дня ${date} не найдена: ${dayPath}`)
    }

    const dayData = await loadDayData(dayPath)
    if (!dayData) {
        throw new Error(`Не удалось загрузить данные для дня ${date}`)
    }

    console.log(`📅 Генерация отчета для дня: ${dayData.date}`)

    const meals = dayData.meals.map(processMeal)

    const totalNutrition: NutritionData = meals.reduce(
        (total, meal) => ({
            calories: total.calories + meal.total.calories,
            protein: total.protein + meal.total.protein,
            fat: total.fat + meal.total.fat,
            carbs: total.carbs + meal.total.carbs,
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0 },
    )

    const report: DayReport = {
        date: dayData.date,
        dayName: formatDate(dayData.date),
        meals,
        totalNutrition: {
            calories: Math.round(totalNutrition.calories),
            protein: Math.round(totalNutrition.protein * 10) / 10,
            fat: Math.round(totalNutrition.fat * 10) / 10,
            carbs: Math.round(totalNutrition.carbs * 10) / 10,
        },
    }

    const reportText = generateReportText(report)

    const reportDir = join(dayPath, 'data')
    if (!existsSync(reportDir)) {
        await mkdir(reportDir, { recursive: true })
    }

    const reportPath = join(reportDir, 'report.txt')
    await writeFile(reportPath, reportText, 'utf-8')

    console.log(`✅ Отчет сохранен: ${reportPath}`)
}

async function main() {
    const args = process.argv.slice(2)

    if (args.length === 0) {
        console.log('🚀 Запуск генерации отчетов для всех дней...')
        await generateReportsForAllDays()
    } else {
        const date = args[0]
        if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.error('❌ Некорректный формат даты. Используйте формат YYYY-MM-DD')
            process.exit(1)
        }

        console.log(`🚀 Запуск генерации отчета для дня ${date}...`)
        await generateReportForDay(date)
    }
}

main().catch((error) => {
    console.error('❌ Ошибка при выполнении скрипта:', error)
    process.exit(1)
})
