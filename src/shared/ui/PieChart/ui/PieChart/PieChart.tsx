import { clsx } from 'clsx'

import { Text } from 'shared/ui/Text'
import { num } from 'shared/utils/num'

import { type PieChartProps } from '../../model/types'

export function PieChart({ data, size = 200, className }: PieChartProps) {
    const { protein, fat, carbs, calories } = data
    const total = protein + fat + carbs

    // Если нет данных, показываем пустую диаграмму
    if (total === 0) {
        return (
            <div className={clsx('flex flex-col items-center', className)}>
                <div
                    className="flex items-center justify-center rounded-full border-8 border-gray-200"
                    style={{ width: size, height: size }}
                >
                    <div className="text-center">
                        <Text text={num(0)} variant="title" />
                        <Text text="kcal" />
                    </div>
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                        <Text text={`Protein ${num(0)}g`} />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                        <Text text={`Fat ${num(0)}g`} />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                        <Text text={`Carbs ${num(0)}g`} />
                    </div>
                </div>
            </div>
        )
    }

    const radius = (size - 20) / 2
    const circumference = 2 * Math.PI * radius
    const center = size / 2

    // Рассчитываем проценты и длины дуг
    const proteinPercent = (protein / total) * 100
    const fatPercent = (fat / total) * 100
    const carbsPercent = (carbs / total) * 100

    const proteinLength = (proteinPercent / 100) * circumference
    const fatLength = (fatPercent / 100) * circumference
    const carbsLength = (carbsPercent / 100) * circumference

    // Смещения для каждого сегмента
    const proteinOffset = 0
    const fatOffset = proteinLength
    const carbsOffset = proteinLength + fatLength

    return (
        <div className={clsx('flex flex-col items-center', className)}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90 transform">
                    {/* Базовый круг */}
                    <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />

                    {/* Белки - синий */}
                    {protein > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="10"
                            strokeDasharray={`${proteinLength} ${circumference}`}
                            strokeDashoffset={-proteinOffset}
                            className="transition-all duration-500"
                        />
                    )}

                    {/* Жиры - желтый */}
                    {fat > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="10"
                            strokeDasharray={`${fatLength} ${circumference}`}
                            strokeDashoffset={-fatOffset}
                            className="transition-all duration-500"
                        />
                    )}

                    {/* Углеводы - зеленый */}
                    {carbs > 0 && (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray={`${carbsLength} ${circumference}`}
                            strokeDashoffset={-carbsOffset}
                            className="transition-all duration-500"
                        />
                    )}
                </svg>

                {/* Центральный текст с калориями */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <Text text={num(calories)} variant="title" />
                        <Text text="kcal" />
                    </div>
                </div>
            </div>

            {/* Легенда */}
            <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <Text text={`Protein ${num(protein)}g`} />
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <Text text={`Fat ${num(fat)}g`} />
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <Text text={`Carbs ${num(carbs)}g`} />
                </div>
            </div>
        </div>
    )
}
