import { api } from '~/shared/api/server';

export const ingredientQueries = {
  getAll: () => api.ingredient.getAll(),
  getById: (id: string) => api.ingredient.getById({ id }),
  searchByName: (query: string) => api.ingredient.searchByName({ name: query }),
  getByCategory: (category: string) => api.ingredient.getByCategory({ category }),
};