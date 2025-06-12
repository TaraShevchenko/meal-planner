import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { RECIPE_NAMES } from '../../Recipe.data'

export const MEALS: Meal[] = [
    {
        type: 'breakfast',
        mealTime: '11:50',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 90 },
            { ingredientName: INGREDIENT_NAMES.CARROT, quantity: 105 },
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 180 },
            { ingredientName: INGREDIENT_NAMES.CHEESE, quantity: 50 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '16:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 110 },
            { ingredientName: INGREDIENT_NAMES.CARROT, quantity: 105 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.CHICKEN_IN_SOY_SAUCE, grams: 341.5 }],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '16:30',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.SIROK_DOLCHE, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.ROSHEN_WAFFLE, quantity: 35 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '22:40',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 80 },
            { ingredientName: INGREDIENT_NAMES.CARROT, quantity: 90 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.CHICKEN_IN_SOY_SAUCE, grams: 189.7 }],
        unplannedMeals: [],
    },
]

export const PLAN = {
    date: '2025-06-08',
    meals: MEALS,
}
