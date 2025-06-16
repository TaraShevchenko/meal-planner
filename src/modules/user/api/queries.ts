import { api } from "~/shared/api/server";

export const userQueries = {
  getCurrentUser: () => api.user.getCurrentUser(),
};
