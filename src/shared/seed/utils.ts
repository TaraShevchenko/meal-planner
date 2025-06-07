/**
 * Утилиты для работы с датами и временем в сидах
 */

/**
 * Создает дату для приема пищи в конкретное время
 */
export function createMealTime(date: string, time: string): Date {
    return new Date(`${date}T${time}:00`)
}

/**
 * Генерирует массив дат на указанное количество дней от стартовой даты
 */
export function generateDateRange(startDate: string, days: number): string[] {
    const dates: string[] = []
    const start = new Date(startDate)

    for (let i = 0; i < days; i++) {
        const currentDate = new Date(start)
        currentDate.setDate(start.getDate() + i)
        const dateString = currentDate.toISOString().split('T')[0]
        if (dateString) {
            dates.push(dateString)
        }
    }

    return dates
}

/**
 * Создает временные метки для приемов пищи
 */
export const MEAL_TIMES = {
    breakfast: '08:00',
    lunch: '13:00',
    dinner: '19:00',
    snack: '16:00',
} as const

/**
 * Получает название дня недели на украинском
 */
export function getDayName(date: string): string {
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

    const dayIndex = new Date(date).getDay()
    const dayName = dayNames[dayIndex]
    return dayName || 'Неизвестный день'
}

/**
 * Логирует прогресс выполнения сида
 */
export function logProgress(step: string, current: number, total: number) {
    const percentage = Math.round((current / total) * 100)
    console.log(`${step} ${current}/${total} (${percentage}%)`)
}
