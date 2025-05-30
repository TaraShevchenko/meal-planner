export interface PieChartData {
    protein: number
    fat: number
    carbs: number
    calories: number
}

export interface PieChartProps {
    data: PieChartData
    size?: number
    className?: string
}
