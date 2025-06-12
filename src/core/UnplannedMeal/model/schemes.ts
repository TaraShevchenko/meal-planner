import { z } from 'zod'

export const createUnplannedMealSchema = z.object({
    name: z.string().min(1, 'Название обязательно').max(100, 'Название слишком длинное'),
    calories: z.number().min(0, 'Калории не могут быть отрицательными'),
    protein: z.number().min(0, 'Белки не могут быть отрицательными'),
    carbs: z.number().min(0, 'Углеводы не могут быть отрицательными'),
    fat: z.number().min(0, 'Жиры не могут быть отрицательными'),
})

export const updateUnplannedMealSchema = z.object({
    id: z.string().uuid('Некорректный ID'),
    name: z.string().min(1, 'Название обязательно').max(100, 'Название слишком длинное').optional(),
    calories: z.number().min(0, 'Калории не могут быть отрицательными').optional(),
    protein: z.number().min(0, 'Белки не могут быть отрицательными').optional(),
    carbs: z.number().min(0, 'Углеводы не могут быть отрицательными').optional(),
    fat: z.number().min(0, 'Жиры не могут быть отрицательными').optional(),
})

export const deleteUnplannedMealSchema = z.object({
    id: z.string().uuid('Некорректный ID'),
})

export const getUnplannedMealByIdSchema = z.object({
    id: z.string().uuid('Некорректный ID'),
})

export const addUnplannedMealToMealSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата должна быть в формате YYYY-MM-DD'),
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    unplannedMealId: z.string().uuid('Некорректный ID незапланированного приема пищи'),
    quantity: z.number().positive('Количество должно быть положительным'),
})

export const removeUnplannedMealFromMealSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата должна быть в формате YYYY-MM-DD'),
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    unplannedMealId: z.string().uuid('Некорректный ID незапланированного приема пищи'),
})
