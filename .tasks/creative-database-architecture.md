# 🎨🎨🎨 ENTERING CREATIVE PHASE: DATABASE ARCHITECTURE 🎨🎨🎨

**Фокус:** Архитектура базы данных для Meal Planner
**Цель:** Спроектировать оптимальную схему БД для поддержки всех функций системы
**Требования:** Поддержка семейного режима, расчета БЖУ, рецептов, планирования питания

## КОНТЕКСТ И ТРЕБОВАНИЯ

### Системные требования:
- Поддержка множественных пользователей в семьях
- Планирование питания с отметкой съеденного
- Система рецептов и быстрых блюд
- Расчет пищевой ценности (БЖУ, калории, микронутриенты)
- Система измерений (граммы, порции, штуки)
- Агрегация ингредиентов для списка покупок
- История популярных порций
- Учет магазинных фасовок продуктов

### Технические ограничения:
- Использование Prisma ORM
- PostgreSQL/MySQL совместимость
- Оптимизация для частых запросов расчета БЖУ
- Поддержка миграций без потери данных
- Масштабируемость для множественных семей

## АНАЛИЗ КОМПОНЕНТОВ

### Основные сущности:
- **User**: Пользователи системы
- **Family**: Семейные группы
- **Meal**: Приемы пищи (завтрак, обед, ужин)
- **Recipe**: Рецепты блюд
- **Ingredient**: Ингредиенты
- **QuickDish**: Быстрые блюда
- **NutritionData**: Пищевая ценность
- **MealPlan**: Планы питания
- **GroceryList**: Списки покупок
- **Portion**: История порций
- **ProductPackaging**: Магазинные фасовки

### Ключевые взаимодействия:
- User ↔ Family (многие ко многим)
- Family ↔ MealPlan (один ко многим)
- MealPlan ↔ Meal (один ко многим)
- Meal ↔ Recipe/QuickDish (многие ко многим)
- Recipe ↔ Ingredient (многие ко многим через RecipeIngredient)
- Ingredient ↔ NutritionData (один к одному)
- User ↔ Portion (один ко многим)
- Family ↔ GroceryList (один ко многим)

## ВАРИАНТЫ АРХИТЕКТУРЫ

### Вариант 1: Нормализованная схема с отдельными таблицами
**Описание:** Классическая нормализованная схема с отдельными таблицами для каждой сущности

**Преимущества:**
- Высокая нормализация, минимум дублирования
- Четкое разделение ответственности
- Простота понимания структуры
- Легкость поддержки целостности данных
- Гибкость для будущих расширений

**Недостатки:**
- Множественные JOIN'ы для расчета БЖУ
- Потенциальные проблемы производительности
- Сложность запросов для агрегации
- Больше таблиц для управления

**Техническое соответствие:** Высокое
**Сложность:** Средняя
**Масштабируемость:** Высокая

### Вариант 2: Денормализованная схема с кэшированием БЖУ
**Описание:** Схема с предрасчитанными значениями БЖУ в основных таблицах

**Преимущества:**
- Быстрые запросы для отображения БЖУ
- Меньше JOIN'ов в критических запросах
- Лучшая производительность для чтения
- Простота запросов для UI

**Недостатки:**
- Дублирование данных
- Сложность поддержания консистентности
- Необходимость пересчета при изменениях
- Больший размер БД
- Риск рассинхронизации данных

**Техническое соответствие:** Среднее
**Сложность:** Высокая
**Масштабируемость:** Средняя

### Вариант 3: Гибридная схема с материализованными представлениями
**Описание:** Нормализованная основа с материализованными представлениями для агрегации

**Преимущества:**
- Баланс между нормализацией и производительностью
- Автоматическое обновление агрегатов
- Гибкость в запросах
- Поддержка сложных аналитических запросов
- Возможность индексирования представлений

**Недостатки:**
- Зависимость от возможностей СУБД
- Сложность настройки обновления представлений
- Потенциальные проблемы с Prisma
- Дополнительная нагрузка на БД при обновлениях

**Техническое соответствие:** Среднее
**Сложность:** Высокая
**Масштабируемость:** Высокая

## 🎨 CREATIVE CHECKPOINT: Анализ вариантов завершен

**Прогресс:** Определены 3 основных архитектурных подхода
**Решения:** Проанализированы преимущества и недостатки каждого варианта
**Следующие шаги:** Выбор оптимального решения и детализация схемы

## РЕШЕНИЕ

**Выбранный вариант:** Вариант 1 - Нормализованная схема с отдельными таблицами

**Обоснование:**
1. **Соответствие требованиям:** Полностью покрывает все функциональные требования
2. **Техническая совместимость:** Отлично работает с Prisma ORM
3. **Масштабируемость:** Легко масштабируется с ростом данных
4. **Поддерживаемость:** Простота понимания и модификации
5. **Производительность:** Проблемы производительности решаются индексированием и оптимизацией запросов
6. **Гибкость:** Легко добавлять новые функции без изменения существующей структуры

## ДЕТАЛЬНАЯ СХЕМА БАЗЫ ДАННЫХ

```prisma
// Пользователи
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Связи
  familyMemberships FamilyMember[]
  portions         Portion[]
  mealPlans        MealPlan[]

  @@map("users")
}

// Семьи
model Family {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Связи
  members      FamilyMember[]
  mealPlans    MealPlan[]
  groceryLists GroceryList[]

  @@map("families")
}

// Участники семьи
model FamilyMember {
  id       String @id @default(cuid())
  userId   String
  familyId String
  role     FamilyRole @default(MEMBER)
  joinedAt DateTime   @default(now())

  // Связи
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  family Family @relation(fields: [familyId], references: [id], onDelete: Cascade)

  @@unique([userId, familyId])
  @@map("family_members")
}

enum FamilyRole {
  ADMIN
  MEMBER
}

// Планы питания
model MealPlan {
  id        String   @id @default(cuid())
  date      DateTime
  userId    String?
  familyId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Связи
  user   User?   @relation(fields: [userId], references: [id])
  family Family  @relation(fields: [familyId], references: [id], onDelete: Cascade)
  meals  Meal[]

  @@unique([date, userId, familyId])
  @@map("meal_plans")
}

// Приемы пищи
model Meal {
  id         String    @id @default(cuid())
  mealPlanId String
  type       MealType
  isEaten    Boolean   @default(false)
  eatenAt    DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  // Связи
  mealPlan    MealPlan     @relation(fields: [mealPlanId], references: [id], onDelete: Cascade)
  mealRecipes MealRecipe[]
  mealDishes  MealDish[]

  @@map("meals")
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}

// Рецепты
model Recipe {
  id           String  @id @default(cuid())
  name         String
  description  String?
  instructions String?
  servings     Int     @default(1)
  prepTime     Int?    // в минутах
  cookTime     Int?    // в минутах
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Связи
  ingredients  RecipeIngredient[]
  mealRecipes  MealRecipe[]
  portions     Portion[]

  @@map("recipes")
}

// Быстрые блюда
model QuickDish {
  id          String   @id @default(cuid())
  name        String
  description String?
  // Приблизительные значения БЖУ на 100г
  calories    Float?
  protein     Float?
  carbs       Float?
  fat         Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Связи
  mealDishes MealDish[]
  portions   Portion[]

  @@map("quick_dishes")
}

// Ингредиенты
model Ingredient {
  id        String   @id @default(cuid())
  name      String   @unique
  category  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Связи
  nutritionData    NutritionData?
  recipeIngredients RecipeIngredient[]
  portions         Portion[]
  packagings       ProductPackaging[]

  @@map("ingredients")
}

// Пищевая ценность (на 100г)
model NutritionData {
  id           String @id @default(cuid())
  ingredientId String @unique
  calories     Float
  protein      Float
  carbs        Float
  fat          Float
  fiber        Float?
  sugar        Float?
  sodium       Float?
  // Микронутриенты (будущая функция)
  vitaminA     Float?
  vitaminC     Float?
  calcium      Float?
  iron         Float?

  // Связи
  ingredient Ingredient @relation(fields: [ingredientId], references: [id], onDelete: Cascade)

  @@map("nutrition_data")
}

// Связь рецептов и ингредиентов
model RecipeIngredient {
  id           String @id @default(cuid())
  recipeId     String
  ingredientId String
  amount       Float  // в граммах
  unit         String @default("g")
  notes        String?

  // Связи
  recipe     Recipe     @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  ingredient Ingredient @relation(fields: [ingredientId], references: [id], onDelete: Cascade)

  @@unique([recipeId, ingredientId])
  @@map("recipe_ingredients")
}

// Связь приемов пищи и рецептов
model MealRecipe {
  id       String @id @default(cuid())
  mealId   String
  recipeId String
  servings Float  @default(1)

  // Связи
  meal   Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)
  recipe Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@unique([mealId, recipeId])
  @@map("meal_recipes")
}

// Связь приемов пищи и быстрых блюд
model MealDish {
  id          String @id @default(cuid())
  mealId      String
  quickDishId String
  amount      Float  // в граммах

  // Связи
  meal      Meal      @relation(fields: [mealId], references: [id], onDelete: Cascade)
  quickDish QuickDish @relation(fields: [quickDishId], references: [id], onDelete: Cascade)

  @@unique([mealId, quickDishId])
  @@map("meal_dishes")
}

// История порций
model Portion {
  id           String    @id @default(cuid())
  userId       String
  ingredientId String?
  recipeId     String?
  quickDishId  String?
  amount       Float
  unit         String
  description  String?   // "1 средняя порция", "2 столовые ложки"
  usageCount   Int       @default(1)
  lastUsed     DateTime  @default(now())
  createdAt    DateTime  @default(now())

  // Связи
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  ingredient Ingredient? @relation(fields: [ingredientId], references: [id])
  recipe     Recipe?     @relation(fields: [recipeId], references: [id])
  quickDish  QuickDish?  @relation(fields: [quickDishId], references: [id])

  @@map("portions")
}

// Списки покупок
model GroceryList {
  id        String   @id @default(cuid())
  familyId  String
  name      String
  startDate DateTime
  endDate   DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Связи
  family Family           @relation(fields: [familyId], references: [id], onDelete: Cascade)
  items  GroceryListItem[]

  @@map("grocery_lists")
}

// Элементы списка покупок
model GroceryListItem {
  id            String      @id @default(cuid())
  groceryListId String
  ingredientId  String
  amount        Float
  unit          String
  status        GroceryStatus @default(TO_BUY)
  notes         String?

  // Связи
  groceryList GroceryList @relation(fields: [groceryListId], references: [id], onDelete: Cascade)
  ingredient  Ingredient  @relation(fields: [ingredientId], references: [id])

  @@map("grocery_list_items")
}

enum GroceryStatus {
  TO_BUY      // точно нужно купить
  CHECK_HOME  // проверить наличие дома
  BOUGHT      // куплено
}

// Магазинные фасовки
model ProductPackaging {
  id           String @id @default(cuid())
  ingredientId String
  storeName    String?
  packageSize  Float  // размер упаковки в граммах
  price        Float?
  description  String? // "упаковка 500г", "пачка"
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Связи
  ingredient Ingredient @relation(fields: [ingredientId], references: [id], onDelete: Cascade)

  @@map("product_packagings")
}
```

## ИНДЕКСЫ ДЛЯ ОПТИМИЗАЦИИ

```prisma
// Индексы для производительности
@@index([date, familyId]) // MealPlan
@@index([mealPlanId, type]) // Meal
@@index([userId, lastUsed]) // Portion
@@index([ingredientId, usageCount]) // Portion
@@index([familyId, startDate, endDate]) // GroceryList
@@index([name]) // Ingredient
@@index([category]) // Ingredient
```

## ВАЛИДАЦИЯ ТРЕБОВАНИЙ

**Требования выполнены:**
- ✅ Поддержка семейного режима (Family, FamilyMember)
- ✅ Планирование питания (MealPlan, Meal)
- ✅ Система рецептов (Recipe, RecipeIngredient)
- ✅ Быстрые блюда (QuickDish)
- ✅ Расчет БЖУ (NutritionData)
- ✅ Система измерений (Portion с различными единицами)
- ✅ История популярных порций (Portion с usageCount)
- ✅ Списки покупок (GroceryList, GroceryListItem)
- ✅ Магазинные фасовки (ProductPackaging)
- ✅ Отметка съеденного (isEaten, eatenAt в Meal)

**Техническая осуществимость:** Высокая
**Оценка рисков:** Низкая - стандартная реляционная схема

## ПЛАН РЕАЛИЗАЦИИ

### Этап 1: Базовые модели
1. User, Family, FamilyMember
2. Ingredient, NutritionData
3. Recipe, RecipeIngredient

### Этап 2: Планирование питания
1. MealPlan, Meal
2. MealRecipe, MealDish
3. QuickDish

### Этап 3: Дополнительные функции
1. Portion (история порций)
2. GroceryList, GroceryListItem
3. ProductPackaging

### Этап 4: Оптимизация
1. Добавление индексов
2. Оптимизация запросов
3. Тестирование производительности

🎨🎨🎨 EXITING CREATIVE PHASE - РЕШЕНИЕ ПРИНЯТО 🎨🎨🎨

**Краткое описание:** Выбрана нормализованная схема БД с четким разделением сущностей
**Ключевые решения:**
- Нормализованная архитектура для гибкости и поддерживаемости
- Поддержка семейного режима через Family и FamilyMember
- Гибкая система измерений через Portion
- Оптимизация через индексы вместо денормализации

**Следующие шаги:** Переход к проектированию UI/UX интерфейсов