import { PrismaClient } from '@prisma/client'

import { INGREDIENTS } from './data/Ingredients.data'

const prisma = new PrismaClient()

async function seedIngredients() {
    console.log('Начало сидинга ингредиентов...')

    for (const ingredient of INGREDIENTS) {
        await prisma.ingredients.create({
            data: ingredient,
        })
    }

    console.log('Сидинг ингредиентов завершен!')
}

seedIngredients()
    .catch((e) => {
        console.error('Ошибка при сидинге ингредиентов:', e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })
