import { api } from '~/trpc/server';

export const familyQueries = {
  getUserFamilies: () => api.family.getUserFamilies(),
  getFamilyById: (familyId: string) => api.family.getFamilyById({ familyId }),
  getFamilyWithMembers: (familyId: string) => api.family.getFamilyWithMembers({ familyId }),
};