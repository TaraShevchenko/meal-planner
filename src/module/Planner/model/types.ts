import {
    type Ingredients,
    type Meal,
    type MealToIngredients,
    type MealToRecipe,
    type Menu,
    type MealType as PrismaMealType,
    type Recipe,
    type RecipeToIngredients,
} from '@prisma/client'

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

// Menu and Meal Types
export type MealWithDetails = Meal & {
    recipes: (MealToRecipe & {
        recipe: RecipeWithIngredients
    })[]
    ingredients: (MealToIngredients & {
        ingredient: Ingredients
    })[]
}

export type MenuWithMeals = Menu & {
    meals: MealWithDetails[]
}

export interface GetMenuByDateResponse {
    status: number
    data: {
        menu: MenuWithMeals | null
    }
}

export interface CreateOrUpdateMenuResponse {
    status: number
    data: {
        menu: MenuWithMeals
    }
}

export interface AddItemToMealData {
    date: string
    mealType: PrismaMealType
    itemType: 'recipe' | 'ingredient'
    itemId: string
    quantity: number
}

export interface RemoveItemFromMealData {
    date: string
    mealType: PrismaMealType
    itemType: 'recipe' | 'ingredient'
    itemId: string
}

export interface ToggleMealCompletionData {
    date: string
    mealType: PrismaMealType
}
