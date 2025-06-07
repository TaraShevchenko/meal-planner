import { type MealType } from '@prisma/client'

import { type MealTypeConfig } from './types'

export const mealTypesConfig: Record<MealType, MealTypeConfig> = {
    breakfast: {
        type: 'breakfast',
        name: 'Breakfast',
        color: 'bg-orange-500',
        defaultSortOrder: 0,
    },
    lunch: {
        type: 'lunch',
        name: 'Lunch',
        color: 'bg-blue-500',
        defaultSortOrder: 1,
    },
    dinner: {
        type: 'dinner',
        name: 'Dinner',
        color: 'bg-blue-600',
        defaultSortOrder: 2,
    },
    snack: {
        type: 'snack',
        name: 'Snack',
        color: 'bg-purple-500',
        defaultSortOrder: 3,
    },
}

export const getMealTypeConfig = (mealType: MealType): MealTypeConfig => {
    return mealTypesConfig[mealType]
}

export const getAllMealTypes = (): MealTypeConfig[] => {
    return Object.values(mealTypesConfig)
}
