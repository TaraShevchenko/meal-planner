# АРХИТЕКТУРА СТРАНИЦЫ ПЛАНЕРА ПИТАНИЯ

## ОБЗОР ЗАДАЧИ

**Цель:** Создание первой страницы планера питания согласно техническому заданию
**Сложность:** Уровень 4 (системная задача)
**Статус:** Планирование

## ТЕХНИЧЕСКОЕ ЗАДАНИЕ

### Структура страницы

1. **Хедер страницы:**

   - Название страницы (слева)
   - Выбор даты (справа)
   - Быстрые кнопки: Вчера → Сегодня → Завтра → Выбор другой даты

2. **Основная колонка (1/4 экрана на desktop, полная ширина на mobile):**

   - Day Nutrition Summary - суммаризация БЖУ за день
   - Блок добавления приемов пищи (4 кнопки: breakfast, lunch, dinner, snack)
   - Карточки приемов пищи с drag-and-drop
   - Система завершения приемов пищи с временем

3. **Боковая колонка (3/4 экрана на desktop, скрыта на mobile, открываеться как sidebar):**
   - Таблица готовых блюд (опциональная)
   - Таблица базовых продуктов
   - Поиск и сортировка
   - Быстрые кнопки добавления

## АРХИТЕКТУРА КОМПОНЕНТОВ

### Структура файлов

```
src/
├── app/
│   └── planner/
│       ├── page.tsx                 # Главная страница планера
│       └── components/
│           ├── MainColumn.tsx       # Основная колонка
│           └── SideColumn.tsx       # Боковая колонка
├── modules/
│   ├── ingredient/
│   │   ├── ui/
│   │   │   ├── IngredientForm.tsx   # Форма создания/редактирования
│   │   │   └── IngredientCard.tsx   # Карточка ингредиента
│   │   ├── hooks/
│   │   │   └── useIngredient.ts     # Хуки для ингредиентов
│   │   └── model/
│   │       ├── router.ingredient.ts # tRPC роутер для ингредиентов
│   │       └── types.ingredient.ts  # Типы для ингредиентов
│   ├── meal/
│   │   ├── ui/
│   │   │   ├── MealForm.tsx         # Форма создания/редактирования
│   │   │   └── MealCard.tsx         # Карточка блюда
│   │   ├── hooks/
│   │   │   └── useMeal.ts           # Хуки для блюд
│   │   └── model/
│   │       │── router.meal.ts       # tRPC роутер для блюд
│   │       └── types.meal.ts        # Типы для блюд
│   ├── quick-meal/
│   │   ├── ui/
│   │   │   ├── QuickMealForm.tsx    # Форма создания/редактирования
│   │   │   └── QuickMealCard.tsx    # Карточка быстрого блюда
│   │   ├── hooks/
│   │   │   └── useQuickMeal.ts      # Хуки для быстрых блюд
│   │   └── model/
│   │       │── router.quick-meal.ts # tRPC роутер для быстрых блюд
│   │       └── types.quick-meal.ts  # Типы для быстрых блюд
│   ├── cooked-meal/
│   │   ├── ui/
│   │   │   ├── CookedMealForm.tsx   # Форма создания/редактирования
│   │   │   └── CookedMealCard.tsx   # Карточка готового блюда
│   │   ├── hooks/
│   │   │   └── useCookedMeal.ts     # Хуки для готовых блюд
│   │   └── model/
│   │       │── router.cooked-meal.ts # tRPC роутер для готовых блюд
│   │       └── types.cooked-meal.ts # Типы для готовых блюд
│   └── meal-entry/
│       ├── ui/
│       │   ├── DateNavigationButtons.tsx # Навигация по датам
│       │   ├── DayNutritionSummary.tsx # Суммаризация БЖУ
│       │   ├── MealTypeSelector.tsx # Кнопки добавления приемов
│       │   ├── MealEntryCard.tsx    # Карточка приема пищи
│       │   ├── MealEntryForm.tsx    # Форма создания/редактирования
│       │   └── drag-drop/
│       │       ├── DragDropProvider.tsx
│       │       ├── DroppableArea.tsx
│       │       └── DraggableMealCard.tsx
│       ├── hooks/
│       │   ├── useMealPlanner.ts    # Основной хук состояния
│       │   ├── useDragDrop.ts       # Хук для drag-and-drop
│       │   └── usePortionHistory.ts # Хук для истории порций
│       └── model/
│           └── router.meal-entry.ts # tRPC роутер для приемов пищи
│           └── types.meal-entry.ts  # Типы для приемов пищи
├── widgets/
│   └── products-table/
│       ├── ui/
│       │   ├── ProductsTable.tsx    # Композиционный виджет
│       │   ├── ProductsTableHeader.tsx   # Хедер таблицы
│       │   └── ProductsTableRow.tsx      # Строка таблицы
│       ├── hooks/
│       │   ├── useProductsData.ts   # Хук для получения данных
│       │   └── useProductsActions.ts # Хук для действий
│       └── model/
│           │── router.products-table.ts # tRPC роутер для виджета
└───────────└── types.products-table.ts  # Типы для виджета


```

### Ключевые компоненты

#### 1. DateNavigationButtons (meal-entry модуль)

```typescript
// src/modules/meal-entry/ui/DateNavigationButtons.tsx
interface DateNavigationButtonsProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}
```

**Функционал:**

- Быстрые кнопки навигации по датам
- Date picker для выбора произвольной даты
- Адаптивность для мобильных устройств

#### 2. DayNutritionSummary (meal-entry модуль)

```typescript
// src/modules/meal-entry/ui/DayNutritionSummary.tsx
interface NutritionSummary {
  selectedDate: Date;
}
// этот компонент делает запрос который импортируеться из роутера и отображает данные сумаризации конкретного дня
```

**Функционал:**

- Автоматический расчет БЖУ на основе всех приемов пищи
- Визуализация прогресса (прогресс-бары или круговые диаграммы)
- Сравнение с целевыми значениями (если настроены)

#### 3. MealEntryCard и MealEntryCardList (meal-entry модуль)

```typescript
// src/modules/meal-entry/ui/MealEntryCardList.tsx
interface MealEntryCardProps {
  selectedDate: Date;
  onSetActive: (id: string) => void;
}
// этот компонент делает запрос который импортируеться из роутера и мапит все MealEntry этого дня
```

```typescript
// src/modules/meal-entry/ui/MealEntryCard.tsx
interface MealEntryCardProps {
  mealEntry: MealEntry;
  onComplete: (id: string, time: Date) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTime: (id: string, time: Date) => void;
  onSetActive: (id: string) => void;
}
```

**Функционал:**

- Отображение типа приема пищи
- Список ингредиентов/блюд с количествами
- Суммаризация БЖУ для приема пищи
- Кнопки управления (завершить, удалить)
- Drag-and-drop функционал
- Редактирование времени выполнения

#### 4. ProductsTable (виджет)

```typescript
// src/widgets/products-table/ui/ProductsTable.tsx
interface ProductsTableProps {
  activeMealId: string;
}

type ProductItem = Ingredient | Meal | QuickMeal | CookedMeal;
```

**Функционал:**

- Композиционный виджет, объединяющий данные из всех модулей
- Использует универсальную DataTable из shared/ui
- Поиск по названию через useProductsData хук
- Сортировка (алфавит, последнее использование, частота)
- Быстрые кнопки добавления с популярными порциями
- Интеграция с формами создания из соответствующих модулей

#### 5. Модульные формы

```typescript
// src/modules/ingredient/ui/IngredientForm.tsx
interface IngredientFormProps {
  mode: "create" | "edit";
  initialData?: Ingredient;
}

// src/modules/meal/ui/MealForm.tsx
interface MealFormProps {
  mode: "create" | "edit";
  initialData?: Meal;
}

// Аналогично для QuickMealForm и CookedMealForm
```

**Функционал:**

- Каждый модуль содержит свои формы создания/редактирования
- Переиспользуемые компоненты с режимами create/edit
- Валидация через react-hook-form + zod
- Интеграция с соответствующими tRPC роутерами

## ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Основные библиотеки

1. **Drag and Drop:** `@dnd-kit/core` + `@dnd-kit/sortable`

   - Современная, accessibility-friendly библиотека
   - Лучшая производительность по сравнению с react-beautiful-dnd
   - Поддержка touch устройств

2. **Управление состоянием:** useState

3. **Формы:** `react-hook-form` + `@hookform/resolvers/zod`

   - Уже используется в проекте
   - Интеграция с Zod для валидации

4. **Дата/время:** `date-fns`

   - Легковесная альтернатива moment.js
   - Tree-shakable

5. **UI компоненты:** Radix UI + Tailwind CSS
   - Уже настроено в проекте
   - Accessibility из коробки

### Новые зависимости

```json
// если совместимы с текущим стеком то latest
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "date-fns": "^3.0.0"
}
```

### Архитектурные принципы

- **Модульность**: Каждый модуль содержит свои компоненты, хуки, типы и формы
- **Композиция**: Виджеты объединяют данные из разных модулей
- **Переиспользование**: Общие UI компоненты в shared/ui
- **Разделение ответственности**: API логика в роутерах, UI логика в компонентах
