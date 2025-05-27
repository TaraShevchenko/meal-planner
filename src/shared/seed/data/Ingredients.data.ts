export const INGREDIENT_NAMES = {
    // Гарниры
    Rice: 'Рис',
    Bulgur: 'Булгур',
    Potato: 'Картопля',
    Noodles: 'Локшина',
    Lentils: 'Чечевиця',
    Pasta: 'Вироби макаронні',
    Buckwheat: 'Гречана крупа',

    // Для салатов
    Salad: 'Салат',
    Onion: 'Цибуля',
    Herbs: 'Зелень',
    Carrot: 'Морква',
    Tomato: 'Помідор',
    Beetroot: 'Буряк',
    Radish: 'Редиска',
    Spinach: 'Шпинат',
    Cucumber: 'Огірок',
    Avocado: 'Авокадо',
    Broccoli: 'Броколі',
    SweetPepper: 'Перець солодкий',
    Mustard: 'Гірчиця «Французька»',
    CannedTuna: 'Тунець консервований',
    KoreanCarrot: 'Морква по-корейськи',
    CannedCorn: 'Кукурудза консервована',
    SauerkrautCabbage: 'Капуста квашена',
    PickledGherkin: 'Корнішон маринований',

    OliveOil: 'Олія оливкова',

    // Молочные продукты
    Milk: 'Молоко',
    SourCream: 'Сметана',
    CottageCheese: 'Творог',
    SoftCheese: "Сир м'який",
    HardCheese: 'Сир твердий',
    CreamCheese: 'Сир вершковий',
    CamembertCheese: 'Сир Камамбер',
    ComoInsalataCheese: "Сир Комо InSalata м'який",

    // Мясо и яйца
    ChickenEgg: 'Яйце куряче',
    QuailEgg: 'Яйця перепелині',
    Ham: 'Шинка',
    Cutlet: 'Котлета',
    Sausages: 'Сосиски',
    PorkSteak: 'Свинячий стейк',
    ChickenMince: 'Фарш курячий',
    ChickenLeg: 'Куряча гомілка',
    ChickenWings: 'Курячі крилця',
    ChickenFillet: 'Куряче філе',
    ChickenCutlet: 'Котлета куряча',
    ChickenDrumsticks: 'Куряче стегно',
} as const

type Ingredient = {
    name: string
    calories: number
    protein: number
    fat: number
    carbs: number
}

export const INGREDIENTS: Ingredient[] = [
    // Гарниры
    { name: INGREDIENT_NAMES.Rice, calories: 365, protein: 7.1, fat: 0.7, carbs: 78.9 },
    {
        name: INGREDIENT_NAMES.Bulgur,
        calories: 361,
        protein: 12.4,
        fat: 1.3,
        carbs: 75,
    },
    { name: INGREDIENT_NAMES.Potato, calories: 77, protein: 2, fat: 0.1, carbs: 17 },
    { name: INGREDIENT_NAMES.Noodles, calories: 138, protein: 4.5, fat: 0.5, carbs: 25 },
    { name: INGREDIENT_NAMES.Lentils, calories: 352, protein: 24, fat: 1.5, carbs: 63.4 },
    {
        name: INGREDIENT_NAMES.Pasta,
        calories: 351,
        protein: 13,
        fat: 1.1,
        carbs: 70.5,
    },
    {
        name: INGREDIENT_NAMES.Buckwheat,
        calories: 364,
        protein: 12.9,
        fat: 3.2,
        carbs: 71,
    },
    {
        name: INGREDIENT_NAMES.OliveOil,
        calories: 884,
        protein: 0,
        fat: 100,
        carbs: 0,
    },

    // Для салатов
    {
        name: INGREDIENT_NAMES.Salad,
        calories: 16,
        protein: 1.47,
        fat: 0.5,
        carbs: 1.37,
    },
    { name: INGREDIENT_NAMES.Onion, calories: 40, protein: 1.1, fat: 0.1, carbs: 9.34 },
    { name: INGREDIENT_NAMES.Herbs, calories: 21, protein: 2.9, fat: 0.4, carbs: 3.3 },
    { name: INGREDIENT_NAMES.Carrot, calories: 41, protein: 0.93, fat: 0.24, carbs: 9.58 },
    {
        name: INGREDIENT_NAMES.Tomato,
        calories: 18,
        protein: 0.95,
        fat: 0.1,
        carbs: 3.9,
    },
    { name: INGREDIENT_NAMES.Beetroot, calories: 43, protein: 1.6, fat: 0.2, carbs: 9.6 },
    { name: INGREDIENT_NAMES.Radish, calories: 16, protein: 0.68, fat: 0.1, carbs: 3.4 },
    { name: INGREDIENT_NAMES.Spinach, calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6 },
    { name: INGREDIENT_NAMES.Cucumber, calories: 15, protein: 0.65, fat: 0.11, carbs: 3.63 },
    { name: INGREDIENT_NAMES.Avocado, calories: 160, protein: 2, fat: 14.7, carbs: 1.8 },
    { name: INGREDIENT_NAMES.Broccoli, calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6 },
    { name: INGREDIENT_NAMES.SweetPepper, calories: 27, protein: 1.3, fat: 0.1, carbs: 5.3 },
    { name: INGREDIENT_NAMES.Mustard, calories: 122, protein: 10, fat: 3.4, carbs: 13 },
    { name: INGREDIENT_NAMES.CannedTuna, calories: 96, protein: 25, fat: 0.6, carbs: 0 },
    { name: INGREDIENT_NAMES.KoreanCarrot, calories: 134, protein: 1.3, fat: 8.2, carbs: 9.7 },
    { name: INGREDIENT_NAMES.CannedCorn, calories: 58, protein: 2.2, fat: 0.4, carbs: 11.2 },
    { name: INGREDIENT_NAMES.SauerkrautCabbage, calories: 19, protein: 0.91, fat: 0.14, carbs: 4.28 },
    { name: INGREDIENT_NAMES.PickledGherkin, calories: 11, protein: 0.8, fat: 0.2, carbs: 1.3 },

    // Молочные продукты
    { name: INGREDIENT_NAMES.Milk, calories: 42, protein: 3.4, fat: 1, carbs: 4.7 },
    { name: INGREDIENT_NAMES.SourCream, calories: 206, protein: 2.8, fat: 20, carbs: 3.2 },
    { name: INGREDIENT_NAMES.CottageCheese, calories: 103, protein: 18, fat: 0.6, carbs: 3.5 },
    { name: INGREDIENT_NAMES.SoftCheese, calories: 224, protein: 8, fat: 20, carbs: 2.9 },
    { name: INGREDIENT_NAMES.HardCheese, calories: 356, protein: 24.9, fat: 28.7, carbs: 0.3 },
    { name: INGREDIENT_NAMES.CreamCheese, calories: 342, protein: 5.1, fat: 34.9, carbs: 3.5 },
    { name: INGREDIENT_NAMES.CamembertCheese, calories: 335, protein: 22, fat: 27, carbs: 1 },
    { name: INGREDIENT_NAMES.ComoInsalataCheese, calories: 224, protein: 8, fat: 20, carbs: 2.9 },

    // Мясо и яйца
    { name: INGREDIENT_NAMES.ChickenEgg, calories: 159, protein: 13, fat: 11.5, carbs: 0.9 },
    { name: INGREDIENT_NAMES.QuailEgg, calories: 168, protein: 11.9, fat: 13.1, carbs: 0.6 },
    { name: INGREDIENT_NAMES.Ham, calories: 145, protein: 22.6, fat: 4.4, carbs: 0 },
    { name: INGREDIENT_NAMES.Cutlet, calories: 194, protein: 18.2, fat: 12.2, carbs: 0.5 },
    { name: INGREDIENT_NAMES.Sausages, calories: 257, protein: 10.1, fat: 23.2, carbs: 1.6 },
    { name: INGREDIENT_NAMES.PorkSteak, calories: 259, protein: 16, fat: 21, carbs: 0 },
    { name: INGREDIENT_NAMES.ChickenMince, calories: 143, protein: 17.4, fat: 8.1, carbs: 0 },
    { name: INGREDIENT_NAMES.ChickenLeg, calories: 110, protein: 21.6, fat: 2.6, carbs: 0.4 },
    { name: INGREDIENT_NAMES.ChickenWings, calories: 110, protein: 21.6, fat: 2.6, carbs: 0.4 },
    { name: INGREDIENT_NAMES.ChickenFillet, calories: 110, protein: 21.6, fat: 2.6, carbs: 0.4 },
    { name: INGREDIENT_NAMES.ChickenCutlet, calories: 194, protein: 18.2, fat: 12.2, carbs: 0.5 },
    { name: INGREDIENT_NAMES.ChickenDrumsticks, calories: 110, protein: 21.6, fat: 2.6, carbs: 0.4 },
]

export const INGREDIENTS_BY_NAMES = INGREDIENTS.reduce(
    (acc, ingredient) => {
        acc[ingredient.name] = ingredient
        return acc
    },
    {} as Record<string, Ingredient>,
)
