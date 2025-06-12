import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { RECIPE_NAMES } from '../../Recipe.data'

export const MEALS: Meal[] = [
    {
        type: 'breakfast',
        mealTime: '09:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PEA_SOUP, quantity: 300 },
            { ingredientName: INGREDIENT_NAMES.BREAD, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.COLD_SAUSAGE, quantity: 30 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '14:00',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 120 }],
        recipes: [{ recipeName: RECIPE_NAMES.CHICKEN_IN_SOUR_CREAM_SAUCE, grams: 427.3 }],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '18:20',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.PASTA, quantity: 75 }],
        recipes: [{ recipeName: RECIPE_NAMES.CHICKEN_IN_SOUR_CREAM_SAUCE, grams: 235 }],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '22:00',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.PASTA, quantity: 75 }],
        recipes: [{ recipeName: RECIPE_NAMES.CHICKEN_IN_SOUR_CREAM_SAUCE, grams: 235 }],
        unplannedMeals: [],
    },
]

export const PLAN = {
    date: '2025-06-10',
    meals: MEALS,
}
