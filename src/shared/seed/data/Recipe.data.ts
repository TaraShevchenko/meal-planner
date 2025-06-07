import { INGREDIENT_NAMES } from './Ingredients.data'

type Recipe = {
    name: string
    ingredients: {
        ingredientName: string
        quantity: number
    }[]
}

export const RECIPE_NAMES = {
    // 2025-06-02
    CHICKEN_FILLET_IN_SAUCE: 'Куряче філе в соусі',
    SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER: 'Салат з кукурудзою, авокадо та солодким перцем',
    ICE_LATTE_COFFEE_BOSS: 'Холодний латте Coffee Boss',
    //
    OMLET: 'Омлет',
    COFFEE_IN_A_CEZVE: 'Кава в турці (домашня)',
    COTTAGE_CHEESE_WITH_SOUR_CREAM_AND_SUGAR: 'Творог з сметаною та цукром',
} as const

export const RECIPES: Recipe[] = [
    // 2025-06-02
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
        name: RECIPE_NAMES.ICE_LATTE_COFFEE_BOSS,
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.MILK, quantity: 300 },
            { ingredientName: INGREDIENT_NAMES.COFFEE_SYRUP, quantity: 10 },
            { ingredientName: INGREDIENT_NAMES.ESPRESSO, quantity: 30 },
        ],
    },
    // 2025-06-03
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
]

export const RECIPES_BY_NAMES = RECIPES.reduce(
    (acc, recipe) => {
        acc[recipe.name] = recipe
        return acc
    },
    {} as Record<string, Recipe>,
)
