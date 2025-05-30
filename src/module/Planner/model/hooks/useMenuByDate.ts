import { api } from 'shared/lib/trpc/client'

export function useMenuByDate(date: string) {
    const query = api.planner.getMenuByDate.useQuery(
        { date },
        {
            staleTime: 1000 * 60 * 5, // 5 минут
            refetchOnWindowFocus: false,
        },
    )

    return {
        menu: query.data?.data.menu || null,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    }
}
