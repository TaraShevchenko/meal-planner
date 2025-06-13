import { calculateNutrition, sumNutrition, scaleNutrition } from '~/modules/ingredient';
import type { RecipeWithIngredients, RecipeNutrition } from '../model/types';

/**
 * Рассчитывает общую пищевую ценность рецепта
 */
export function calculateRecipeNutrition(recipe: RecipeWithIngredients): RecipeNutrition {
  const ingredientsWithAmounts = recipe.ingredients.map(ri => ({
    ingredient: ri.ingredient,
    amount: ri.amount,
    unit: ri.unit,
  }));

  const totalNutrition = sumNutrition(ingredientsWithAmounts);
  const perServingNutrition = scaleNutrition(totalNutrition, 1 / recipe.servings);

  return {
    ...totalNutrition,
    perServing: perServingNutrition,
  };
}

/**
 * Масштабирует рецепт на заданное количество порций
 */
export function scaleRecipe(
  recipe: RecipeWithIngredients,
  targetServings: number
): RecipeWithIngredients {
  const scale = targetServings / recipe.servings;
  
  return {
    ...recipe,
    servings: targetServings,
    ingredients: recipe.ingredients.map(ri => ({
      ...ri,
      amount: ri.amount * scale,
    })),
  };
}

/**
 * Рассчитывает пищевую ценность для заданного количества порций рецепта
 */
export function calculateRecipeNutritionForServings(
  recipe: RecipeWithIngredients,
  servings: number
): RecipeNutrition {
  const scaledRecipe = scaleRecipe(recipe, servings);
  return calculateRecipeNutrition(scaledRecipe);
}