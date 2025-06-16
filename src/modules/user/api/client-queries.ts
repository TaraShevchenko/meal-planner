import { api } from "~/shared/api/client";

export const userClientQueries = {
  useGetCurrentUser: () => api.user.getCurrentUser.useQuery(),
};
