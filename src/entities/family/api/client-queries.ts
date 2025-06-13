import { api } from '~/trpc/react';

export const familyClientQueries = {
  useGetUserFamilies: () => api.family.getUserFamilies.useQuery(),
  useGetFamilyById: (familyId: string) => api.family.getFamilyById.useQuery({ familyId }),
  useGetFamilyWithMembers: (familyId: string) => api.family.getFamilyWithMembers.useQuery({ familyId }),
};