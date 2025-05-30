import { createTRPCRouter, protectedProcedure } from 'shared/lib/trpc/trpc'

import { getOrderByDateRangeSchema } from './schemes'
import { type IngredientOrder } from './types'

export const orderRouter = createTRPCRouter({
    getOrderByDateRange: protectedProcedure.input(getOrderByDateRangeSchema).query(async ({ ctx, input }) => {
        const { dateFrom, dateTo } = input

        const menus = await ctx.db.menu.findMany({
            where: {
                userId: ctx.session.user.id,
                date: {
                    gte: new Date(dateFrom),
                    lte: new Date(dateTo),
                },
            },
            include: {
                meals: {
                    include: {
                        ingredients: {
                            include: {
                                ingredient: true,
                            },
                        },
                        recipes: {
                            include: {
                                recipe: {
                                    include: {
                                        ingredients: {
                                            include: {
                                                ingredient: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        const ingredientMap = new Map<string, IngredientOrder>()

        for (const menu of menus) {
            for (const meal of menu.meals) {
                for (const mealIngredient of meal.ingredients) {
                    const ingredient = mealIngredient.ingredient
                    const key = ingredient.id

                    if (ingredientMap.has(key)) {
                        const existing = ingredientMap.get(key)!
                        existing.totalGrams += mealIngredient.quantity
                    } else {
                        ingredientMap.set(key, {
                            id: ingredient.id,
                            name: ingredient.name,
                            totalGrams: mealIngredient.quantity,
                            carbs: ingredient.carbs,
                            fat: ingredient.fat,
                            protein: ingredient.protein,
                            calories: ingredient.calories,
                        })
                    }
                }

                for (const mealRecipe of meal.recipes) {
                    const recipe = mealRecipe.recipe
                    const servings = mealRecipe.servings

                    for (const recipeIngredient of recipe.ingredients) {
                        const ingredient = recipeIngredient.ingredient
                        const key = ingredient.id
                        const totalQuantity = recipeIngredient.quantity * servings

                        if (ingredientMap.has(key)) {
                            const existing = ingredientMap.get(key)!
                            existing.totalGrams += totalQuantity
                        } else {
                            ingredientMap.set(key, {
                                id: ingredient.id,
                                name: ingredient.name,
                                totalGrams: totalQuantity,
                                carbs: ingredient.carbs,
                                fat: ingredient.fat,
                                protein: ingredient.protein,
                                calories: ingredient.calories,
                            })
                        }
                    }
                }
            }
        }

        const ingredients = Array.from(ingredientMap.values()).sort((a, b) => a.name.localeCompare(b.name))

        return {
            status: 200,
            data: {
                ingredients,
            },
        }
    }),
})
