import { api } from 'shared/lib/trpc/client'

import { type AddItemToMealData, type RemoveItemFromMealData, type ToggleMealCompletionData } from '../types'

export function usePlanner() {
    const utils = api.useUtils()

    const addItemToMeal = api.planner.addItemToMeal.useMutation({
        onSuccess: () => {
            utils.planner.getMenuByDate.invalidate()
        },
    })

    const removeItemFromMeal = api.planner.removeItemFromMeal.useMutation({
        onSuccess: () => {
            utils.planner.getMenuByDate.invalidate()
        },
    })

    const updateItemQuantity = api.planner.updateItemQuantity.useMutation({
        onSuccess: () => {
            utils.planner.getMenuByDate.invalidate()
        },
    })

    const toggleMealCompletion = api.planner.toggleMealCompletion.useMutation({
        onSuccess: () => {
            utils.planner.getMenuByDate.invalidate()
        },
    })

    const handleAddItem = async (data: AddItemToMealData) => {
        return await addItemToMeal.mutateAsync(data)
    }

    const handleRemoveItem = async (data: RemoveItemFromMealData) => {
        return await removeItemFromMeal.mutateAsync(data)
    }

    const handleUpdateQuantity = async (data: AddItemToMealData) => {
        return await updateItemQuantity.mutateAsync(data)
    }

    const handleToggleMealCompletion = async (data: ToggleMealCompletionData) => {
        return await toggleMealCompletion.mutateAsync(data)
    }

    return {
        addItem: {
            mutate: handleAddItem,
            isLoading: addItemToMeal.isPending,
            error: addItemToMeal.error,
        },
        removeItem: {
            mutate: handleRemoveItem,
            isLoading: removeItemFromMeal.isPending,
            error: removeItemFromMeal.error,
        },
        updateQuantity: {
            mutate: handleUpdateQuantity,
            isLoading: updateItemQuantity.isPending,
            error: updateItemQuantity.error,
        },
        toggleMealCompletion: {
            mutate: handleToggleMealCompletion,
            isLoading: toggleMealCompletion.isPending,
            error: toggleMealCompletion.error,
        },
    }
}
