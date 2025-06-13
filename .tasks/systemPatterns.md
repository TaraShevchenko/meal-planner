# System Patterns: Meal Planner Architecture

## Evolution Design Архитектура

### Основные принципы

#### 1. Прагматизм

- Каждый паттерн имеет четкое обоснование
- Границы применимости определены
- Связи между паттернами документированы
- Подбор паттернов под конкретные потребности проекта

#### 2. Постепенность

- Архитектура развивается вместе с проектом
- Начинаем с простых решений
- Усложняем по мере необходимости
- Поддержка миграции между уровнями сложности

#### 3. Непротиворечивость

- Совмещение DRY, YAGNI, OOP, FP принципов
- Интеграция SOLID и GRASP паттернов
- Элементы Clean Architecture и DDD
- Единая система понимания архитектуры

## Слоевая архитектура

> **Статус рефакторинга серверного слоя:** ✅ ЗАВЕРШЕН (2024-12-19)  
> - Миграция всех API компонентов в `src/shared/api/`
> - Централизация серверной логики в едином месте
> - Архивирование плана рефакторинга в `.tasks/archive/`

### App Layer (Приложение)

```
/src/app/
├── (auth)/          # Группа маршрутов аутентификации
├── (dashboard)/     # Основное приложение
├── api/             # Next.js API роуты
│   ├── auth/        # NextAuth.js роуты
│   └── trpc/        # tRPC HTTP обработчики
├── globals.css      # Глобальные стили
├── layout.tsx       # Корневой layout
└── page.tsx         # Главная страница
```

### Pages Layer (Страницы)

```
/src/pages/
├── meal-planner/    # Страницы планировщика
├── recipes/         # Страницы рецептов
├── family/          # Семейный режим
├── shopping/        # Заказ продуктов
└── profile/         # Профиль пользователя
```

### Widgets Layer (Виджеты)

```
/src/widgets/
├── meal-planner/    # Виджет планировщика питания
├── nutrition-info/  # Виджет пищевой ценности
├── recipe-card/     # Карточка рецепта
├── family-selector/ # Селектор семьи
└── shopping-list/   # Список покупок
```

### Module Layer (Модули - объединенные feature и entities)

```
/src/modules/
├── user/            # Пользователь
│   └── api/         # router.ts (мигрировано из server/)
├── meal/            # Прием пищи
├── recipe/          # Рецепт
│   └── api/         # router.ts (мигрировано из server/)
├── ingredient/      # Ингредиент
│   └── api/         # router.ts (мигрировано из server/)
├── nutrition/       # Пищевая ценность
└── family/          # Семья
    └── api/         # router.ts (мигрировано из server/)
```

### Shared Layer (Общее)

```
/src/shared/
├── ui/              # shadcn/ui компоненты
├── lib/             # Утилиты и хелперы
├── api/             # Серверная логика (мигрировано из server/)
│   ├── auth.ts      # NextAuth конфигурация
│   ├── client.tsx   # tRPC клиент
│   ├── db.ts        # Prisma подключение
│   ├── root.ts      # Главный tRPC роутер (импортировать роутеры нужно напрямую из файла роутера а не из public api)
│   ├── server.ts    # Серверный tRPC клиент
│   └── trpc.ts      # tRPC конфигурация
├── config/          # Конфигурация
├── types/           # TypeScript типы
└── constants/       # Константы
```

## Паттерны по слоям

### App Layer Patterns

#### Layout Pattern

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <TRPCProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  )
}
```

#### Route Groups Pattern

```
(auth)/
├── login/page.tsx
├── register/page.tsx
└── layout.tsx       # Auth-specific layout

(dashboard)/
├── planner/page.tsx
├── recipes/page.tsx
└── layout.tsx       # Dashboard layout
```

### Pages Layer Patterns

#### Page Composition Pattern

```typescript
// pages/meal-planner/page.tsx
export default function MealPlannerPage() {
  return (
    <>
      <MealPlannerWidget />
      <NutritionInfoWidget />
      <QuickActionsWidget />
    </>
  )
}
```

### Widgets Layer Patterns

#### Widget Container Pattern

```typescript
// widgets/meal-planner/ui/MealPlannerWidget.tsx
export function MealPlannerWidget() {
  return (
    <Card>
      <CardHeader>
        <AddMealFeature />
      </CardHeader>
      <CardContent>
        <MealListFeature />
      </CardContent>
    </Card>
  )
}
```

### Features Layer Patterns

#### Feature Slice Pattern

```
features/meal-planning/
├── api/             # tRPC процедуры
├── model/           # Состояние и логика
├── ui/              # UI компоненты
└── index.ts         # Public API
```

#### Feature API Pattern

```typescript
// features/meal-planning/api/mealApi.ts
export const mealApi = {
  addMeal: publicProcedure
    .input(addMealSchema)
    .mutation(async ({ input, ctx }) => {
      // Логика добавления приема пищи
    }),

  getMeals: publicProcedure
    .input(getMealsSchema)
    .query(async ({ input, ctx }) => {
      // Логика получения приемов пищи
    }),
};
```

### Entities Layer Patterns

#### Entity Model Pattern

```typescript
// entities/meal/model/types.ts
export interface Meal {
  id: string;
  userId: string;
  date: Date;
  type: MealType;
  recipes: Recipe[];
  quickMeals: QuickMeal[];
  nutrition: NutritionInfo;
}

// entities/meal/model/schema.ts
export const mealSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  // ...
});
```

#### Entity Repository Pattern

```typescript
// entities/meal/api/mealRepository.ts
export class MealRepository {
  async create(meal: CreateMealInput): Promise<Meal> {
    return await db.meal.create({ data: meal });
  }

  async findByUserAndDate(userId: string, date: Date): Promise<Meal[]> {
    return await db.meal.findMany({
      where: { userId, date },
    });
  }
}
```

### Shared Layer Patterns

#### UI Component Pattern

```typescript
// shared/ui/Button/Button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
```

#### API Client Pattern

```typescript
// shared/api/trpc.ts
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});
```

## Специфичные паттерны проекта

### Nutrition Calculation Pattern

```typescript
// shared/lib/nutrition/calculator.ts
export class NutritionCalculator {
  static calculateMealNutrition(meal: Meal): NutritionInfo {
    const recipeNutrition = meal.recipes.reduce(
      (acc, recipe) =>
        this.addNutrition(acc, this.calculateRecipeNutrition(recipe)),
      this.emptyNutrition(),
    );

    const quickMealNutrition = meal.quickMeals.reduce(
      (acc, quickMeal) => this.addNutrition(acc, quickMeal.nutrition),
      this.emptyNutrition(),
    );

    return this.addNutrition(recipeNutrition, quickMealNutrition);
  }
}
```

### Family Mode Pattern

```typescript
// features/family-mode/model/familyStore.ts
export const useFamilyStore = create<FamilyState>((set, get) => ({
  selectedMembers: [],
  currentFamily: null,

  selectMember: (memberId: string) => {
    set((state) => ({
      selectedMembers: [...state.selectedMembers, memberId],
    }));
  },

  planForFamily: (meal: Meal) => {
    const { selectedMembers } = get();
    return selectedMembers.map((memberId) => ({
      ...meal,
      userId: memberId,
    }));
  },
}));
```

### Shopping List Pattern

```typescript
// features/shopping-assistant/model/shoppingCalculator.ts
export class ShoppingCalculator {
  static generateShoppingList(
    meals: Meal[],
    dateRange: DateRange,
    familyMembers: string[],
  ): ShoppingList {
    const ingredients = this.extractIngredients(meals);
    const aggregated = this.aggregateIngredients(ingredients);

    return {
      mustBuy: aggregated.filter(
        (item) => item.totalAmount >= item.ingredient.minPackageSize,
      ),
      checkAvailability: aggregated.filter(
        (item) => item.totalAmount < item.ingredient.minPackageSize,
      ),
    };
  }
}
```

## Интеграционные паттерны

### tRPC Integration Pattern

```typescript
// server/api/root.ts
export const appRouter = createTRPCRouter({
  auth: authRouter,
  meals: mealRouter,
  recipes: recipeRouter,
  family: familyRouter,
  shopping: shoppingRouter,
});

export type AppRouter = typeof appRouter;
```

### Database Pattern

```typescript
// shared/lib/db/prisma.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### Auth Pattern

```typescript
// shared/lib/auth/config.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
};
```

## Правила и ограничения

### Импорты между слоями

- **App** может импортировать: Pages, Widgets, Features, Entities, Shared
- **Pages** может импортировать: Widgets, Features, Entities, Shared
- **Widgets** может импортировать: Features, Entities, Shared
- **Features** может импортировать: Entities, Shared
- **Entities** может импортировать: Shared
- **Shared** не может импортировать другие слои

### Серверные vs Клиентские компоненты

- **Server Components:** Pages, некоторые Widgets
- **Client Components:** Интерактивные Features, UI компоненты
- **Shared Components:** Могут быть и серверными, и клиентскими

### Состояние приложения

- **Server State:** tRPC + TanStack Query
- **Client State:** Zustand для сложного состояния
- **Form State:** React Hook Form + Zod
- **URL State:** Next.js router

## История изменений архитектуры

### 2024-12-19: Рефакторинг серверного слоя ✅
- Устранен слой `src/server/` нарушающий принципы чистой архитектуры
- Мигрированы компоненты в `app/api/` и `modules/*/api/`
- Устранены импорты из modules в shared
- Соблюдены принципы Evolution Design
- Архивирован план в `.tasks/archive/server-layer-refactoring.md`

### Текущие архитектурные решения
- **Серверные компоненты:** Размещены в `app/api/`
- **Модульные роутеры:** Изолированы в `modules/*/api/`
- **Общие утилиты:** Остаются в `shared/`
- **Безопасность слоев:** Строго соблюдается

---

**Последнее обновление:** 2024-12-19
**Архитектор:** Senior Developer
**Статус:** Активная разработка - Модуль авторизации
