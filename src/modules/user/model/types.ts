import type { User as PrismaUser, FamilyMember } from '@prisma/client';

export type User = PrismaUser & {
  familyMembers?: FamilyMember[];
};

export type UserWithFamily = User & {
  familyMembers: (FamilyMember & {
    family: {
      id: string;
      name: string;
    };
  })[];
};