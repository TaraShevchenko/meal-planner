import { INGREDIENT_NAMES } from './Ingredients.data'

export const RECIPE_NAMES = {
    // CARBS
    Rise: 'Рис',
    Bulgur: 'Булгур',
    Buckwheat: 'Гречка',
    Lentils: 'Чечевица',
    Pasta: 'Макароны "Паутинка"',
    Noodles: 'Лапша',
    MashedPotatoes: 'Картофельное пюре',
    StewedPotatoesWithMeat: 'Тушёная картошка с мясом',
    RiceWithChickenAndCarrot: 'Рис с курицей и морковью',

    // PROTEIN
    Sausages: 'Сосиски',
    ChickenGoulash: 'Гуляш куриный',
    ChickenCutlets: 'Котлеты куриные',
    ChickenChoppedCutlets: 'Котлеты рубленые куриные',
    BakedChickenLegs: 'Запеченые куриные ножки',
    BakedChickenWings: 'Запеченые куриные крылышки',
    BakedChickenFillet: 'Запеченое куриное филе с овощами',

    FriedEggs: 'Жареные яйца',
    BoiledEggs: 'Вареные яйца',
    OmeletteWithHam: 'Омлет с ветчиной',
    OmeletteWithSausages: 'Омлет с сосисками',

    MeatballsWithVegetables: 'Тефтели с овощами',
    CottageCheeseWithSourCream: 'Творог со сметаной',

    // FIBER
    VegetableMix: 'Овощная смесь',
    GratedBeetroot: 'Тертая свекла',
    KoreanCarrot: 'Морковь по-корейски',
    SauerkrautCabbage: 'Квашеная капуста',
    PickledCucumbers: 'Огурцы маринованные',

    Salad: 'Салат',
    SaladWithRadish: 'Салат с редиской',
    SaladWithTunaAndCorn: 'Салат с тунцом и кукурузой',
    SaladWithHerbsAndOnions: 'Салат с зеленью и луком',
    SaladWithCheeseAndMustard: 'Салат с сыром и горчицей',
    SaladWithPeppersAndAvocado: 'Салат с перцем и авокадо',
    SpinachChickenSalad: 'Салат со шпинатом и курицей',
} as const

type Recipe = {
    name: string
    ingredients: {
        ingredientName: string
        quantity: number
    }[]
}

export const RECIPES: Recipe[] = [
    // CARBS
    {
        name: RECIPE_NAMES.Rise,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Rice,
                quantity: 60,
            },
        ],
    },
    {
        name: RECIPE_NAMES.Bulgur,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Bulgur,
                quantity: 60,
            },
        ],
    },
    {
        name: RECIPE_NAMES.Buckwheat,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Buckwheat,
                quantity: 60,
            },
        ],
    },
    {
        name: RECIPE_NAMES.Lentils,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Lentils,
                quantity: 60,
            },
        ],
    },
    {
        name: RECIPE_NAMES.Pasta,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Pasta,
                quantity: 60,
            },
        ],
    },
    {
        name: RECIPE_NAMES.Noodles,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Noodles,
                quantity: 60,
            },
        ],
    },
    {
        name: RECIPE_NAMES.MashedPotatoes,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Potato,
                quantity: 150,
            },
            {
                ingredientName: INGREDIENT_NAMES.Milk,
                quantity: 50,
            },
        ],
    },
    {
        name: RECIPE_NAMES.StewedPotatoesWithMeat,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Potato,
                quantity: 150,
            },
            {
                ingredientName: INGREDIENT_NAMES.PorkSteak,
                quantity: 100,
            },
            {
                ingredientName: INGREDIENT_NAMES.Carrot,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.Onion,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.OliveOil,
                quantity: 10,
            },
        ],
    },
    {
        name: RECIPE_NAMES.RiceWithChickenAndCarrot,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Rice,
                quantity: 60,
            },
            {
                ingredientName: INGREDIENT_NAMES.ChickenFillet,
                quantity: 100,
            },
            {
                ingredientName: INGREDIENT_NAMES.Carrot,
                quantity: 30,
            },
        ],
    },

    // PROTEIN
    {
        name: RECIPE_NAMES.Sausages,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Sausages,
                quantity: 120,
            },
        ],
    },
    {
        name: RECIPE_NAMES.ChickenGoulash,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenFillet,
                quantity: 120,
            },
        ],
    },
    {
        name: RECIPE_NAMES.ChickenCutlets,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenCutlet,
                quantity: 120,
            },
        ],
    },
    {
        name: RECIPE_NAMES.ChickenChoppedCutlets,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenMince,
                quantity: 120,
            },
        ],
    },
    {
        name: RECIPE_NAMES.BakedChickenLegs,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenDrumsticks,
                quantity: 120,
            },
        ],
    },
    {
        name: RECIPE_NAMES.BakedChickenWings,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenLeg,
                quantity: 120,
            },
        ],
    },
    {
        name: RECIPE_NAMES.BakedChickenFillet,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenFillet,
                quantity: 120,
            },
            {
                ingredientName: INGREDIENT_NAMES.Broccoli,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.Carrot,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.OliveOil,
                quantity: 10,
            },
        ],
    },
    {
        name: RECIPE_NAMES.FriedEggs,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenEgg,
                quantity: 200,
            },
            {
                ingredientName: INGREDIENT_NAMES.OliveOil,
                quantity: 5,
            },
        ],
    },
    {
        name: RECIPE_NAMES.BoiledEggs,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenEgg,
                quantity: 200,
            },
        ],
    },
    {
        name: RECIPE_NAMES.OmeletteWithHam,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenEgg,
                quantity: 140,
            },
            {
                ingredientName: INGREDIENT_NAMES.Ham,
                quantity: 80,
            },
            {
                ingredientName: INGREDIENT_NAMES.HardCheese,
                quantity: 30,
            },
        ],
    },
    {
        name: RECIPE_NAMES.OmeletteWithSausages,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenEgg,
                quantity: 140,
            },
            {
                ingredientName: INGREDIENT_NAMES.Sausages,
                quantity: 80,
            },
        ],
    },
    {
        name: RECIPE_NAMES.MeatballsWithVegetables,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.ChickenMince,
                quantity: 120,
            },
            {
                ingredientName: INGREDIENT_NAMES.Carrot,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.Onion,
                quantity: 20,
            },
        ],
    },
    {
        name: RECIPE_NAMES.CottageCheeseWithSourCream,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.CottageCheese,
                quantity: 150,
            },
            {
                ingredientName: INGREDIENT_NAMES.SourCream,
                quantity: 50,
            },
        ],
    },

    // FIBER
    {
        name: RECIPE_NAMES.VegetableMix,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Carrot,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.SweetPepper,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Cucumber,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Tomato,
                quantity: 50,
            },
        ],
    },
    {
        name: RECIPE_NAMES.GratedBeetroot,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Beetroot,
                quantity: 50,
            },
        ],
    },
    {
        name: RECIPE_NAMES.KoreanCarrot,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.KoreanCarrot,
                quantity: 10,
            },
        ],
    },
    {
        name: RECIPE_NAMES.SauerkrautCabbage,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.SauerkrautCabbage,
                quantity: 50,
            },
        ],
    },
    {
        name: RECIPE_NAMES.PickledCucumbers,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.PickledGherkin,
                quantity: 30,
            },
        ],
    },
    {
        name: RECIPE_NAMES.Salad,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Salad,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Cucumber,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Tomato,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.SweetPepper,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.OliveOil,
                quantity: 10,
            },
        ],
    },
    {
        name: RECIPE_NAMES.SaladWithRadish,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Salad,
                quantity: 40,
            },
            {
                ingredientName: INGREDIENT_NAMES.Cucumber,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.Radish,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.Tomato,
                quantity: 30,
            },
        ],
    },
    {
        name: RECIPE_NAMES.SaladWithTunaAndCorn,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Salad,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.CannedCorn,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.CannedTuna,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.CreamCheese,
                quantity: 50,
            },
        ],
    },
    {
        name: RECIPE_NAMES.SaladWithHerbsAndOnions,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Salad,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Herbs,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.Cucumber,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Tomato,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Onion,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.OliveOil,
                quantity: 10,
            },
        ],
    },
    {
        name: RECIPE_NAMES.SaladWithCheeseAndMustard,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Salad,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.CamembertCheese,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.ComoInsalataCheese,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Mustard,
                quantity: 10,
            },
            {
                ingredientName: INGREDIENT_NAMES.Cucumber,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Tomato,
                quantity: 50,
            },
        ],
    },
    {
        name: RECIPE_NAMES.SaladWithPeppersAndAvocado,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Salad,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Cucumber,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Tomato,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.SweetPepper,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.Avocado,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.Onion,
                quantity: 20,
            },
            {
                ingredientName: INGREDIENT_NAMES.OliveOil,
                quantity: 10,
            },
        ],
    },
    {
        name: RECIPE_NAMES.SpinachChickenSalad,
        ingredients: [
            {
                ingredientName: INGREDIENT_NAMES.Spinach,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.ChickenFillet,
                quantity: 100,
            },
            {
                ingredientName: INGREDIENT_NAMES.SoftCheese,
                quantity: 30,
            },
            {
                ingredientName: INGREDIENT_NAMES.CannedCorn,
                quantity: 50,
            },
            {
                ingredientName: INGREDIENT_NAMES.ChickenEgg,
                quantity: 50,
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
