/**
 * Публичные экспорты для модуля сидинга
 * Используйте эти функции для программного создания данных
 */

export { runMenuSeed } from './menus'

// Переэкспорт типов и утилит
export type { MealType } from '@prisma/client'
export { createMealTime, MEAL_TIMES, getDayName, generateDateRange, logProgress } from './utils'

// Переэкспорт данных (для тестирования или кастомных сидов)
export { INGREDIENT_NAMES, INGREDIENTS } from './data/Ingredients.data'
export { RECIPES } from './data/Recipe.data'
