import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { RECIPE_NAMES } from '../../Recipe.data'

export const MEALS: Meal[] = [
    {
        type: 'breakfast',
        mealTime: '12:20',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PASTA, quantity: 260 },
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.CHEESE, quantity: 20 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 130 }],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '15:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.NUTS_MIX, quantity: 20 },
            { ingredientName: INGREDIENT_NAMES.TIDBIT_BAR, quantity: 1 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '18:10',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PASTA, quantity: 320 },
            { ingredientName: INGREDIENT_NAMES.SALMON, quantity: 150 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 150 }],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '18:30',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.TIDBIT_BAR, quantity: 1 }],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '22:15',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PASTA, quantity: 240 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.KETCHUP, quantity: 20 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
]

export const PLAN = {
    date: '2025-06-04',
    meals: MEALS,
}
