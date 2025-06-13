export { type Ingredient, type CreateIngredientInput, type NutritionInfo, type IngredientWithAmount } from './model/types';
// For client-side usage, import from './client'
// For server-side usage, import from './server'
// This file exports only shared utilities and types
export { calculateNutrition, sumNutrition, scaleNutrition } from './lib/nutrition';