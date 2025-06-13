import type { Ingredient as PrismaIngredient } from '@prisma/client';

export type Ingredient = PrismaIngredient;

export type CreateIngredientInput = {
  name: string;
  category?: string;
  defaultUnit?: string;
  caloriesPer100g: number;
  proteinsPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
};

export type NutritionInfo = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};

export type IngredientWithAmount = {
  ingredient: Ingredient;
  amount: number;
  unit: string;
};