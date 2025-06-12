import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { RECIPE_NAMES } from '../../Recipe.data'

export const MEALS: Meal[] = [
    {
        type: 'breakfast',
        mealTime: '10:30',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 140 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.SALAD_WITH_FETA_AND_BEETROOT, grams: 150 }],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '12:00',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.OREO_STRAWBERRY, quantity: 95 }],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '16:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 140 },
        ],
        recipes: [
            { recipeName: RECIPE_NAMES.CHICKEN_IN_SOY_SAUCE, grams: 208.7 },
            { recipeName: RECIPE_NAMES.SALAD_WITH_FETA_AND_BEETROOT, grams: 255 },
        ],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '17:00',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.ICE_CREAM_GRANOLA, quantity: 100 }],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '21:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.DUMPLINGS_WITH_POTATO, quantity: 400 },
            { ingredientName: INGREDIENT_NAMES.SOUR_CREAM, quantity: 100 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
]

export const PLAN = {
    date: '2025-06-09',
    meals: MEALS,
}
