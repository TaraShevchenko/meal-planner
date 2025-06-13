import { api } from '~/shared/api/client';

export const userClientQueries = {
  useGetCurrentUser: () => api.user.getCurrentUser.useQuery(),
  useGetUserWithFamilies: () => api.user.getUserWithFamilies.useQuery(),
};