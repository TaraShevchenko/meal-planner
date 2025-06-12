import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { RECIPE_NAMES } from '../../Recipe.data'
import { UNPLANNED_MEAL_NAMES } from '../../UnplannedMeals.data'

export const MEALS: Meal[] = [
    {
        type: 'breakfast',
        mealTime: '12:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.POTATO, quantity: 380 },
            { ingredientName: INGREDIENT_NAMES.SAUSAGES, quantity: 90 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 150 }],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '12:35',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.NESQUIK_DUO_BAR, quantity: 1 },
            { ingredientName: INGREDIENT_NAMES.FIZI_BAR, quantity: 1 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '16:25',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.PERCH_FISH, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.KETCHUP, quantity: 20 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 180 }],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '17:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.NESQUIK_DUO_BAR, quantity: 0.5 },
            { ingredientName: INGREDIENT_NAMES.FIZI_BAR, quantity: 0.5 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '20:20',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.KETCHUP, quantity: 20 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN, quantity: 150 },
        ],
        recipes: [],

        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '22:00',
        ingredients: [],
        recipes: [],
        unplannedMeals: [{ unplannedMealName: UNPLANNED_MEAL_NAMES.CAKE, grams: 150 }],
    },
]

export const PLAN = {
    date: '2025-06-06',
    meals: MEALS,
}
