import { api } from '~/trpc/server';

export const userQueries = {
  getCurrentUser: () => api.user.getCurrentUser(),
  getUserWithFamilies: () => api.user.getUserWithFamilies(),
};