import { z } from 'zod'

export const getOrderByDateRangeSchema = z.object({
    dateFrom: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Неверный формат даты начала',
    }),
    dateTo: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Неверный формат даты окончания',
    }),
})

export type GetOrderByDateRangeInput = z.infer<typeof getOrderByDateRangeSchema>
