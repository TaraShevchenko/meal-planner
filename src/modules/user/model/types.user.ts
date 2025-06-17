import type { User as PrismaUser } from "@prisma/client";

export type User = PrismaUser;

// TODO: Add family-related types when family functionality is implemented
// export type UserWithFamily = User & {
//   familyMembers: FamilyMember[];
// };
