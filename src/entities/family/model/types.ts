import type { Family as PrismaFamily, FamilyMember as PrismaFamilyMember, User } from '@prisma/client';

export type Family = PrismaFamily;

export type FamilyMember = PrismaFamilyMember & {
  user?: User;
};

export type FamilyWithMembers = Family & {
  members: FamilyMember[];
};

export type CreateFamilyInput = {
  name: string;
};

export type UpdateFamilyMemberGoalsInput = {
  familyMemberId: string;
  dailyCalories?: number;
  dailyProteins?: number;
  dailyFats?: number;
  dailyCarbs?: number;
};