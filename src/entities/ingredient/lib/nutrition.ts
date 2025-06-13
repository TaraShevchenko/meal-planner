import type { Ingredient, NutritionInfo, IngredientWithAmount } from '../model/types';

/**
 * Конвертирует единицы измерения в граммы
 */
export function convertToGrams(amount: number, unit: string): number {
  const conversions: Record<string, number> = {
    'г': 1,
    'кг': 1000,
    'мл': 1, // Приблизительно для жидкостей
    'л': 1000,
    'ст.л.': 15, // столовая ложка
    'ч.л.': 5,   // чайная ложка
    'стакан': 250,
    'шт': 100,   // средний вес штуки
  };

  return amount * (conversions[unit] ?? 1);
}

/**
 * Рассчитывает пищевую ценность для заданного количества ингредиента
 */
export function calculateNutrition(
  ingredient: Ingredient,
  amount: number,
  unit: string = 'г'
): NutritionInfo {
  const gramsAmount = convertToGrams(amount, unit);
  const ratio = gramsAmount / 100; // Пищевая ценность указана на 100г

  return {
    calories: ingredient.caloriesPer100g * ratio,
    proteins: ingredient.proteinsPer100g * ratio,
    fats: ingredient.fatsPer100g * ratio,
    carbs: ingredient.carbsPer100g * ratio,
  };
}

/**
 * Суммирует пищевую ценность нескольких ингредиентов
 */
export function sumNutrition(ingredients: IngredientWithAmount[]): NutritionInfo {
  return ingredients.reduce(
    (total, { ingredient, amount, unit }) => {
      const nutrition = calculateNutrition(ingredient, amount, unit);
      return {
        calories: total.calories + nutrition.calories,
        proteins: total.proteins + nutrition.proteins,
        fats: total.fats + nutrition.fats,
        carbs: total.carbs + nutrition.carbs,
      };
    },
    { calories: 0, proteins: 0, fats: 0, carbs: 0 }
  );
}

/**
 * Масштабирует пищевую ценность на количество порций
 */
export function scaleNutrition(nutrition: NutritionInfo, scale: number): NutritionInfo {
  return {
    calories: nutrition.calories * scale,
    proteins: nutrition.proteins * scale,
    fats: nutrition.fats * scale,
    carbs: nutrition.carbs * scale,
  };
}