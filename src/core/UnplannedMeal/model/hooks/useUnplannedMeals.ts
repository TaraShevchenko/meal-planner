import { api } from 'shared/lib/trpc/client'

export function useUnplannedMeals() {
    const getAll = api.unplannedMeal.getAll.useQuery()
    const create = api.unplannedMeal.create.useMutation({
        onSuccess: () => {
            getAll.refetch()
        },
    })
    const update = api.unplannedMeal.update.useMutation({
        onSuccess: () => {
            getAll.refetch()
        },
    })
    const remove = api.unplannedMeal.delete.useMutation({
        onSuccess: () => {
            getAll.refetch()
        },
    })

    return {
        unplannedMeals: getAll.data?.data?.unplannedMeals ?? [],
        isLoading: getAll.isLoading,
        error: getAll.error,
        create,
        update,
        remove,
        refetch: getAll.refetch,
    }
}
