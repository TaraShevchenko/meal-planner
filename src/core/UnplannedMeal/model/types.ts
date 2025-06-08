import { type Prisma } from '@prisma/client'

export type UnplannedMeal = Prisma.UnplannedMealGetPayload<{}>

export type UnplannedMealWithMeals = Prisma.UnplannedMealGetPayload<{
    include: {
        meals: true
    }
}>

export type CreateUnplannedMealData = {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
}

export type UpdateUnplannedMealData = {
    id: string
    name?: string
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
}

export type UnplannedMealItemData = {
    id: string
    name: string
    calories: number
    protein: number
    fat: number
    carbs: number
}
