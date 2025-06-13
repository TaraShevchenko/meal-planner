import { api } from '~/trpc/react';

export const userClientQueries = {
  useGetCurrentUser: () => api.user.getCurrentUser.useQuery(),
  useGetUserWithFamilies: () => api.user.getUserWithFamilies.useQuery(),
};