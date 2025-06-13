import { api } from '~/trpc/react';

export const recipeClientQueries = {
  useGetFamilyRecipes: (familyId: string) => api.recipe.getFamilyRecipes.useQuery({ familyId }),
  useGetRecipeById: (id: string) => api.recipe.getRecipeById.useQuery({ id }),
  useGetRecipeWithIngredients: (id: string) => api.recipe.getRecipeWithIngredients.useQuery({ id }),
  useGetQuickMeals: (familyId: string) => api.recipe.getQuickMeals.useQuery({ familyId }),
  useSearchRecipes: (familyId: string, query: string) => api.recipe.searchRecipes.useQuery({ familyId, query }),
};