import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { RECIPE_NAMES } from '../../Recipe.data'
import { UNPLANNED_MEAL_NAMES } from '../../UnplannedMeals.data'

export const MEALS: Meal[] = [
    {
        type: 'snack',
        mealTime: '10:00',
        ingredients: [],
        recipes: [],
        unplannedMeals: [{ unplannedMealName: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_HOT_COFFEE, servings: 250 }],
    },
    {
        type: 'breakfast',
        mealTime: '11:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 80 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN, quantity: 120 },
            { ingredientName: INGREDIENT_NAMES.KETCHUP, quantity: 20 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 120 }],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '14:00',
        ingredients: [],
        recipes: [],
        unplannedMeals: [
            { unplannedMealName: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_COLD_COFFEE, servings: 350 },
            { unplannedMealName: UNPLANNED_MEAL_NAMES.ALMOND_CROISSANT, servings: 1 },
        ],
    },
    {
        type: 'lunch',
        mealTime: '16:00',
        ingredients: [],
        recipes: [],
        unplannedMeals: [{ unplannedMealName: UNPLANNED_MEAL_NAMES.SUSHI_TEMPURA_IKURA, grams: 450 }],
    },
    {
        type: 'snack',
        mealTime: '20:00',
        ingredients: [],
        recipes: [],
        unplannedMeals: [{ unplannedMealName: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_HOT_COFFEE, servings: 250 }],
    },
    {
        type: 'dinner',
        mealTime: '21:20',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 120 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 150 }],
        unplannedMeals: [],
    },
]

export const PLAN = {
    date: '2025-06-07',
    meals: MEALS,
}
