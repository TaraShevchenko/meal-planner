# Technical Context: Meal Planner

## Технический стек

### Frontend

#### Core Framework
- **Next.js 14+** - React фреймворк с App Router
- **React 18+** - UI библиотека с Server Components
- **TypeScript 5+** - Типизированный JavaScript

#### Styling & UI
- **Tailwind CSS** - Utility-first CSS фреймворк
- **shadcn/ui** - Компонентная библиотека
- **Radix UI** - Headless UI компоненты (основа shadcn/ui)
- **Lucide React** - Иконки

#### State Management
- **TanStack Query (React Query)** - Server state management
- **TanStack Form** - Form state management
- **Zustand** - Client state management
- **Zod** - Schema validation

### Backend

#### API Layer
- **tRPC** - End-to-end typesafe APIs
- **Next.js API Routes** - Serverless functions
- **Zod** - Runtime validation

#### Database
- **PostgreSQL** - Основная база данных
- **Prisma** - ORM и миграции
- **Supabase** - Hosted PostgreSQL (рекомендуемый провайдер)

#### Authentication
- **NextAuth.js** - Authentication library
- **Google OAuth** - Единственный провайдер аутентификации
- **JWT** - Session strategy

### DevOps & Infrastructure

#### Hosting
- **Vercel** - Frontend и API hosting
- **Supabase** - Database hosting
- **Vercel Edge Functions** - Serverless compute

#### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

## Архитектурные решения

### T3 Stack Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // Google avatars
  },
}

module.exports = nextConfig
```

### Database Schema Design

#### Core Entities
```prisma
// prisma/schema.prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  meals         Meal[]
  recipes       Recipe[]
  familyMembers FamilyMember[]
  families      Family[]
  
  @@map("users")
}

model Family {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  members   FamilyMember[]
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  
  @@map("families")
}

model Ingredient {
  id                String  @id @default(cuid())
  name              String
  brand             String?
  barcode           String? @unique
  
  // Nutrition per 100g
  calories          Float
  protein           Float
  carbs             Float
  fat               Float
  fiber             Float?
  sugar             Float?
  
  // Package info
  minPackageSize    Float   // Minimum package size in grams
  commonPackageSizes Float[] // Common package sizes
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  recipeIngredients RecipeIngredient[]
  mealIngredients   MealIngredient[]
  
  @@map("ingredients")
}

model Recipe {
  id          String   @id @default(cuid())
  name        String
  description String?
  servings    Int      @default(1)
  prepTime    Int?     // minutes
  cookTime    Int?     // minutes
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  ingredients RecipeIngredient[]
  meals       MealRecipe[]
  
  @@map("recipes")
}

model Meal {
  id        String   @id @default(cuid())
  date      DateTime
  type      MealType
  completed Boolean  @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  recipes   MealRecipe[]
  quickMeals QuickMeal[]
  ingredients MealIngredient[]
  
  @@map("meals")
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}
```

### tRPC Router Structure

```typescript
// server/api/routers/meal.ts
export const mealRouter = createTRPCRouter({
  // Get meals for date range
  getByDateRange: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
      userId: z.string().optional(), // For family mode
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id
      
      return await ctx.db.meal.findMany({
        where: {
          userId,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        include: {
          recipes: {
            include: {
              recipe: {
                include: {
                  ingredients: {
                    include: {
                      ingredient: true,
                    },
                  },
                },
              },
            },
          },
          quickMeals: true,
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      })
    }),

  // Add meal
  create: protectedProcedure
    .input(createMealSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.meal.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      })
    }),

  // Mark meal as completed
  markCompleted: protectedProcedure
    .input(z.object({
      id: z.string(),
      completed: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.meal.update({
        where: { id: input.id },
        data: { completed: input.completed },
      })
    }),
})
```

### State Management Patterns

#### Server State (TanStack Query + tRPC)
```typescript
// features/meal-planning/api/useMeals.ts
export function useMeals(dateRange: DateRange, userId?: string) {
  return api.meal.getByDateRange.useQuery({
    startDate: dateRange.from,
    endDate: dateRange.to,
    userId,
  })
}

export function useAddMeal() {
  const utils = api.useUtils()
  
  return api.meal.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch meals
      utils.meal.getByDateRange.invalidate()
    },
  })
}
```

#### Client State (Zustand)
```typescript
// features/family-mode/model/familyStore.ts
interface FamilyState {
  selectedFamily: Family | null
  selectedMembers: string[]
  isGroupMode: boolean
  
  setSelectedFamily: (family: Family | null) => void
  toggleMember: (memberId: string) => void
  setGroupMode: (enabled: boolean) => void
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  selectedFamily: null,
  selectedMembers: [],
  isGroupMode: false,
  
  setSelectedFamily: (family) => set({ selectedFamily: family }),
  
  toggleMember: (memberId) => set((state) => ({
    selectedMembers: state.selectedMembers.includes(memberId)
      ? state.selectedMembers.filter(id => id !== memberId)
      : [...state.selectedMembers, memberId]
  })),
  
  setGroupMode: (enabled) => set({ isGroupMode: enabled }),
}))
```

### Performance Optimizations

#### Database Optimizations
```prisma
// Indexes for common queries
model Meal {
  // ... fields
  
  @@index([userId, date])
  @@index([date, type])
}

model Recipe {
  // ... fields
  
  @@index([authorId])
  @@index([name])
}

model Ingredient {
  // ... fields
  
  @@index([name])
  @@index([barcode])
}
```

#### React Optimizations
```typescript
// Memoized nutrition calculations
export const useNutritionCalculation = (meals: Meal[]) => {
  return useMemo(() => {
    return NutritionCalculator.calculateDayNutrition(meals)
  }, [meals])
}

// Virtualized lists for large datasets
import { FixedSizeList as List } from 'react-window'

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <IngredientCard ingredient={ingredients[index]} />
    </div>
  )
  
  return (
    <List
      height={400}
      itemCount={ingredients.length}
      itemSize={80}
    >
      {Row}
    </List>
  )
}
```

### Security Considerations

#### Authentication Middleware
```typescript
// server/api/trpc.ts
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
```

#### Data Validation
```typescript
// shared/lib/validation/schemas.ts
export const createMealSchema = z.object({
  date: z.date(),
  type: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  recipes: z.array(z.object({
    recipeId: z.string(),
    servings: z.number().positive(),
  })).optional(),
  quickMeals: z.array(z.object({
    name: z.string().min(1),
    calories: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fat: z.number().nonnegative(),
  })).optional(),
})
```

### Environment Configuration

```typescript
// env.mjs
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      z.string().url()
    ),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
  },
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
})
```

### Deployment Strategy

#### Vercel Configuration
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["fra1"],
  "framework": "nextjs"
}
```

#### Database Migrations
```bash
# Development
npx prisma db push

# Production
npx prisma migrate deploy
```

### Monitoring & Analytics

#### Error Tracking
- **Sentry** - Error monitoring
- **Vercel Analytics** - Performance monitoring
- **PostHog** - User analytics (опционально)

#### Logging
```typescript
// shared/lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty'
  } : undefined,
})
```

### Testing Strategy

#### Unit Tests
- **Vitest** - Test runner
- **Testing Library** - React component testing
- **MSW** - API mocking

#### E2E Tests
- **Playwright** - End-to-end testing
- **Test scenarios:** Auth flow, meal planning, family mode

---

**Последнее обновление:** $(Get-Date -Format "yyyy-MM-dd")
**Tech Lead:** Senior Developer
**Статус:** Готов к реализации