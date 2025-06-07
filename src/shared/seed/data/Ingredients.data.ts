export const INGREDIENT_NAMES = {
    // 2025-06-02
    BUCKWHEAT: 'Гречка',
    CHIKEN_FILLET: 'Куряче філе',
    KETCHUP: 'Кетчуп',
    COCKTAIL_SAUCE: 'Коктейльный соус',
    BLACK_PEPPER_AND_CARAMEL_SAUCE: 'Соус чорний перець та карамель',
    SALAD_LEAF: 'Салат листовой',
    RADICCHIO_MIX: 'Суміш Радічіо',
    CONSERVED_CORN: 'Кукурудза консервована',
    CUCUMBER: 'Огірок',
    BELL_PEPPER: 'Перець солодкий',
    RADISH: 'Редька',
    AVOCADO: 'Авокадо',
    OLIVE_OIL: 'Оливкова олія',
    SALT: 'Сіль',
    EGGS: 'Яйця',
    MILK: 'Молоко',
    COFFEE_SYRUP: 'Кофейный сироп',
    ESPRESSO: 'Эспрессо',
    GLAZED_CURD_BAR: 'Сирок глазурований',
    // 2025-06-03
    RICE: 'Рис',
    SUGAR: 'Сахар',
    SOUR_CREAM: 'Сметана',
    COTTAGE_CHEESE: 'Творог',
    HUMMUS: 'Хуммус',
    // 2025-06-04
    // 2025-06-05
    // 2025-06-06
    // 2025-06-07
} as const

type Ingredient = {
    name: string
    calories: number
    protein: number
    fat: number
    carbs: number
}

export const INGREDIENTS: Ingredient[] = [
    // 2025-06-02
    { name: INGREDIENT_NAMES.BUCKWHEAT, calories: 330, protein: 12.6, fat: 3.3, carbs: 57.1 },
    { name: INGREDIENT_NAMES.CHIKEN_FILLET, calories: 120, protein: 24, fat: 1.9, carbs: 0.4 },
    { name: INGREDIENT_NAMES.KETCHUP, calories: 100, protein: 1, fat: 0, carbs: 20 },
    { name: INGREDIENT_NAMES.COCKTAIL_SAUCE, calories: 183, protein: 1, fat: 14, carbs: 13 },
    { name: INGREDIENT_NAMES.BLACK_PEPPER_AND_CARAMEL_SAUCE, calories: 120, protein: 2.1, fat: 1, carbs: 27.1 },
    { name: INGREDIENT_NAMES.SALAD_LEAF, calories: 17, protein: 1.2, fat: 0.2, carbs: 2.6 },
    { name: INGREDIENT_NAMES.RADICCHIO_MIX, calories: 23, protein: 1.4, fat: 0.3, carbs: 4.5 },
    { name: INGREDIENT_NAMES.CONSERVED_CORN, calories: 96, protein: 2.4, fat: 1.5, carbs: 17.0 },
    { name: INGREDIENT_NAMES.CUCUMBER, calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6 },
    { name: INGREDIENT_NAMES.BELL_PEPPER, calories: 31, protein: 1.0, fat: 0.3, carbs: 6.0 },
    { name: INGREDIENT_NAMES.RADISH, calories: 16, protein: 0.7, fat: 0.1, carbs: 3.4 },
    { name: INGREDIENT_NAMES.AVOCADO, calories: 160, protein: 2.0, fat: 15.0, carbs: 8.5 },
    { name: INGREDIENT_NAMES.OLIVE_OIL, calories: 884, protein: 0.0, fat: 100.0, carbs: 0.0 },
    { name: INGREDIENT_NAMES.SALT, calories: 0, protein: 0.0, fat: 0.0, carbs: 0.0 },
    { name: INGREDIENT_NAMES.EGGS, calories: 143, protein: 13.0, fat: 10.0, carbs: 1.1 },
    { name: INGREDIENT_NAMES.MILK, calories: 64, protein: 3.28, fat: 3.66, carbs: 4.65 },
    { name: INGREDIENT_NAMES.COFFEE_SYRUP, calories: 254, protein: 0.0, fat: 0.0, carbs: 65.4 },
    { name: INGREDIENT_NAMES.ESPRESSO, calories: 7, protein: 0.0, fat: 0.0, carbs: 1.5 },
    { name: INGREDIENT_NAMES.GLAZED_CURD_BAR, calories: 380, protein: 7.0, fat: 20.0, carbs: 40.0 },
    // 2025-06-03
    { name: INGREDIENT_NAMES.RICE, calories: 330, protein: 7.0, fat: 1.0, carbs: 71.1 },
    { name: INGREDIENT_NAMES.SOUR_CREAM, calories: 114.8, protein: 2.8, fat: 10.0, carbs: 3.4 },
    { name: INGREDIENT_NAMES.COTTAGE_CHEESE, calories: 125.0, protein: 3.6, fat: 5.0, carbs: 16.3 },
    { name: INGREDIENT_NAMES.SUGAR, calories: 374, protein: 0.0, fat: 0.0, carbs: 99.9 },
    { name: INGREDIENT_NAMES.HUMMUS, calories: 233, protein: 7.1, fat: 16.2, carbs: 13.1 },
    // 2025-06-04
    // 2025-06-05
    // 2025-06-06
    // 2025-06-07
]

export const INGREDIENTS_BY_NAMES = INGREDIENTS.reduce(
    (acc, ingredient) => {
        acc[ingredient.name] = ingredient
        return acc
    },
    {} as Record<string, Ingredient>,
)
