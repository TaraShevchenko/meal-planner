import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc';
import { FamilyRole } from '@prisma/client';

export const familyRouter = createTRPCRouter({
  getUserFamilies: protectedProcedure.query(async ({ ctx }) => {
    const familyMembers = await ctx.db.familyMember.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        family: true,
      },
    });

    return familyMembers.map(fm => fm.family);
  }),

  getFamilyById: protectedProcedure
    .input(z.object({ familyId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Проверяем, что пользователь является членом семьи
      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: input.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не являетесь членом этой семьи',
        });
      }

      return ctx.db.family.findUnique({
        where: { id: input.familyId },
      });
    }),

  getFamilyWithMembers: protectedProcedure
    .input(z.object({ familyId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Проверяем доступ
      const familyMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: input.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не являетесь членом этой семьи',
        });
      }

      return ctx.db.family.findUnique({
        where: { id: input.familyId },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    }),

  createFamily: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.family.create({
        data: {
          name: input.name,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: FamilyRole.ADMIN,
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    }),

  updateFamilyMemberGoals: protectedProcedure
    .input(
      z.object({
        familyMemberId: z.string(),
        dailyCalories: z.number().optional(),
        dailyProteins: z.number().optional(),
        dailyFats: z.number().optional(),
        dailyCarbs: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { familyMemberId, ...goals } = input;

      // Проверяем, что пользователь может редактировать цели
      const familyMember = await ctx.db.familyMember.findUnique({
        where: { id: familyMemberId },
        include: { family: true },
      });

      if (!familyMember) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Член семьи не найден',
        });
      }

      // Проверяем права доступа
      const currentUserMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: familyMember.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!currentUserMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Вы не являетесь членом этой семьи',
        });
      }

      // Можно редактировать свои цели или если ты админ
      if (
        familyMember.userId !== ctx.session.user.id &&
        currentUserMember.role !== FamilyRole.ADMIN
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Недостаточно прав для редактирования целей',
        });
      }

      return ctx.db.familyMember.update({
        where: { id: familyMemberId },
        data: goals,
      });
    }),

  inviteMember: protectedProcedure
    .input(
      z.object({
        familyId: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Проверяем, что пользователь - админ семьи
      const adminMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: input.familyId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!adminMember || adminMember.role !== FamilyRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Только администратор может приглашать участников',
        });
      }

      // Ищем пользователя по email
      const invitedUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!invitedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Пользователь с таким email не найден',
        });
      }

      // Проверяем, что пользователь еще не в семье
      const existingMember = await ctx.db.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: input.familyId,
            userId: invitedUser.id,
          },
        },
      });

      if (existingMember) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Пользователь уже является членом семьи',
        });
      }

      return ctx.db.familyMember.create({
        data: {
          familyId: input.familyId,
          userId: invitedUser.id,
          role: FamilyRole.MEMBER,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
    }),
});