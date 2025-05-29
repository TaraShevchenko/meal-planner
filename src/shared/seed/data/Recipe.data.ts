import { INGREDIENT_NAMES } from './Ingredients.data'

type Recipe = {
    name: string
    ingredients: {
        ingredientName: string
        quantity: number
    }[]
}

export const RECIPES: Recipe[] = [
    {
        name: 'Омлет із шинкою та салатом',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 180 },
            { ingredientName: INGREDIENT_NAMES.HAM, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.RADISH, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.LETTUCE, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.CRACKER, quantity: 20 },
        ],
    },
    {
        name: 'Булгур з курячими котлетами',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BULGUR, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN_CUTLETS, quantity: 120 },
            { ingredientName: INGREDIENT_NAMES.RADISH, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.LETTUCE, quantity: 50 },
        ],
    },
    {
        name: 'Булгур з буряком та олією',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BULGUR, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.BEETROOT, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.OLIVE_OIL, quantity: 10 },
            { ingredientName: INGREDIENT_NAMES.BREAD, quantity: 30 },
        ],
    },
    {
        name: 'Сир з медом та сметаною',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.CHEESE, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.SOUR_CREAM, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.HONEY, quantity: 15 },
            { ingredientName: INGREDIENT_NAMES.CRACKER, quantity: 20 },
        ],
    },
    {
        name: 'Тушкована картопля з мʼясом',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.POTATO, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.MEAT, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.SAUER_KRAUT, quantity: 50 },
        ],
    },
    {
        name: 'Картопляне пюре з салатом',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.POTATO, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.GREENS, quantity: 20 },
            { ingredientName: INGREDIENT_NAMES.ONION, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 60 },
        ],
    },
    {
        name: 'Яйця з овочевим салатом',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 120 },
            { ingredientName: INGREDIENT_NAMES.SWEET_PEPPER, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.AVOCADO, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.BREAD, quantity: 30 },
        ],
    },
    {
        name: 'Макарони з куркою',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PASTA, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN_LEGS, quantity: 160 },
            { ingredientName: INGREDIENT_NAMES.AVOCADO, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.SWEET_PEPPER, quantity: 50 },
        ],
    },
    {
        name: 'Макарони з морквою по-корейськи',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.PASTA, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.KOREAN_CARROTS, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.CRACKER, quantity: 20 },
            { ingredientName: INGREDIENT_NAMES.BUTTER, quantity: 10 },
        ],
    },
    {
        name: 'Яєчня з салатом та хлібом',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 120 },
            { ingredientName: INGREDIENT_NAMES.BREAD, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.BUTTER, quantity: 10 },
            { ingredientName: INGREDIENT_NAMES.CHEESE, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.MUSTARD, quantity: 10 },
        ],
    },
    {
        name: 'Гречка з курячими крильцями',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN_WINGS, quantity: 80 },
            { ingredientName: INGREDIENT_NAMES.CHEESE, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.MUSTARD, quantity: 10 },
        ],
    },
    {
        name: 'Гречка з квашеною капустою',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.BUCKWHEAT, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.SAUER_KRAUT, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.KOREAN_CARROTS, quantity: 50 },
        ],
    },
    {
        name: 'Омлет із сосисками',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 120 },
            { ingredientName: INGREDIENT_NAMES.SAUSAGE, quantity: 80 },
            { ingredientName: INGREDIENT_NAMES.CUCUMBER, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.TOMATO, quantity: 50 },
        ],
    },
    {
        name: 'Локшина з курячими котлетами',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.NOODLES, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN_CUTLETS, quantity: 120 },
            { ingredientName: INGREDIENT_NAMES.CUCUMBER, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.TOMATO, quantity: 50 },
        ],
    },
    {
        name: 'Локшина з морквою та сиром',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.NOODLES, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.KOREAN_CARROTS, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.BREAD, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.CHEESE, quantity: 30 },
        ],
    },
    {
        name: 'Сир з бананом',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.CHEESE, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.BANANA, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.CRACKER, quantity: 20 },
        ],
    },
    {
        name: 'Рис з тефтелями',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.MEATBALLS, quantity: 120 },
            { ingredientName: INGREDIENT_NAMES.PICKLED_CUCUMBERS, quantity: 50 },
        ],
    },
    {
        name: 'Рис з буряком та зеленню',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.RICE, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.BEETROOT, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.LETTUCE, quantity: 50 },
            { ingredientName: INGREDIENT_NAMES.GREENS, quantity: 20 },
        ],
    },
    {
        name: 'Яйця з зеленню та хлібом',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.EGGS, quantity: 120 },
            { ingredientName: INGREDIENT_NAMES.GREENS, quantity: 20 },
            { ingredientName: INGREDIENT_NAMES.ONION, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.BREAD, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.BUTTER, quantity: 10 },
        ],
    },
    {
        name: 'Пюре з курячими крильцями',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.POTATO, quantity: 200 },
            { ingredientName: INGREDIENT_NAMES.CHICKEN_WINGS, quantity: 80 },
            { ingredientName: INGREDIENT_NAMES.GREENS, quantity: 20 },
            { ingredientName: INGREDIENT_NAMES.ONION, quantity: 30 },
        ],
    },
    {
        name: 'Пюре з буряком та сиром',
        ingredients: [
            { ingredientName: INGREDIENT_NAMES.POTATO, quantity: 150 },
            { ingredientName: INGREDIENT_NAMES.BEETROOT, quantity: 100 },
            { ingredientName: INGREDIENT_NAMES.BREAD, quantity: 30 },
            { ingredientName: INGREDIENT_NAMES.CHEESE, quantity: 50 },
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
