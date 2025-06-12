export const UNPLANNED_MEAL_NAMES = {
    CAKE: 'Торт',
    SUSHI_TEMPURA_IKURA: 'Суши темпура (Ikura)',
    SUSHI_TEMPURA_SUSHI_MASTER: 'Суши темпура (Sushi Master)',
    COFFEE_BOSS_HOT_COFFEE: 'Лате горячий (Coffee Boss)',
    COFFEE_BOSS_COLD_COFFEE: 'Лате холодний (Coffee Boss)',
    COOKIE_WITH_NUTS_AND_CHOCOLATE: 'Печиво з горіхами та шоколадом (Coffee Boss)',
    ALMOND_CROISSANT: 'Круассан миндальний (Coffee Boss)',
} as const

type UnplannedMeal = {
    name: string
    calories: number
    protein: number
    fat: number
    carbs: number
}

export const UNPLANNED_MEALS: UnplannedMeal[] = [
    {
        name: UNPLANNED_MEAL_NAMES.CAKE,
        calories: 400,
        protein: 4.4,
        fat: 23.0,
        carbs: 45.2,
    },
    {
        name: UNPLANNED_MEAL_NAMES.SUSHI_TEMPURA_IKURA,
        calories: 200.0,
        protein: 11.48,
        fat: 9.2,
        carbs: 22.69,
    },
    {
        name: UNPLANNED_MEAL_NAMES.SUSHI_TEMPURA_SUSHI_MASTER,
        calories: 269.96,
        protein: 18.26,
        fat: 8.56,
        carbs: 40.92,
    },
    {
        name: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_HOT_COFFEE,
        calories: 43,
        protein: 1.7,
        fat: 2.1,
        carbs: 4.3,
    },
    {
        name: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_COLD_COFFEE,
        calories: 40,
        protein: 1.6,
        fat: 2.0,
        carbs: 4.0,
    },
    {
        name: UNPLANNED_MEAL_NAMES.COOKIE_WITH_NUTS_AND_CHOCOLATE,
        calories: 150,
        protein: 2.0,
        fat: 6.0,
        carbs: 22.0,
    },
    {
        name: UNPLANNED_MEAL_NAMES.ALMOND_CROISSANT,
        calories: 350,
        protein: 8.0,
        fat: 20.0,
        carbs: 35.0,
    },
]

export const UNPLANNED_MEALS_BY_NAMES = UNPLANNED_MEALS.reduce(
    (acc, meal) => {
        acc[meal.name] = meal
        return acc
    },
    {} as Record<string, UnplannedMeal>,
)
