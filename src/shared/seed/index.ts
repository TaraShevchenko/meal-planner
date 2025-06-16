// Экспорт основных seed функций
export { seedBaseProductsToDatabase } from "./baseProducts/seed";
export { clearBaseProductsFromDatabase } from "./baseProducts/clear";
export { syncClerkUsersToDatabase } from "./users/seed";
export { clearUsersFromDatabase } from "./users/clear";

// Экспорт данных для использования в других частях приложения
export { INGREDIENTS, INGREDIENT_NAMES } from "./.data/Ingredients.data";
export {
  MEALS_SEED_DATA,
  MEAL_NAMES,
  MEALS_BY_NAMES,
} from "./.data/Meals.data";
export {
  QUICK_MEALS,
  QUICK_MEAL_NAMES,
  QUICK_MEALS_BY_NAMES,
} from "./.data/QuickMeals.data";
