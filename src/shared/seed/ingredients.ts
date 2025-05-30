import { PrismaClient } from '@prisma/client'

import { INGREDIENTS } from './data/Ingredients.data'

const prisma = new PrismaClient()

async function seedIngredients() {
    console.log('Начало сидинга ингредиентов...')

    // Проверяем на дубликаты в данных
    const names = INGREDIENTS.map((ing) => ing.name)
    const uniqueNames = new Set(names)
    if (names.length !== uniqueNames.size) {
        console.warn('Обнаружены дублирующиеся имена ингредиентов в данных!')
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
        console.warn('Дубликаты:', [...new Set(duplicates)])
    }

    for (const ingredient of INGREDIENTS) {
        await prisma.ingredients.upsert({
            where: { name: ingredient.name },
            update: ingredient,
            create: ingredient,
        })
    }

    console.log(`Сидинг ингредиентов завершен! Обработано ${INGREDIENTS.length} ингредиентов.`)
}

seedIngredients()
    .catch((e) => {
        console.error('Ошибка при сидинге ингредиентов:', e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })
