export const INGREDIENT_NAMES = {
    // Белки
    CHIKEN_FILLET: 'Куряче філе',
    SALMON: 'Семга',
    PERCH_FISH: 'Окунь морський',
    EGGS: 'Яйця',
    CHEESE: 'Сир',
    FETA_CHEESE: 'Сир фета',
    COLD_SAUSAGE: 'Ковбаса',
    SAUSAGES: 'Сосиски',
    NUTS_MIX: 'Суміш горіхів',

    // Углеводы
    BUCKWHEAT: 'Гречка',
    RICE: 'Рис',
    PASTA: 'Макарони',
    POTATO: 'Картопля',
    FLOUR: 'Борошно',
    BREAD: 'Хліб',
    DUMPLINGS_WITH_POTATO: 'Вареники з картоплею',
    PEA_SOUP: 'Гороховий суп',
    BULGUR: 'Булгур',
    SEMOLINA: 'Крупа манна',
    OATMEAL: 'Крупа вівсяна',

    // Овощи/Клетчатка
    SALAD_LEAF: 'Салат листовой',
    RADICCHIO_MIX: 'Суміш Радічіо',
    CONSERVED_CORN: 'Кукурудза консервована',
    CUCUMBER: 'Огірок',
    BELL_PEPPER: 'Перець солодкий',
    RADISH: 'Редька',
    AVOCADO: 'Авокадо',
    CARROT: 'Морква',
    BEETROOT: 'Буряк',
    GARLIC: 'Часник',
    PICKLED_GINGER: 'Имбирь маринованный',

    // Фрукты/Ягоды
    KIWI: 'Ківі',
    APPLE: 'Яблуко',
    BANANA: 'Банан',
    ORANGE: 'Апельсин',
    PEACH: 'Персик',
    STRAWBERRY: 'Полуниця',
    BLUEBERRY: 'Блакитна ягода',
    RASPBERRY: 'Черниця',
    BLACKBERRY: 'Чорниця',
    GRAPES: 'Виноград',
    PEAR: 'Груша',
    PLUM: 'Слива',

    // Жиры/Молочные/Соусы
    OLIVE_OIL: 'Оливкова олія',
    MILK: 'Молоко',
    SOUR_CREAM: 'Сметана',
    COTTAGE_CHEESE: 'Творог',
    CREAM: 'Вершки',
    BUTTER: 'Вершкове масло',
    KETCHUP: 'Кетчуп',
    COCKTAIL_SAUCE: 'Коктейльный соус',
    BLACK_PEPPER_AND_CARAMEL_SAUCE: 'Соус чорний перець та карамель',
    HUMMUS: 'Хуммус',
    SOY_SAUCE: 'Соєвий соус',

    // Приправы
    SALT: 'Сіль',
    SUGAR: 'Сахар',

    // Сладости
    HONEY: 'Мед',
    GLAZED_CURD_BAR: 'Сирок глазурований',
    SIROK_DOLCHE: 'Сирок Дольче',
    TIDBIT_BAR: 'Батончик Tidbit',
    FIZI_BAR: 'Батончик Fizi',
    NESQUIK_DUO_BAR: 'Батончик Nesquik Duo',
    ROSHEN_WAFFLE: 'Рошен вафелька',
    OREO_STRAWBERRY: 'Орео полуничний',
    ICE_CREAM_GRANOLA: 'Морозиво-гранола',
    CHOCOLATE_WAFER_ROCK_AND_ROLL: 'Вафля в шоколаді "Rock&roll-check"',
    CHEESE_CAKE_NEW_YORK: 'Чизкейк New York',
} as const

type Ingredient = {
    name: string
    calories: number
    protein: number
    fat: number
    carbs: number
}

export const INGREDIENTS: Ingredient[] = [
    // Белки
    /*approved*/ { name: INGREDIENT_NAMES.CHIKEN_FILLET, calories: 120, protein: 24, fat: 1.9, carbs: 0.4 },
    /*-random-*/ { name: INGREDIENT_NAMES.SALMON, calories: 206, protein: 22.0, fat: 12.5, carbs: 0.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.PERCH_FISH, calories: 82, protein: 18.0, fat: 0.9, carbs: 0.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.EGGS, calories: 143, protein: 13.0, fat: 10.0, carbs: 1.1 },
    /*-random-*/ { name: INGREDIENT_NAMES.CHEESE, calories: 350, protein: 25.0, fat: 27.0, carbs: 1.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.FETA_CHEESE, calories: 264, protein: 14.2, fat: 21.3, carbs: 4.1 },
    /*-random-*/ { name: INGREDIENT_NAMES.COLD_SAUSAGE, calories: 301, protein: 13.0, fat: 27.0, carbs: 1.5 },
    /*-random-*/ { name: INGREDIENT_NAMES.SAUSAGES, calories: 257, protein: 12.0, fat: 23.0, carbs: 1.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.NUTS_MIX, calories: 607, protein: 15.0, fat: 54.0, carbs: 13.0 },

    // Углеводы
    /*-random-*/ { name: INGREDIENT_NAMES.BUCKWHEAT, calories: 330, protein: 12.6, fat: 3.3, carbs: 57.1 },
    /*-random-*/ { name: INGREDIENT_NAMES.RICE, calories: 330, protein: 7.0, fat: 1.0, carbs: 71.1 },
    /*-random-*/ { name: INGREDIENT_NAMES.PASTA, calories: 350, protein: 12.0, fat: 1.5, carbs: 70.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.POTATO, calories: 77, protein: 2.0, fat: 0.1, carbs: 17.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.FLOUR, calories: 364, protein: 10.3, fat: 1.1, carbs: 74.9 },
    /*-random-*/ { name: INGREDIENT_NAMES.BREAD, calories: 265, protein: 9.0, fat: 3.2, carbs: 49.0 },
    /*approved*/ { name: INGREDIENT_NAMES.DUMPLINGS_WITH_POTATO, calories: 197.1, protein: 5.5, fat: 3.1, carbs: 36.5 },
    /*-random-*/ { name: INGREDIENT_NAMES.PEA_SOUP, calories: 66, protein: 4.5, fat: 1.4, carbs: 10.4 },
    /*-random-*/ { name: INGREDIENT_NAMES.BULGUR, calories: 330, protein: 12.6, fat: 3.3, carbs: 57.1 },
    /*-random-*/ { name: INGREDIENT_NAMES.SEMOLINA, calories: 330, protein: 12.6, fat: 3.3, carbs: 57.1 },
    /*-random-*/ { name: INGREDIENT_NAMES.OATMEAL, calories: 330, protein: 12.6, fat: 3.3, carbs: 57.1 },

    // Овощи/Клетчатка
    /*approved*/ { name: INGREDIENT_NAMES.SALAD_LEAF, calories: 17, protein: 1.2, fat: 0.2, carbs: 2.6 },
    /*approved*/ { name: INGREDIENT_NAMES.RADICCHIO_MIX, calories: 23, protein: 1.4, fat: 0.3, carbs: 4.5 },
    /*approved*/ { name: INGREDIENT_NAMES.CONSERVED_CORN, calories: 96, protein: 2.4, fat: 1.5, carbs: 17.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.CUCUMBER, calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6 },
    /*-random-*/ { name: INGREDIENT_NAMES.BELL_PEPPER, calories: 31, protein: 1.0, fat: 0.3, carbs: 6.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.RADISH, calories: 16, protein: 0.7, fat: 0.1, carbs: 3.4 },
    /*-random-*/ { name: INGREDIENT_NAMES.AVOCADO, calories: 160, protein: 2.0, fat: 15.0, carbs: 8.5 },
    /*-random-*/ { name: INGREDIENT_NAMES.CARROT, calories: 41, protein: 0.9, fat: 0.2, carbs: 9.6 },
    /*-random-*/ { name: INGREDIENT_NAMES.BEETROOT, calories: 43, protein: 1.6, fat: 0.2, carbs: 8.8 },
    /*-random-*/ { name: INGREDIENT_NAMES.GARLIC, calories: 149, protein: 6.4, fat: 0.5, carbs: 30.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.PICKLED_GINGER, calories: 30, protein: 0.7, fat: 0.1, carbs: 6.0 },

    // Фрукты/Ягоды
    /*-random-*/ { name: INGREDIENT_NAMES.KIWI, calories: 61, protein: 1.2, fat: 0.3, carbs: 14.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.APPLE, calories: 52, protein: 0.5, fat: 0.2, carbs: 14.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.BANANA, calories: 89, protein: 1.1, fat: 0.3, carbs: 23.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.ORANGE, calories: 47, protein: 1.0, fat: 0.1, carbs: 12.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.PEACH, calories: 45, protein: 0.9, fat: 0.1, carbs: 10.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.STRAWBERRY, calories: 32, protein: 0.9, fat: 0.2, carbs: 7.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.BLUEBERRY, calories: 57, protein: 0.8, fat: 0.3, carbs: 14.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.RASPBERRY, calories: 43, protein: 1.4, fat: 0.4, carbs: 9.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.BLACKBERRY, calories: 43, protein: 1.4, fat: 0.4, carbs: 9.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.GRAPES, calories: 69, protein: 0.5, fat: 0.2, carbs: 18.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.PEAR, calories: 57, protein: 0.4, fat: 0.1, carbs: 14.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.PLUM, calories: 44, protein: 0.8, fat: 0.2, carbs: 10.0 },

    // Жиры/Молочные/Соусы
    /*-random-*/ { name: INGREDIENT_NAMES.OLIVE_OIL, calories: 884, protein: 0.0, fat: 100.0, carbs: 0.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.MILK, calories: 64, protein: 3.28, fat: 3.66, carbs: 4.65 },
    /*approved*/ { name: INGREDIENT_NAMES.SOUR_CREAM, calories: 114.8, protein: 2.8, fat: 10.0, carbs: 3.4 },
    /*approved*/ { name: INGREDIENT_NAMES.COTTAGE_CHEESE, calories: 125.0, protein: 3.6, fat: 5.0, carbs: 16.3 },
    /*-random-*/ { name: INGREDIENT_NAMES.CREAM, calories: 337, protein: 2.8, fat: 35.0, carbs: 3.4 },
    /*-random-*/ { name: INGREDIENT_NAMES.BUTTER, calories: 717, protein: 0.8, fat: 78.0, carbs: 0.6 },
    /*approved*/ { name: INGREDIENT_NAMES.KETCHUP, calories: 100, protein: 1, fat: 0, carbs: 20 },
    /*approved*/ { name: INGREDIENT_NAMES.COCKTAIL_SAUCE, calories: 183, protein: 1, fat: 14, carbs: 13 },
    /*approved*/ {
        name: INGREDIENT_NAMES.BLACK_PEPPER_AND_CARAMEL_SAUCE,
        calories: 120,
        protein: 2.1,
        fat: 1,
        carbs: 27.1,
    },
    /*approved*/ { name: INGREDIENT_NAMES.HUMMUS, calories: 233, protein: 7.1, fat: 16.2, carbs: 13.1 },
    /*approved*/ { name: INGREDIENT_NAMES.SOY_SAUCE, calories: 100, protein: 1, fat: 0, carbs: 20 },

    // Приправы
    /*approved*/ { name: INGREDIENT_NAMES.HONEY, calories: 304, protein: 0.3, fat: 0.1, carbs: 80.9 },
    /*-random-*/ { name: INGREDIENT_NAMES.SALT, calories: 0, protein: 0.0, fat: 0.0, carbs: 0.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.SUGAR, calories: 374, protein: 0.0, fat: 0.0, carbs: 99.9 },

    // Сладости
    /*-random-*/ { name: INGREDIENT_NAMES.GLAZED_CURD_BAR, calories: 386, protein: 7.1, fat: 22.2, carbs: 38.0 },
    /*approved*/ { name: INGREDIENT_NAMES.SIROK_DOLCHE, calories: 386, protein: 7.1, fat: 22.2, carbs: 38.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.TIDBIT_BAR, calories: 220, protein: 2.5, fat: 9.0, carbs: 32.0 },
    /*approved*/ { name: INGREDIENT_NAMES.FIZI_BAR, calories: 381, protein: 12.4, fat: 22.8, carbs: 42.3 },
    /*approved*/ { name: INGREDIENT_NAMES.NESQUIK_DUO_BAR, calories: 530, protein: 5.1, fat: 29.0, carbs: 62.0 },
    /*approved*/ { name: INGREDIENT_NAMES.ROSHEN_WAFFLE, calories: 450, protein: 6.0, fat: 18.0, carbs: 68.0 },
    /*approved*/ { name: INGREDIENT_NAMES.OREO_STRAWBERRY, calories: 490, protein: 4.1, fat: 21.0, carbs: 68.0 },
    /*-random-*/ { name: INGREDIENT_NAMES.ICE_CREAM_GRANOLA, calories: 250, protein: 5.0, fat: 12.0, carbs: 30.0 },
    /*approved*/ {
        name: INGREDIENT_NAMES.CHOCOLATE_WAFER_ROCK_AND_ROLL,
        calories: 530,
        protein: 4.5,
        fat: 28.1,
        carbs: 61.5,
    },
    /*approved*/ { name: INGREDIENT_NAMES.CHEESE_CAKE_NEW_YORK, calories: 316, protein: 6.0, fat: 18.0, carbs: 32.6 },
]

export const INGREDIENTS_BY_NAMES = INGREDIENTS.reduce(
    (acc, ingredient) => {
        acc[ingredient.name] = ingredient
        return acc
    },
    {} as Record<string, Ingredient>,
)
