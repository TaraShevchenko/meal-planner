import type { Meal } from '../../../types'
import { INGREDIENT_NAMES } from '../../Ingredients.data'
import { UNPLANNED_MEAL_NAMES } from '../../UnplannedMeals.data'

export const MEALS: Meal[] = [
    {
        type: 'breakfast',
        mealTime: '10:20',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PASTA, quantity: 75 },
            { ingredientName: INGREDIENT_NAMES.CARROT, quantity: 90 },
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 105 },
            { ingredientName: INGREDIENT_NAMES.CONSERVED_CORN, quantity: 80 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '15:30',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.CHOCOLATE_WAFER_ROCK_AND_ROLL, quantity: 50 }],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'lunch',
        mealTime: '16:30',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PASTA, quantity: 75 },
            { ingredientName: INGREDIENT_NAMES.CARROT, quantity: 80 },
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.CONSERVED_CORN, quantity: 90 },
        ],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'snack',
        mealTime: '17:00',
        ingredients: [{ ingredientName: INGREDIENT_NAMES.CHEESE_CAKE_NEW_YORK, quantity: 130 }],
        recipes: [],
        unplannedMeals: [],
    },
    {
        type: 'dinner',
        mealTime: '21:00',
        ingredients: [],
        recipes: [],
        unplannedMeals: [{ unplannedMealName: UNPLANNED_MEAL_NAMES.SUSHI_TEMPURA_SUSHI_MASTER, grams: 650 }],
    },
]

export const PLAN = {
    date: '2025-06-11',
    meals: MEALS,
}
