import { INGREDIENT_NAMES } from "./Ingredients.data";

import { Prisma } from "@prisma/client";

type MealIngredient = {
  ingredientName: string;
  amount: number;
  unit?: "GRAMS" | "PIECES" | "SERVING";
};

type Meal = Omit<Prisma.MealCreateInput, "user"> & {
  ingredients: MealIngredient[];
};

export const MEAL_NAMES = {
  OMLET: "Омлет",
  COFFEE_IN_A_CEZVE: "Кава в турці (домашня)",
  COTTAGE_CHEESE_WITH_SOUR_CREAM_AND_SUGAR: "Творог з сметаною та цукром",
  SEMOLINA_PORRIDGE_WITH_KIWI: "Манна каша з ківі",

  SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER:
    "Салат з кукурудзою, авокадо та солодким перцем",
  SALAD_WITH_FETA_AND_BEETROOT: "Салат з фетою та буряком",

  CHICKEN_FILLET_IN_SAUCE: "Куряче філе в соусі",
  CHICKEN_IN_SOY_SAUCE: "Курка в соевому соусе",
  CHICKEN_IN_SOUR_CREAM_SAUCE: "Курка в сметанном соусе",
} as const;

export const MEALS_SEED_DATA: Meal[] = [
  {
    name: MEAL_NAMES.CHICKEN_FILLET_IN_SAUCE,
    ingredients: [
      {
        ingredientName: INGREDIENT_NAMES.CHIKEN_FILLET,
        amount: 500,
        unit: "GRAMS",
      },
      {
        ingredientName: INGREDIENT_NAMES.BLACK_PEPPER_AND_CARAMEL_SAUCE,
        amount: 140,
        unit: "GRAMS",
      },
    ],
  },
  {
    name: MEAL_NAMES.SALAD_WITH_CORN_AVOCADO_AND_BELL_PEPPER,
    ingredients: [
      {
        ingredientName: INGREDIENT_NAMES.SALAD_LEAF,
        amount: 40,
        unit: "GRAMS",
      },
      {
        ingredientName: INGREDIENT_NAMES.RADICCHIO_MIX,
        amount: 30,
        unit: "GRAMS",
      },
      {
        ingredientName: INGREDIENT_NAMES.CONSERVED_CORN,
        amount: 50,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.CUCUMBER, amount: 65, unit: "GRAMS" },
      {
        ingredientName: INGREDIENT_NAMES.BELL_PEPPER,
        amount: 90,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.RADISH, amount: 60, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.AVOCADO, amount: 70, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.OLIVE_OIL, amount: 10, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.SALT, amount: 5, unit: "GRAMS" },
    ],
  },
  {
    name: MEAL_NAMES.OMLET,
    ingredients: [
      { ingredientName: INGREDIENT_NAMES.EGGS, amount: 240, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.MILK, amount: 50, unit: "GRAMS" },
      {
        ingredientName: INGREDIENT_NAMES.SOUR_CREAM,
        amount: 40,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.SALT, amount: 2, unit: "GRAMS" },
    ],
  },
  {
    name: MEAL_NAMES.COFFEE_IN_A_CEZVE,
    ingredients: [
      { ingredientName: INGREDIENT_NAMES.MILK, amount: 100, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.SUGAR, amount: 5, unit: "GRAMS" },
    ],
  },
  {
    name: MEAL_NAMES.COTTAGE_CHEESE_WITH_SOUR_CREAM_AND_SUGAR,
    ingredients: [
      {
        ingredientName: INGREDIENT_NAMES.COTTAGE_CHEESE,
        amount: 175,
        unit: "GRAMS",
      },
      {
        ingredientName: INGREDIENT_NAMES.SOUR_CREAM,
        amount: 50,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.SUGAR, amount: 25, unit: "GRAMS" },
    ],
  },
  {
    name: MEAL_NAMES.SEMOLINA_PORRIDGE_WITH_KIWI,
    ingredients: [
      { ingredientName: INGREDIENT_NAMES.MILK, amount: 300, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.BUTTER, amount: 45, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.SEMOLINA, amount: 35, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.SUGAR, amount: 20, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.SALT, amount: 3, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.KIWI, amount: 100, unit: "GRAMS" },
    ],
  },
  {
    name: MEAL_NAMES.SALAD_WITH_FETA_AND_BEETROOT,
    ingredients: [
      {
        ingredientName: INGREDIENT_NAMES.FETA_CHEESE,
        amount: 60,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.BEETROOT, amount: 300, unit: "GRAMS" },
    ],
  },
  {
    name: MEAL_NAMES.CHICKEN_IN_SOY_SAUCE,
    ingredients: [
      {
        ingredientName: INGREDIENT_NAMES.CHIKEN_FILLET,
        amount: 600,
        unit: "GRAMS",
      },
      {
        ingredientName: INGREDIENT_NAMES.SOY_SAUCE,
        amount: 100,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.HONEY, amount: 10, unit: "GRAMS" },
      {
        ingredientName: INGREDIENT_NAMES.PICKLED_GINGER,
        amount: 10,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.OLIVE_OIL, amount: 20, unit: "GRAMS" },
    ],
  },
  {
    name: MEAL_NAMES.CHICKEN_IN_SOUR_CREAM_SAUCE,
    ingredients: [
      {
        ingredientName: INGREDIENT_NAMES.CHIKEN_FILLET,
        amount: 550,
        unit: "GRAMS",
      },
      {
        ingredientName: INGREDIENT_NAMES.SOUR_CREAM,
        amount: 250,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.BUTTER, amount: 30, unit: "GRAMS" },
      {
        ingredientName: INGREDIENT_NAMES.FETA_CHEESE,
        amount: 50,
        unit: "GRAMS",
      },
      { ingredientName: INGREDIENT_NAMES.FLOUR, amount: 15, unit: "GRAMS" },
      { ingredientName: INGREDIENT_NAMES.GARLIC, amount: 2, unit: "GRAMS" },
    ],
  },
];

export const MEALS_BY_NAMES = MEALS_SEED_DATA.reduce(
  (acc, meal) => {
    acc[meal.name] = meal;
    return acc;
  },
  {} as Record<string, Meal>,
);
