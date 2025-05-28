import { createTRPCRouter, publicProcedure } from 'shared/lib/trpc/trpc'

export const plannerRouter = createTRPCRouter({
    getIngredients: publicProcedure.query(async ({ ctx }) => {
        const ingredients = await ctx.db.ingredients.findMany({
            orderBy: {
                name: 'asc',
            },
        })

        return {
            status: 200,
            data: {
                ingredients,
            },
        }
    }),

    getRecipes: publicProcedure.query(async ({ ctx }) => {
        const recipes = await ctx.db.recipe.findMany({
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return {
            status: 200,
            data: {
                recipes,
            },
        }
    }),
})
