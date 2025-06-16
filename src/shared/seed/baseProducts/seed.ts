import { PrismaClient } from "@prisma/client";
import { INGREDIENTS } from "../.data/Ingredients.data";
import { MEALS_SEED_DATA } from "../.data/Meals.data";
import { QUICK_MEALS } from "../.data/QuickMeals.data";

const prisma = new PrismaClient();

// Константы для тестовых данных
const TEST_USER_EMAIL = "tarashevchenkowork@gmail.com";
let TEST_USER_ID: string;

// Функция для поиска пользователя Clerk
async function findClerkUser() {
  console.log("🔍 Поиск пользователя Clerk...");

  const user = await prisma.user.findUnique({
    where: { email: TEST_USER_EMAIL },
  });

  if (!user) {
    console.warn(
      "⚠️ ПРЕДУПРЕЖДЕНИЕ: Пользователь с email tarashevchenkowork@gmail.com не найден!",
    );
    console.warn(
      "📝 Сначала создайте пользователя tarashevchenkowork@gmail.com через Clerk (зарегистрируйтесь в приложении)",
    );
    throw new Error(
      `Пользователь ${TEST_USER_EMAIL} не существует в базе данных`,
    );
  }

  TEST_USER_ID = user.id;
  console.log(
    `✅ Найден пользователь: ${user.firstName} ${user.lastName} (${user.email})`,
  );
  return user;
}

async function seedIngredients() {
  console.log("🔄 Заполнение ингредиентов...");

  for (const ingredient of INGREDIENTS) {
    const existingIngredient = await prisma.ingredient.findFirst({
      where: {
        userId: TEST_USER_ID,
        name: ingredient.name,
      },
    });

    if (existingIngredient) {
      await prisma.ingredient.update({
        where: { id: existingIngredient.id },
        data: {
          calories: ingredient.calories,
          protein: ingredient.protein,
          carbs: ingredient.carbs,
          fat: ingredient.fat,
        },
      });
    } else {
      await prisma.ingredient.create({
        data: {
          userId: TEST_USER_ID,
          name: ingredient.name,
          calories: ingredient.calories,
          protein: ingredient.protein,
          carbs: ingredient.carbs,
          fat: ingredient.fat,
        },
      });
    }
  }

  console.log(`✅ Создано/обновлено ${INGREDIENTS.length} ингредиентов`);
}

async function seedQuickMeals() {
  console.log("🔄 Заполнение быстрых блюд...");

  for (const quickMeal of QUICK_MEALS) {
    const existingQuickMeal = await prisma.quickMeal.findFirst({
      where: {
        userId: TEST_USER_ID,
        name: quickMeal.name,
      },
    });

    if (existingQuickMeal) {
      await prisma.quickMeal.update({
        where: { id: existingQuickMeal.id },
        data: {
          calories: quickMeal.calories,
          protein: quickMeal.protein,
          carbs: quickMeal.carbs,
          fat: quickMeal.fat,
        },
      });
    } else {
      await prisma.quickMeal.create({
        data: {
          userId: TEST_USER_ID,
          name: quickMeal.name,
          calories: quickMeal.calories,
          protein: quickMeal.protein,
          carbs: quickMeal.carbs,
          fat: quickMeal.fat,
        },
      });
    }
  }

  console.log(`✅ Создано/обновлено ${QUICK_MEALS.length} быстрых блюд`);
}

async function seedMeals() {
  console.log("🔄 Заполнение блюд...");

  for (const mealData of MEALS_SEED_DATA) {
    // Создаем блюдо
    let meal = await prisma.meal.findFirst({
      where: {
        userId: TEST_USER_ID,
        name: mealData.name,
      },
    });

    if (!meal) {
      meal = await prisma.meal.create({
        data: {
          userId: TEST_USER_ID,
          name: mealData.name,
        },
      });
    }

    // Удаляем старые ингредиенты блюда
    await prisma.mealIngredient.deleteMany({
      where: { mealId: meal.id },
    });

    // Добавляем ингредиенты к блюду
    for (const ingredientData of mealData.ingredients) {
      // Находим ингредиент по имени
      const ingredient = await prisma.ingredient.findFirst({
        where: {
          userId: TEST_USER_ID,
          name: ingredientData.ingredientName,
        },
      });

      if (!ingredient) {
        console.warn(
          `⚠️ Ингредиент "${ingredientData.ingredientName}" не найден для блюда "${mealData.name}"`,
        );
        continue;
      }

      // Создаем связь между блюдом и ингредиентом
      await prisma.mealIngredient.create({
        data: {
          mealId: meal.id,
          ingredientId: ingredient.id,
          amount: ingredientData.amount,
          unit: ingredientData.unit || "GRAMS",
        },
      });
    }
  }

  console.log(`✅ Создано/обновлено ${MEALS_SEED_DATA.length} блюд`);
}

export async function seedBaseProductsToDatabase() {
  console.log("👤 Ищем пользователя Clerk...");
  await findClerkUser();
  console.log("🥕 Заполняем ингредиенты...");
  await seedIngredients();
  console.log("⚡ Заполняем быстрые блюда...");
  await seedQuickMeals();
  console.log("🍽️ Заполняем блюда...");
  await seedMeals();
}

async function main() {
  try {
    console.log("🌱 Начинаем заполнение базы данных...");
    await seedBaseProductsToDatabase();
    console.log("✅ База данных успешно заполнена!");
  } catch (error) {
    console.error("❌ Ошибка при заполнении базы данных:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем seed
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
