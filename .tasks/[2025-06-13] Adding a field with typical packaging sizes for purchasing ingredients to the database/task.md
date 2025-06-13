# MEMORY BANK - MEAL PLANNER PROJECT

## CURRENT TASK

**Добавление поля с типичными фасовками для покупки ингредиентов в БД**

### TASK DESCRIPTION

Добавить новое поле в модель ингредиентов, которое будет содержать список возможных фасовок (граммовок/объёмов) для покупки данного товара в магазине. Это поле будет использоваться для генерации более реалистичных списков покупок.

### COMPLEXITY LEVEL: 3

**Обоснование:** Задача требует изменения схемы базы данных, создания миграции, обновления интерфейса администрирования и модификации логики генерации списков покупок. Затрагивает несколько компонентов системы.

### REQUIREMENTS ANALYSIS

1. **Database Schema Changes:**

    - Добавить поле `availablePackageSizes` типа массив чисел в модель `Ingredients`
    - Создать миграцию Prisma для обновления БД

2. **Admin Interface Updates:**

    - Обновить форму редактирования ингредиентов
    - Добавить UI для ввода массива фасовок
    - Валидация данных (только положительные числа)

3. **Shopping List Logic:**
    - Модифицировать алгоритм генерации списков покупок
    - Учитывать ближайшую большую доступную фасовку
    - Обработка случаев, когда фасовки не заданы

### CURRENT PROJECT STRUCTURE

-   **Database:** PostgreSQL с Prisma ORM
-   **Framework:** Next.js с TypeScript
-   **UI:** Tailwind CSS, возможно Shadcn UI
-   **Architecture:** Модульная структура (src/module/, src/core/, src/shared/)

### AFFECTED COMPONENTS

1. **Database Layer:**

    - `prisma/schema.prisma` - модель Ingredients
    - Новая миграция

2. **Admin Interface:**

    - Компоненты редактирования ингредиентов
    - Формы и валидация

3. **Shopping List Generation:**
    - Логика расчета количеств
    - Алгоритм выбора оптимальной фасовки

### IMPLEMENTATION STRATEGY

#### **Phase 1: Database Schema Update**

1. **Prisma Schema Modification**

    - Добавить поле `availablePackageSizes Float[]` в модель `Ingredients`
    - Создать миграцию для обновления существующей таблицы
    - Обновить seed данные с примерами фасовок

2. **TypeScript Types Update**
    - Обновить типы после генерации Prisma Client
    - Добавить валидационные схемы для новых полей

#### **Phase 2: Admin Interface Development**

1. **Create Ingredients Management Interface**

    - Создать новый модуль `src/module/Ingredients/`
    - Реализовать CRUD операции для ингредиентов
    - Добавить TRPC процедуры для управления ингредиентами

2. **Package Sizes Input Component**

    - Создать компонент для ввода массива чисел (фасовок)
    - Реализовать валидацию (только положительные числа)
    - Добавить возможность добавления/удаления фасовок

3. **Admin Page Creation**
    - Создать страницу администрирования ингредиентов
    - Интегрировать форму редактирования с новыми полями
    - Добавить таблицу со списком всех ингредиентов

#### **Phase 3: Shopping List Logic Enhancement**

1. **Package Size Selection Algorithm**

    - Модифицировать `src/module/Order/model/api.ts`
    - Реализовать функцию выбора оптимальной фасовки
    - Учитывать ближайшую большую доступную фасовку

2. **Backward Compatibility**

    - Обработка ингредиентов без заданных фасовок
    - Fallback к точному количеству из рецепта

3. **UI Updates**
    - Обновить отображение в `OrderTable` для показа фасовок
    - Добавить индикацию оптимизированных количеств

### POTENTIAL CHALLENGES

1. **Data Migration:** Существующие ингредиенты будут иметь пустые массивы фасовок
2. **UI/UX Design:** Удобный интерфейс для ввода массива чисел
3. **Algorithm Complexity:** Оптимальный выбор фасовки при множественных ингредиентах
4. **Backward Compatibility:** Обработка ингредиентов без заданных фасовок

### DETAILED IMPLEMENTATION STEPS

#### **Phase 1: Database Schema (2-3 hours)**

1. **Modify Prisma Schema** (`prisma/schema.prisma`)

    ```prisma
    model Ingredients {
      // ... existing fields
      availablePackageSizes Float[] @default([])
    }
    ```

2. **Create Migration**

    ```bash
    npx prisma migrate dev --name add_available_package_sizes
    ```

3. **Update Seed Data** (`src/shared/seed/data/Ingredients.data.ts`)
    - Добавить примеры фасовок для каждого ингредиента
    - Гречка: [500, 1000], Масло: [250, 500, 1000]

#### **Phase 2: Admin Interface (8-10 hours)**

1. **Create Ingredients Module Structure**

    ```
    src/module/Ingredients/
    ├── model/
    │   ├── api.ts (TRPC procedures)
    │   ├── hooks/
    │   ├── schemes.ts (validation)
    │   └── types.ts
    ├── ui/
    │   ├── IngredientsTable/
    │   ├── IngredientForm/
    │   └── PackageSizesInput/ 🎨 CREATIVE COMPONENT
    └── index.ts
    ```

2. **TRPC Procedures** (Add to existing or new router)

    - `getIngredients` (enhance existing)
    - `createIngredient`
    - `updateIngredient`
    - `deleteIngredient`

3. **🎨 CREATIVE: Package Sizes Input Component**

    - Dynamic array input with add/remove buttons
    - Real-time validation
    - User-friendly UX for managing multiple values

4. **Admin Page** (`src/app/[locale]/admin/ingredients/page.tsx`)
    - Table with all ingredients
    - Edit/Create forms
    - Package sizes display

#### **Phase 3: Shopping List Enhancement (4-6 hours)**

1. **🎨 CREATIVE: Package Selection Algorithm**

    ```typescript
    function selectOptimalPackageSize(requiredAmount: number, availableSizes: number[]): number {
        // Find smallest package that covers required amount
        // Fallback to exact amount if no packages defined
    }
    ```

2. **Modify Order API** (`src/module/Order/model/api.ts`)

    - Include `availablePackageSizes` in ingredient queries
    - Apply package selection logic
    - Update `IngredientOrder` type to include package info

3. **UI Enhancements** (`src/module/Order/ui/OrderTable/OrderTable.tsx`)
    - Show optimized vs required amounts
    - Visual indicators for package optimization

### CREATIVE PHASE COMPONENTS - COMPLETED ✅

🎨 **Component 1: Package Sizes Input Interface** ✅

-   **Type:** UI/UX Design
-   **Challenge:** Create intuitive interface for managing array of numbers
-   **DECISION:** Dynamic Input List with Add/Remove Buttons
-   **Rationale:** Clearest UX, familiar patterns, best accessibility
-   **Document:** `creative-phase-package-input.md`

🎨 **Component 2: Package Selection Algorithm** ✅

-   **Type:** Algorithm Design
-   **Challenge:** Optimal package selection logic
-   **DECISION:** Simple Smallest-Sufficient Algorithm
-   **Rationale:** Optimal balance of functionality and maintainability
-   **Document:** `creative-phase-algorithm.md`

🎨 **Component 3: Shopping List Visualization** ✅

-   **Type:** UI/UX Design
-   **Challenge:** Clear display of optimized vs required amounts
-   **DECISION:** Expandable Detail Cards
-   **Rationale:** Progressive disclosure, mobile-friendly, accessible
-   **Document:** `creative-phase-visualization.md`

### TECHNOLOGY VALIDATION

✅ **Verified Technologies:**

-   **Database:** PostgreSQL + Prisma (existing)
-   **Backend:** Next.js API + TRPC (existing)
-   **Frontend:** React + TypeScript (existing)
-   **UI:** Tailwind CSS + Shadcn UI (existing)
-   **Forms:** React Hook Form (inferred from existing patterns)

### DEPENDENCIES & INTEGRATION POINTS

1. **Database Dependencies:**

    - Prisma migration system
    - Existing ingredients data

2. **API Dependencies:**

    - Existing TRPC router structure
    - Authentication middleware

3. **UI Dependencies:**
    - Shared UI components
    - Existing form patterns
    - Admin layout structure

### TESTING STRATEGY

1. **Database Testing:**

    - Migration rollback capability
    - Seed data validation

2. **API Testing:**

    - TRPC procedure testing
    - Package selection algorithm unit tests

3. **UI Testing:**
    - Component testing for package input
    - Integration testing for admin flow

### CREATIVE PHASES COMPLETED ✅

**All Required Creative Phases Completed:**

1. ✅ Package Sizes Input Component design → Dynamic Input List
2. ✅ Package Selection Algorithm optimization → Simple Smallest-Sufficient
3. ✅ Shopping List visualization enhancement → Expandable Detail Cards

**Design Decisions Documented:**
- `creative-phase-package-input.md` - UI/UX design for package input interface
- `creative-phase-algorithm.md` - Algorithm design for package selection
- `creative-phase-visualization.md` - UI/UX design for shopping list display

### NEXT MODE RECOMMENDATION

**IMPLEMENT MODE** - Ready to proceed with implementation using documented design decisions.

**Implementation Order:**
1. Phase 1: Database Schema Update (Prisma migration)
2. Phase 2: Admin Interface Development (with designed input component)
3. Phase 3: Shopping List Logic Enhancement (with designed algorithm and visualization)

---

_Created: 2025-01-13_
_Mode: PLAN → CREATIVE → READY_FOR_IMPLEMENT_
_Status: CREATIVE_PHASES_COMPLETE_
_Next Mode: IMPLEMENT_
