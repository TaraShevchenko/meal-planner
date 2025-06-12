import { INGREDIENT_NAMES } from './Ingredients.data'

type Recipe = {
    name: string
    ingredients: {
        ingredientName: string
        quantity: number
    }[]
}

export const RECIPE_NAMES = {
    OMLET: 'Омлет',
    COFFEE_IN_A_CEZVE: 'Кава в турці (домашня)',
    COTTAGE_CHEESE_WITH_SOUR_CREAM_AND_SUGAR: 'Творог з сметаною та цукром',
    SEMOLINA_PORRIDGE_WITH_KIWI: 'Манна каша з ківі',

    SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER: 'Салат з кукурудзою, авокадо та солодким перцем',
    SALAD_WITH_FETA_AND_BEETROOT: 'Салат з фетою та буряком',

    CHICKEN_FILLET_IN_SAUCE: 'Куряче філе в соусі',
    CHICKEN_IN_SOY_SAUCE: 'Курка в соевому соусе',
    CHICKEN_IN_SOUR_CREAM_SAUCE: 'Курка в сметанном соусе',
} as const

export const RECIPES: Recipe[] = [
    {
        name: RECIPE_NAMES.CHICKEN_FILLET_IN_SAUCE,
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.CHIKEN_FILLET, quantity: 500 },
            { ingredientName: INGREDIENT_NAMES.BLACK_PEPPER_AND_CARAMEL_SAUCE, quantity: 140 },
        ],
    },
    {
        name: RECIPE_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER,
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.SALAD_LEAF, quantity: 40 },
            { ingredientName: INGREDIENT_NAMES.RADICCHIO_MIX, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.CONSERVED_CORN, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.CUCUMBER, quantity: 65 },
            { ingredientName: INGREDIENT_NAMES.BELL_PEPPER, quantity: 90 },
            { ingredientName: INGREDIENT_NAMES.RADISH, quantity: 60 },
            { ingredientName: INGREDIENT_NAMES.AVOCADO, quantity: 70 },
            { ingredientName: INGREDIENT_NAMES.OLIVE_OIL, quantity: 10 },
            { ingredientName: INGREDIENT_NAMES.SALT, quantity: 5 },
        ],
    },
    {
        name: RECIPE_NAMES.OMLET,
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 240 },
            { ingredientName: INGREDIENT_NAMES.MILK, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.SOUR_CREAM, quantity: 40 },
            { ingredientName: INGREDIENT_NAMES.SALT, quantity: 2 },
        ],
    },
    {
        name: RECIPE_NAMES.COFFEE_IN_A_CEZVE,
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.MILK, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.SUGAR, quantity: 5 },
        ],
    },
    {
        name: RECIPE_NAMES.COTTAGE_CHEESE_WITH_SOUR_CREAM_AND_SUGAR,
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.COTTAGE_CHEESE, quantity: 175 },
            { ingredientName: INGREDIENT_NAMES.SOUR_CREAM, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.SUGAR, quantity: 25 },
        ],
    },
    {
        name: RECIPE_NAMES.SEMOLINA_PORRIDGE_WITH_KIWI,
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.MILK, quantity: 300 },
            { ingredientName: INGREDIENT_NAMES.BUTTER, quantity: 45 },
            { ingredientName: INGREDIENT_NAMES.SEMOLINA, quantity: 35 },
            { ingredientName: INGREDIENT_NAMES.SUGAR, quantity: 20 },
            { ingredientName: INGREDIENT_NAMES.SALT, quantity: 3 },
            { ingredientName: INGREDIENT_NAMES.KIWI, quantity: 100 },
        ],
    },
    {
        name: RECIPE_NAMES.SALAD_WITH_FETA_AND_BEETROOT,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.FETA_CHEESE,
                quantity: 60,
            },
            {
                ingredientName: INGREDIENT_NAMES.BEETROOT,
                quantity: 300,
            },
        ],
    },
    {
        name: RECIPE_NAMES.CHICKEN_IN_SOY_SAUCE,
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.CHIKEN_FILLET, quantity: 600 },
            { ingredientName: INGREDIENT_NAMES.SOY_SAUCE, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.HONEY, quantity: 10 },
            { ingredientName: INGREDIENT_NAMES.PICKLED_GINGER, quantity: 10 },
            { ingredientName: INGREDIENT_NAMES.OLIVE_OIL, quantity: 20 },
        ],
    },
    {
        name: RECIPE_NAMES.CHICKEN_IN_SOUR_CREAM_SAUCE,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.CHIKEN_FILLET,
                quantity: 550,
            },
            {
                ingredientName: INGREDIENT_NAMES.SOUR_CREAM,
                quantity: 250,
            },
            {
                ingredientName: INGREDIENT_NAMES.BUTTER,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.FETA_CHEESE,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.FLOUR,
                quantity: 15,
            },
            {
                ingredientName: INGREDIENT_NAMES.GARLIC,
                quantity: 2,
            },
        ],
    },
]

export const RECIPES_BY_NAMES = RECIPES.reduce(
    (acc, recipe) => {
        acc[recipe.name] = recipe
        return acc
    },
    {} as Record<string, Recipe>,
)
