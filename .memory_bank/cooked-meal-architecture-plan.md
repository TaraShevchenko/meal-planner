# План архитектуры модели CookedMeal

## Обзор задачи

**Цель**: Создать модель `CookedMeal` для персональных блюд пользователей, которая будет основана на существующей модели `Meal` и позволит пользователям корректировать ингредиенты перед приготовлением.

**Сложность**: Уровень 3 (Комплексная интеграция с существующей системой)

## Функциональные требования

### Основной функционал
1. **Создание на основе Meal**: CookedMeal создается как копия существующего Meal с возможностью модификации
2. **Персонализация**: Каждый CookedMeal привязан к конкретному пользователю
3. **Редактирование ингредиентов**: Возможность изменять количество существующих ингредиентов и добавлять новые
4. **Временность данных**: CookedMeal имеет статус (активный/архивный) и автоматически архивируется после использования
5. **Интеграция с планированием**: CookedMeal может использоваться в MealEntry для планирования питания

### Жизненный цикл CookedMeal
1. **Создание**: Пользователь выбирает Meal → создается CookedMeal с копией ингредиентов
2. **Редактирование**: Пользователь корректирует количество ингредиентов, добавляет новые
3. **Использование**: CookedMeal добавляется в MealEntry (прием пищи)
4. **Архивирование**: После отметки о выполнении приема пищи или по желанию пользователя

## Архитектурное решение

### Новые модели данных

#### 1. CookedMeal (Основная модель)
```prisma
model CookedMeal {
  id          String            @id @default(cuid())
  userId      String            // Обязательная привязка к пользователю
  baseMealId  String?           // Ссылка на исходный Meal (может быть null если создан с нуля)
  name        String            // Название (по умолчанию копируется из Meal)
  description String?           // Описание (может быть изменено)
  
  // Статус для управления жизненным циклом
  status      CookedMealStatus  @default(ACTIVE)
  
  // Метаданные
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  archivedAt  DateTime?         // Дата архивирования
  
  // Связи
  user                    User                    @relation(fields: [userId], references: [id], onDelete: Cascade)
  baseMeal                Meal?                   @relation(fields: [baseMealId], references: [id], onDelete: SetNull)
  cookedMealIngredients   CookedMealIngredient[]
  mealEntryCookedMeals    MealEntryCookedMeal[]
  portionHistory          PortionHistory[]
  
  @@index([userId])
  @@index([status])
  @@index([baseMealId])
  @@index([createdAt])
  @@map("cooked_meals")
}

enum CookedMealStatus {
  ACTIVE    // Активное, доступно для использования
  ARCHIVED  // Архивировано, не показывается в основных списках
  
  @@map("cooked_meal_statuses")
}
```

#### 2. CookedMealIngredient (Ингредиенты в приготовленном блюде)
```prisma
model CookedMealIngredient {
  id            String          @id @default(cuid())
  cookedMealId  String
  ingredientId  String
  amount        Float           // Количество ингредиента
  unit          MeasurementUnit // Единица измерения
  
  // Связи
  cookedMeal    CookedMeal      @relation(fields: [cookedMealId], references: [id], onDelete: Cascade)
  ingredient    Ingredient      @relation(fields: [ingredientId], references: [id], onDelete: Cascade)
  
  @@unique([cookedMealId, ingredientId])
  @@map("cooked_meal_ingredients")
}
```

#### 3. MealEntryCookedMeal (Связь с записями питания)
```prisma
model MealEntryCookedMeal {
  id               String         @id @default(cuid())
  mealEntryId      String
  cookedMealId     String
  portionHistoryId String         // Связь с историей порций для указания количества
  
  // Связи
  mealEntry        MealEntry      @relation(fields: [mealEntryId], references: [id], onDelete: Cascade)
  cookedMeal       CookedMeal     @relation(fields: [cookedMealId], references: [id], onDelete: Cascade)
  portionHistory   PortionHistory @relation(fields: [portionHistoryId], references: [id], onDelete: Cascade)
  
  @@unique([mealEntryId, cookedMealId])
  @@map("meal_entry_cooked_meals")
}
```

### Обновления существующих моделей

#### 1. Обновление Meal
```prisma
// Добавить обратную связь с CookedMeal
model Meal {
  // ... существующие поля
  cookedMeals CookedMeal[] // Обратная связь
}
```

#### 2. Обновление MealEntry
```prisma
// Добавить связь с CookedMeal
model MealEntry {
  // ... существующие поля
  mealEntryCookedMeals MealEntryCookedMeal[]
}
```

#### 3. Обновление PortionHistory
```prisma
// Добавить поддержку CookedMeal в ItemType
enum ItemType {
  INGREDIENT
  MEAL
  QUICK_MEAL
  COOKED_MEAL // Новый тип
}

// Добавить связь с CookedMeal
model PortionHistory {
  // ... существующие поля
  mealEntryCookedMeals MealEntryCookedMeal[]
  CookedMeal           CookedMeal?         @relation(fields: [cookedMealId], references: [id])
  cookedMealId         String?
}
```

#### 4. Обновление Ingredient
```prisma
// Добавить связь с CookedMealIngredient
model Ingredient {
  // ... существующие поля
  cookedMealIngredients CookedMealIngredient[]
}
```

## Основные функции

### Создание и управление
- **Создание из рецепта**: Копирование Meal с возможностью модификации ингредиентов
- **Создание с нуля**: Создание персонального блюда без базового рецепта
- **Редактирование**: Изменение количества ингредиентов, добавление/удаление ингредиентов
- **Архивирование**: Перевод в архивный статус после использования или вручную

### Интеграция
- **Планирование питания**: Использование в MealEntry наравне с обычными блюдами
- **Расчет пищевой ценности**: Динамический расчет на основе текущих ингредиентов
- **История порций**: Сохранение предпочтений пользователя для быстрого доступа

## Интеграция с пользовательским интерфейсом

### Компоненты

1. **CookedMealForm** - Форма создания/редактирования
2. **CookedMealIngredientList** - Список ингредиентов с возможностью редактирования
3. **CookedMealSelector** - Выбор CookedMeal для добавления в MealEntry
4. **CookedMealArchive** - Управление архивом

### Пользовательские сценарии

1. **Создание из рецепта**:
   - Пользователь выбирает Meal
   - Открывается форма с предзаполненными ингредиентами
   - Пользователь корректирует количества
   - Сохраняет CookedMeal

2. **Планирование питания**:
   - При добавлении блюда в MealEntry
   - Пользователь может выбрать между Meal, QuickMeal и CookedMeal
   - CookedMeal показывается с пометкой "персональный"

3. **Автоматическое архивирование**:
   - При отметке MealEntry как выполненного
   - Все связанные CookedMeal автоматически архивируются

## Миграция данных

### Этапы миграции

1. **Создание новых таблиц**:
   ```sql
   -- Будет сгенерировано Prisma
   CREATE TABLE "cooked_meals" (...)
   CREATE TABLE "cooked_meal_ingredients" (...)
   CREATE TABLE "meal_entry_cooked_meals" (...)
   ```

2. **Обновление существующих таблиц**:
   ```sql
   -- Добавление новых enum значений
   ALTER TYPE "ItemType" ADD VALUE 'COOKED_MEAL';
   
   -- Добавление новых полей в PortionHistory
   ALTER TABLE "portion_history" ADD COLUMN "cookedMealId" TEXT;
   ```

3. **Создание индексов**:
   ```sql
   CREATE INDEX "cooked_meals_userId_idx" ON "cooked_meals"("userId");
   CREATE INDEX "cooked_meals_status_idx" ON "cooked_meals"("status");
   -- и другие индексы
   ```

## Потенциальные вызовы и решения

### Вызов 1: Производительность при расчете пищевой ценности
**Решение**: 
- Динамический расчет на основе ингредиентов (единый источник истины)
- Оптимизация запросов с включением данных об ингредиентах
- Кэширование на уровне приложения при необходимости

### Вызов 2: Управление жизненным циклом
**Решение**:
- Четкие статусы (ACTIVE/ARCHIVED)
- Автоматическое архивирование через API hooks
- Возможность ручного управления статусом

### Вызов 3: Интеграция с существующей системой порций
**Решение**:
- Расширение ItemType для поддержки COOKED_MEAL
- Использование существующей логики PortionHistory
- Совместимость с текущими API

### Вызов 4: Сложность пользовательского интерфейса
**Решение**:
- Поэтапное внедрение UI компонентов
- Переиспользование существующих компонентов для ингредиентов
- Четкое разделение между созданием и редактированием

## Следующие шаги

1. **Фаза 1**: Создание моделей данных и миграций
2. **Фаза 2**: Реализация базового API
3. **Фаза 3**: Создание пользовательского интерфейса
4. **Фаза 4**: Интеграция с системой планирования
5. **Фаза 5**: Тестирование и оптимизация

## Критерии готовности

- [ ] Модели данных созданы и протестированы
- [ ] API полностью функционален
- [ ] Пользовательский интерфейс интуитивен
- [ ] Интеграция с MealEntry работает корректно
- [ ] Система архивирования функционирует
- [ ] Производительность соответствует требованиям
- [ ] Покрытие тестами > 80%