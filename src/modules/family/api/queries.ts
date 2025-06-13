import { api } from '~/shared/api/server';

export const familyQueries = {
  getUserFamilies: () => api.family.getUserFamilies(),
  getFamilyById: (familyId: string) => api.family.getFamilyById({ id: familyId }),
  getFamilyWithMembers: (familyId: string) => api.family.getFamilyWithMembers({ familyId }),
};