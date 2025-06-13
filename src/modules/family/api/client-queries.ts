import { api } from '~/shared/api/client';

export const familyClientQueries = {
  useGetUserFamilies: () => api.family.getUserFamilies.useQuery(),
  useGetFamilyById: (familyId: string) => api.family.getFamilyById.useQuery({ id: familyId }),
  useGetFamilyWithMembers: (familyId: string) => api.family.getFamilyWithMembers.useQuery({ familyId }),
};