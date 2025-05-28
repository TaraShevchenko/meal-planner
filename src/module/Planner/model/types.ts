import { type Ingredients, type Recipe, type RecipeToIngredients } from '@prisma/client'

export interface MealType {
    id: string
    name: string
    color: string
    items: number
}

export interface PlannerHeaderProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
}

export interface SearchTableProps {
    selectedMeal: string
}

// API Types
export type Ingredient = Ingredients

export type RecipeWithIngredients = Recipe & {
    ingredients: (RecipeToIngredients & {
        ingredient: Ingredients
    })[]
}

export interface GetIngredientsResponse {
    status: number
    data: {
        ingredients: Ingredient[]
    }
}

export interface GetRecipesResponse {
    status: number
    data: {
        recipes: RecipeWithIngredients[]
    }
}
