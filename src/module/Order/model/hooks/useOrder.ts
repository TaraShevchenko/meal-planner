import { api } from 'shared/lib/trpc/client'

import { type GetOrderByDateRangeInput } from '../schemes'

export function useOrderByDateRange(input: GetOrderByDateRangeInput) {
    return api.order.getOrderByDateRange.useQuery(input, {
        enabled: Boolean(input.dateFrom && input.dateTo),
    })
}
