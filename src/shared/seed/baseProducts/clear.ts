import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Константы
const TEST_USER_EMAIL = "tarashevchenkowork@gmail.com";
let TEST_USER_ID: string;

export async function clearBaseProductsFromDatabase() {
  console.log("🧹 Начинаем очистку тестовых данных...");

  try {
    // Ищем пользователя по email
    console.log("🔍 Поиск пользователя Clerk...");
    const user = await prisma.user.findUnique({
      where: { email: TEST_USER_EMAIL },
    });

    if (!user) {
      console.warn(
        "⚠️ ПРЕДУПРЕЖДЕНИЕ: Пользователь с email tarashevchenkowork@gmail.com не найден!",
      );
      console.log("ℹ️ Нечего удалять - пользователь не существует");
      return;
    }

    TEST_USER_ID = user.id;
    console.log(
      `✅ Найден пользователь: ${user.firstName} ${user.lastName} (${user.email})`,
    );

    // Удаляем meals связанные с пользователем
    console.log("🗑️ Удаляем meals...");
    await prisma.meal.deleteMany({
      where: { userId: TEST_USER_ID },
    });

    // Удаляем quickMeals связанные с пользователем
    console.log("🗑️ Удаляем quick meals...");
    await prisma.quickMeal.deleteMany({
      where: { userId: TEST_USER_ID },
    });

    // Удаляем ingredients связанные с пользователем
    console.log("🗑️ Удаляем ingredients...");
    await prisma.ingredient.deleteMany({
      where: { userId: TEST_USER_ID },
    });

    console.log("✅ Все тестовые данные успешно удалены!");
    console.log("ℹ️ Пользователь Clerk не удален (управляется через Clerk)");
  } catch (error) {
    console.error("❌ Ошибка при очистке данных:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем очистку
clearBaseProductsFromDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
