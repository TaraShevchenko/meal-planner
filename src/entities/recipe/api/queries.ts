import { api } from '~/trpc/server';

export const recipeQueries = {
  getFamilyRecipes: (familyId: string) => api.recipe.getFamilyRecipes({ familyId }),
  getRecipeById: (id: string) => api.recipe.getRecipeById({ id }),
  getRecipeWithIngredients: (id: string) => api.recipe.getRecipeWithIngredients({ id }),
  getQuickMeals: (familyId: string) => api.recipe.getQuickMeals({ familyId }),
  searchRecipes: (familyId: string, query: string) => api.recipe.searchRecipes({ familyId, query }),
};