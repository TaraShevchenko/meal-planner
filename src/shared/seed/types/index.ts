import type { Ingredients, MealType } from '@prisma/client'

type MealIngredient = {
    ingredientName: string
    quantity: number
}

type MealRecipe = {
    recipeName: string
    servings?: number
    grams?: number
}

type MealUnplannedMeal = {
    unplannedMealName: string
    servings?: number
    grams?: number
}

export type Meal = {
    type: MealType
    mealTime: string
    ingredients: MealIngredient[]
    recipes: MealRecipe[]
    unplannedMeals: MealUnplannedMeal[]
}

export type SeedIngredient = Omit<Ingredients, 'id'>

export type SeedRecipeIngredient = {
    ingredientName: string
    quantity: number
}

export type SeedRecipe = {
    name: string
    ingredients: SeedRecipeIngredient[]
}

export type SeedMealIngredient = {
    ingredientName: string
    quantity: number
}

export type SeedMealRecipe = {
    recipeName: string
    servings?: number
    grams?: number
}

export type SeedMeal = {
    type: MealType
    mealTime: string
    ingredients: SeedMealIngredient[]
    recipes: SeedMealRecipe[]
}

export type SeedDayPlan = {
    date: string
    meals: SeedMeal[]
}

export interface SeedDayData {
    dayPlan: SeedDayPlan
}

export type { MealType, Ingredients, Recipe } from '@prisma/client'
