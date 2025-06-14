# ПЛАН МИГРАЦИИ НА NEON POSTGRESQL

## ОБЗОР МИГРАЦИИ

**Цель:** Переход с Supabase на Neon PostgreSQL для упрощения архитектуры и улучшения производительности.

**Преимущества Neon:**
- Serverless PostgreSQL с автоматическим масштабированием
- Бесплатный tier с щедрыми лимитами
- Простая интеграция с Prisma ORM
- Автоматические бэкапы и point-in-time recovery
- Отсутствие необходимости в дополнительных клиентских библиотеках

## ЭТАПЫ МИГРАЦИИ

### Этап 1: Подготовка Neon проекта

#### 1.1 Создание проекта в Neon
- [ ] Зарегистрироваться на [neon.tech](https://neon.tech)
- [ ] Создать новый проект
- [ ] Выбрать регион (рекомендуется US East для Vercel)
- [ ] Получить connection string

#### 1.2 Настройка переменных окружения
- [ ] Обновить `DATABASE_URL` в `.env` и `.env.example`
- [ ] Удалить Supabase переменные:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

### Этап 2: Удаление Supabase зависимостей

#### 2.1 Удаление пакетов
```bash
npm uninstall @supabase/supabase-js
```

#### 2.2 Удаление файлов конфигурации
- [ ] Удалить `src/shared/config/supabase.ts`
- [ ] Обновить `src/shared/config/env.js` (убрать Supabase переменные)

#### 2.3 Проверка импортов
- [ ] Найти и удалить все импорты Supabase клиента
- [ ] Убедиться, что нет ссылок на Supabase в коде

### Этап 3: Настройка Prisma с Neon

#### 3.1 Применение схемы
```bash
npx prisma db push
```

#### 3.2 Генерация клиента
```bash
npx prisma generate
```

#### 3.3 Тестирование подключения
- [ ] Создать простой API endpoint для проверки БД
- [ ] Протестировать CRUD операции через Prisma
- [ ] Проверить работу в dev режиме

### Этап 4: Интеграция с Clerk

#### 4.1 Обновление модели User
```prisma
model User {
  id        String   @id // Clerk user ID
  email     String   @unique
  firstName String?
  lastName  String?
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Связи с другими моделями
  // recipes   Recipe[]
  // mealPlans MealPlan[]
  
  @@map("users")
}
```

#### 4.2 Настройка синхронизации пользователей
- [ ] Создать API endpoint для webhook Clerk
- [ ] Настроить создание пользователя при регистрации
- [ ] Настроить обновление данных пользователя

#### 4.3 Тестирование интеграции
- [ ] Протестировать регистрацию нового пользователя
- [ ] Протестировать обновление профиля
- [ ] Проверить корректность данных в БД

### Этап 5: Обновление документации

#### 5.1 Обновление README.md
- [ ] Заменить инструкции по настройке Supabase на Neon
- [ ] Обновить переменные окружения в примере

#### 5.2 Обновление Memory Bank
- [x] Обновить `architecture.md`
- [x] Обновить `technical-specs.md`
- [x] Обновить `current-status.md`
- [x] Обновить `development-plan.md`
- [x] Обновить `tasks.md`

### Этап 6: Подготовка к продакшену

#### 6.1 Настройка Vercel
- [ ] Обновить переменные окружения в Vercel Dashboard
- [ ] Удалить Supabase переменные
- [ ] Добавить новый `DATABASE_URL` для Neon

#### 6.2 Тестирование продакшен сборки
- [ ] Проверить успешную сборку
- [ ] Протестировать подключение к БД в продакшене
- [ ] Проверить работу авторизации

## ТЕХНИЧЕСКИЕ ДЕТАЛИ

### Connection String формат для Neon:
```
postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require
```

### Рекомендуемые настройки Prisma для Neon:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Переменные окружения после миграции:
```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

## ПРОВЕРОЧНЫЙ СПИСОК

### Перед миграцией:
- [x] Проанализировать текущие зависимости
- [x] Определить файлы для удаления
- [x] Подготовить план обновления документации

### Во время миграции:
- [ ] Создать проект в Neon
- [ ] Обновить переменные окружения
- [ ] Удалить Supabase зависимости
- [ ] Применить Prisma схему
- [ ] Настроить интеграцию с Clerk

### После миграции:
- [ ] Протестировать все функции
- [ ] Обновить документацию
- [ ] Подготовить продакшен деплой
- [ ] Проверить производительность

## ОТКАТ (ROLLBACK ПЛАН)

В случае проблем с миграцией:

1. Восстановить Supabase зависимости:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Восстановить файл `src/shared/config/supabase.ts`

3. Восстановить Supabase переменные в `.env`

4. Откатить изменения в `env.js`

5. Переключить `DATABASE_URL` обратно на Supabase

## ВРЕМЕННЫЕ РАМКИ

- **Этап 1-2:** 2-3 часа
- **Этап 3:** 1-2 часа
- **Этап 4:** 3-4 часа
- **Этап 5-6:** 1-2 часа

**Общее время:** 1-2 рабочих дня

## РИСКИ И МИТИГАЦИЯ

### Потенциальные риски:
1. **Проблемы с подключением к Neon**
   - Митигация: Тестирование connection string перед полной миграцией

2. **Несовместимость Prisma схемы**
   - Митигация: Проверка схемы на тестовой БД

3. **Проблемы с Clerk интеграцией**
   - Митигация: Поэтапное тестирование webhook'ов

4. **Проблемы в продакшене**
   - Митигация: Подготовленный rollback план

### Рекомендации:
- Выполнять миграцию поэтапно
- Тестировать каждый этап перед переходом к следующему
- Сохранить backup текущей конфигурации
- Документировать все изменения