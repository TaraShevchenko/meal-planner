import { api } from '~/shared/api/server';

export const userQueries = {
  getCurrentUser: () => api.user.getCurrentUser(),
  getUserWithFamilies: () => api.user.getUserWithFamilies(),
};