export const UNPLANNED_MEAL_NAMES = {
    CAKE: 'Торт',
    SUSHI: 'Суши',
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
        calories: 350,
        protein: 5.0,
        fat: 15.0,
        carbs: 50.0,
    },
    {
        name: UNPLANNED_MEAL_NAMES.SUSHI,
        calories: 200,
        protein: 8.0,
        fat: 3.0,
        carbs: 35.0,
    },
    {
        name: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_HOT_COFFEE,
        calories: 180,
        protein: 6.0,
        fat: 8.0,
        carbs: 20.0,
    },
    {
        name: UNPLANNED_MEAL_NAMES.COFFEE_BOSS_COLD_COFFEE,
        calories: 160,
        protein: 5.5,
        fat: 7.0,
        carbs: 18.0,
    },
    {
        name: UNPLANNED_MEAL_NAMES.COOKIE_WITH_NUTS_AND_CHOCOLATE,
        calories: 450,
        protein: 8.0,
        fat: 22.0,
        carbs: 55.0,
    },
    {
        name: UNPLANNED_MEAL_NAMES.ALMOND_CROISSANT,
        calories: 320,
        protein: 7.0,
        fat: 18.0,
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
