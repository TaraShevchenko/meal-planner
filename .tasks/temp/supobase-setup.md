# Настройка Supabase для Meal Planner

Это руководство поможет вам настроить удаленную базу данных Supabase для разработки и продакшена.

## ⚠️ ВАЖНО: Проблемы с текущей конфигурацией

### 1. Неполная конфигурация Supabase

**КРИТИЧЕСКАЯ ПРОБЛЕМА**: В проекте используется только Prisma для подключения к Supabase, но отсутствует официальный Supabase JavaScript клиент (`@supabase/supabase-js`). Это означает, что вы теряете доступ к:

- ❌ Встроенной аутентификации Supabase
- ❌ Real-time подпискам на изменения данных
- ❌ Row Level Security (RLS)
- ❌ Storage API для файлов
- ❌ Edge Functions
- ❌ Оптимизированным запросам через Supabase API

**Рекомендуется**: Создать новый проект Supabase И настроить полную интеграцию согласно официальной документации.

## 1. Создание нового проекта Supabase

### Для разработки:

1. Перейдите на [supabase.com](https://supabase.com)
2. Войдите в аккаунт или зарегистрируйтесь
3. Нажмите "New Project"
4. Выберите организацию
5. Заполните данные проекта:
   - **Name**: `Meal planner dev`
   - **Database Password**: Создайте простой пароль БЕЗ специальных символов (только буквы и цифры)
   - **Region**: Выберите ближайший регион
6. Нажмите "Create new project"
7. Дождитесь завершения создания проекта (может занять несколько минут)

### Для продакшена (опционально):

Повторите те же шаги, но назовите проект `Meal planner prod`

## 2. Получение строки подключения

1. В панели Supabase перейдите в **Settings** → **Database**
2. Найдите секцию **Connection string**
3. Выберите **URI** и скопируйте строку
4. Строка будет выглядеть так:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

## 3. Установка Supabase клиента

**ОБЯЗАТЕЛЬНО**: Установите официальный Supabase JavaScript клиент:

```bash
npm install @supabase/supabase-js
```

## 4. Настройка переменных окружения

### Для полной интеграции с Supabase добавьте в `.env.local`:

```env
# Supabase Configuration (рекомендуемый подход)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Prisma Database URL (для миграций)
DATABASE_URL="postgresql://postgres:your_simple_password@db.your_new_project_ref.supabase.co:5432/postgres?connect_timeout=30&pool_timeout=30"
DIRECT_URL="postgresql://postgres:your_simple_password@db.your_new_project_ref.supabase.co:5432/postgres?connect_timeout=30"
```

### Где найти Supabase URL и ANON_KEY:

1. В панели Supabase перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ⚠️ Важные правила для пароля:

- **НЕ используйте** специальные символы: `@`, `*`, `#`, `%`, `&`, `!`
- **Используйте только**: буквы (a-z, A-Z) и цифры (0-9)
- **Пример хорошего пароля**: `MySecurePass123`
- **Пример плохого пароля**: `My*Pass@123` (содержит \* и @)

## 5. Создание Supabase клиентов

### Создайте файл `src/shared/utils/supabase/client.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Создайте файл `src/shared/utils/supabase/server.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const createClient = () => {
  const cookieStore = cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
};
```

## 6. Применение миграций

После настройки DATABASE_URL выполните:

```bash
# Применить схему к Supabase
npm run db:push

# Или создать новую миграцию (если нужно)
npm run db:generate
```

## 7. Проверка подключения

1. Запустите проект:

   ```bash
   npm run dev
   ```

2. Проверьте, что нет ошибок подключения к БД

3. Откройте Prisma Studio для просмотра данных:
   ```bash
   npm run db:studio
   ```

## 8. Устранение проблем с подключением

### Если получаете Error P1001:

1. **Проверьте статус проекта**:

   - Зайдите в панель Supabase
   - Убедитесь, что проект активен (не в режиме "Paused")
   - Если проект приостановлен, нажмите "Resume"

2. **Сбросьте пароль базы данных**:

   - Settings → Database → Reset database password
   - Используйте простой пароль без специальных символов
   - Обновите `.env` файл

3. **Проверьте сетевые ограничения**:

   - Settings → Database → Network Restrictions
   - Убедитесь, что ваш IP не заблокирован

4. **Добавьте таймауты в URL**:
   ```env
   DATABASE_URL="...?connect_timeout=30&pool_timeout=30"
   ```

### Если проблемы продолжаются:

- Создайте новый проект Supabase
- Используйте другой регион
- Проверьте настройки брандмауэра

## 9. Выбор стратегии аутентификации

### Вариант A: Использовать Supabase Auth (рекомендуется)

**Преимущества**:

- Встроенная интеграция с базой данных
- Автоматический Row Level Security
- Поддержка множества провайдеров
- Меньше кода для поддержки

1. В панели Supabase перейдите в **Authentication** → **Providers**
2. Включите Google Provider
3. Добавьте Google Client ID и Secret
4. Настройте redirect URLs:
   - `http://localhost:3001/auth/callback` (для разработки)
   - `https://yourdomain.com/auth/callback` (для продакшена)

### Вариант B: Оставить NextAuth (текущий подход)

**Если хотите сохранить NextAuth**, настройте Google OAuth:

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Создайте OAuth 2.0 credentials:

   - **Application type**: Web application
   - **Authorized redirect URIs**:
     - `http://localhost:3001/api/auth/callback/google` (для разработки)
     - `https://yourdomain.com/api/auth/callback/google` (для продакшена)

5. Скопируйте Client ID и Client Secret в `.env`:
   ```env
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

## 10. Безопасность

### Важные моменты:

- ❌ **Никогда не коммитьте файл `.env` в git**
- ✅ Используйте разные пароли для dev и prod
- ✅ Регулярно ротируйте пароли
- ✅ Настройте Row Level Security (RLS) в Supabase

### Настройка RLS (рекомендуется):

1. В Supabase перейдите в **Authentication** → **Policies**
2. Включите RLS для всех таблиц
3. Создайте политики доступа для пользователей

## 11. Мониторинг

В панели Supabase вы можете:

- Просматривать логи запросов
- Мониторить производительность
- Настраивать бэкапы
- Просматривать метрики использования

## Troubleshooting

### Ошибка подключения:

- Проверьте правильность пароля в DATABASE_URL
- Убедитесь, что проект Supabase активен
- Проверьте сетевое подключение
- Попробуйте создать новый проект

### Ошибки миграций:

- Убедитесь, что DATABASE_URL корректный
- Проверьте права доступа к базе данных
- Попробуйте `npm run db:push` вместо `db:generate`

### Проблемы с авторизацией:

- Проверьте настройки Google OAuth
- Убедитесь, что redirect URIs корректные
- Проверьте переменные GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET

## Полезные команды

```bash
# Просмотр схемы БД
npm run db:studio

# Применение изменений схемы
npm run db:push

# Создание новой миграции
npm run db:generate

# Применение миграций в продакшене
npm run db:migrate

# Сброс БД (осторожно!)
npx prisma db push --force-reset
```

## Следующие шаги

### Немедленные действия:

1. **Установите Supabase клиент**: `npm install @supabase/supabase-js`
2. **Создайте новый проект Supabase** (текущий недоступен)
3. **Настройте переменные окружения** с URL и ANON_KEY
4. **Создайте Supabase клиенты** для браузера и сервера
5. **Примените схему базы данных**: `npm run db:push`

### Дальнейшая оптимизация:

6. **Рассмотрите миграцию на Supabase Auth** для упрощения архитектуры
7. **Настройте Row Level Security** для безопасности
8. **Добавьте real-time функции** где необходимо
9. **Протестируйте все функции** аутентификации и базы данных

### Результат:

После выполнения всех шагов вы получите:

- ✅ Стабильное подключение к Supabase
- ✅ Доступ ко всем возможностям платформы
- ✅ Современную архитектуру с real-time возможностями
- ✅ Упрощенную аутентификацию и безопасность
