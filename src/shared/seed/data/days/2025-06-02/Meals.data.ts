import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { RECIPE_NAMES } from '../../Recipe.data'
import { UNPLANNED_MEAL_NAMES } from '../../UnplannedMeals.data'

export const MEALS: Meal[] = [
    {
        type: 'breakfast',
        mealTime: '11:45',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 80 },
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 120 },
        ],
        recipes: [{ recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 100 }],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '17:00',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 60 },
            { ingredientName: INGREDIENT_NAMES.KETCHUP, quantity: 20 },
        ],
        recipes: [
            { recipeName: RECIPE_NAMES.CHICKEN_FILLET_IN_SAUCE, grams: 100 },
            { recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 100 },
        ],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '20:30',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 90 },
            { ingredientName: INGREDIENT_NAMES.COCKTAIL_SAUCE, quantity: 20 },
        ],
        recipes: [
            { recipeName: RECIPE_NAMES.CHICKEN_FILLET_IN_SAUCE, grams: 120 },
            { recipeName: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER, grams: 100 },
        ],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '15:45',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.GLAZED_CURD_BAR, quantity: 60 }],
        recipes: [],
        unplannedMeals: [{ unplannedMealName: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_COLD_COFFEE, servings: 350 }],
    },
]

export const PLAN = {
    date: '2025-06-02',
    meals: MEALS,
}
