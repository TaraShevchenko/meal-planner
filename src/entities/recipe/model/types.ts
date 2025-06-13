import type { Recipe as PrismaRecipe, RecipeIngredient, Ingredient } from '@prisma/client';
import type { NutritionInfo } from '~/entities/ingredient';

export type Recipe = PrismaRecipe;

export type RecipeIngredientWithDetails = RecipeIngredient & {
  ingredient: Ingredient;
};

export type RecipeWithIngredients = Recipe & {
  ingredients: RecipeIngredientWithDetails[];
};

export type CreateRecipeInput = {
  familyId: string;
  name: string;
  description?: string;
  servings?: number;
  cookingTime?: number;
  instructions?: string;
  isQuickMeal?: boolean;
  ingredients: {
    ingredientId: string;
    amount: number;
    unit: string;
  }[];
};

export type UpdateRecipeInput = {
  id: string;
  name?: string;
  description?: string;
  servings?: number;
  cookingTime?: number;
  instructions?: string;
  isQuickMeal?: boolean;
  ingredients?: {
    ingredientId: string;
    amount: number;
    unit: string;
  }[];
};

export type RecipeNutrition = NutritionInfo & {
  perServing: NutritionInfo;
};