import { api } from '~/trpc/react';

export const ingredientClientQueries = {
  useGetAll: () => api.ingredient.getAll.useQuery(),
  useGetById: (id: string) => api.ingredient.getById.useQuery({ id }),
  useSearchByName: (query: string) => api.ingredient.searchByName.useQuery({ query }),
  useGetByCategory: (category: string) => api.ingredient.getByCategory.useQuery({ category }),
};