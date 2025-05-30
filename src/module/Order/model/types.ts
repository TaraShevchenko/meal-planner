export interface IngredientOrder {
    id: string
    name: string
    totalGrams: number
    carbs: number
    fat: number
    protein: number
    calories: number
}

export interface OrderSummary {
    totalWeight: number
    totalCalories: number
    totalItems: number
}

export interface ShopLink {
    name: string
    url: string
    color: 'green' | 'red'
}
