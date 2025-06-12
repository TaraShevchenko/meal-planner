import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { UNPLANNED_MEAL_NAMES } from '../../UnplannedMeals.data'

export const MEALS: Meal[] = [
    {
        type: 'snack',
        mealTime: '12:00',
        ingredients: [],
        recipes: [],
        unplannedMeals: [
            {
                unplannedMealName: UNPLANNED_MEAL_NAMES.COOKIE_WITH_NUTS_AND_CHOCOLATE,
                servings: 1,
            },
            { unplannedMealName: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_COLD_COFFEE, servings: 350 },
        ],
    },
    {
        type: 'breakfast',
        mealTime: '13:40',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.DUMPLINGS_WITH_POTATO, quantity: 400 },
            { ingredientName: INGREDIENT_NAMES.SOUR_CREAM, quantity: 50 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '16:50',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PASTA, quantity: 250 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN, quantity: 150 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '20:50',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN, quantity: 100 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
]

export const PLAN = {
    date: '2025-06-05',
    meals: MEALS,
}
