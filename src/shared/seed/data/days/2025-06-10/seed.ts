import { type SeedDayData, runDaySeed } from '../../../templates/dayTemplate'
import { PLAN } from './Meals.data'

const dayData: SeedDayData = {
    dayPlan: PLAN,
}

export async function runDay20250610Seed(userId?: string) {
    console.log('🚀 Запуск сида для дня 2025-06-10...')
    console.log('📊 Данные для сида:')
    console.log(`   - Приемов пищи: ${dayData.dayPlan.meals.length}`)
    console.log(`   - Дата: ${dayData.dayPlan.date}`)

    try {
        await runDaySeed(dayData, userId)
        console.log('🎉 Сид успешно выполнен!')
    } catch (error) {
        console.error('💥 Ошибка в runDay20250610Seed:', error)
        throw error
    }
}

if (import.meta.url.startsWith('file:')) {
    runDay20250610Seed()
        .then(() => {
            console.log('✅ Сид успешно завершен!')
            process.exit(0)
        })
        .catch((error) => {
            console.error('❌ Ошибка выполнения сида:', error)
            process.exit(1)
        })
}
