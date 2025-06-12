import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { RECIPE_NAMES } from '../../Recipe.data'

export const MEALS: Meal[] = [
    {
        type: 'snack',
        mealTime: '09:45',
        ingredients: [],
        recipes: [{ recipeName: RECIPE_NAMES.COFFEE_IN_A_CEZVE, servings: 1 }],
        unplannedMeals: [],
    },
    {
        type: 'breakfast',
        mealTime: '11:45',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.RICE, quantity: 80 }],
        recipes: [
            { recipeName: RECIPE_NAMES.OMLET, grams: 140 },
            { recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 100 },
        ],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '14:45',
        ingredients: [],
        recipes: [{ recipeName: RECIPE_NAMES.COFFEE_IN_A_CEZVE, servings: 1 }],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '16:30',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.KETCHUP, quantity: 20 },
        ],
        recipes: [
            { recipeName: RECIPE_NAMES.CHICKEN_FILLET_IN_SAUCE, grams: 120 },
            { recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 140 },
        ],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '20:00',
        ingredients: [],
        recipes: [{ recipeName: RECIPE_NAMES.COTTAGE_CHEESE_WITH_SOUR_CREAM_AND_SUGAR, servings: 1 }],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '22:15',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 90 },
            { ingredientName: INGREDIENT_NAMES.HUMMUS, quantity: 20 },
        ],
        recipes: [
            { recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 240 },
            { recipeName: RECIPE_NAMES.CHICKEN_FILLET_IN_SAUCE, grams: 160 },
        ],
        unplannedMeals: [],
    },
]

export const PLAN = {
    date: '2025-06-03',
    meals: MEALS,
}
