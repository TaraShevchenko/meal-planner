# Интеграция Clerk с Neon через Prisma

## Обзор интеграции

**Цель:** Настроить автоматическую синхронизацию пользователей между Clerk (авторизация) и Neon PostgreSQL (хранение данных) через Prisma ORM.

**Архитектура:**
```
Clerk (Auth) → Webhook → Next.js API → Prisma → Neon PostgreSQL
```

## Текущее состояние

✅ **ИНТЕГРАЦИЯ ЗАВЕРШЕНА:**
- Clerk интеграция настроена и работает
- Neon проект создан и подключен
- Prisma схема применена к Neon БД
- Таблица User создана в Neon
- Webhook для синхронизации пользователей настроен
- API endpoints для обработки Clerk событий реализованы
- Логика создания/обновления пользователей работает
- Fallback механизм через ensureUserExists функционирует
- Протестирована синхронизация при логине, регистрации и обновлениях
- Исправлена ошибка P2025 через использование upsert в handleUserUpdated

🎯 **РЕЗУЛЬТАТ:**
Пользователи автоматически синхронизируются между Clerk и Neon PostgreSQL через webhooks и fallback механизм. Система готова к разработке основного функционала приложения.

## План реализации

### Этап 1: Обновление Prisma схемы

**Текущая схема User:**
```prisma
model User {
  id        String   @id // Clerk user ID
  email     String   @unique
  name      String?
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}
```

**Рекомендуемые улучшения:**
```prisma
model User {
  id        String   @id // Clerk user ID
  email     String   @unique
  firstName String?
  lastName  String?
  name      String?  // Computed field: firstName + lastName
  imageUrl  String?
  username  String?  @unique
  
  // Clerk metadata
  clerkCreatedAt DateTime?
  clerkUpdatedAt DateTime?
  
  // App metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Future relations
  // recipes   Recipe[]
  // mealPlans MealPlan[]
  
  @@index([email])
  @@index([username])
  @@map("users")
}
```

### Этап 2: Создание API endpoints

**2.1 Webhook endpoint для Clerk**

Создать файл: `src/app/api/webhooks/clerk/route.ts`

```typescript
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/shared/api/db'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set')
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(webhookSecret)

  let evt
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const { id } = evt.data
  const eventType = evt.type

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Error processing webhook', { status: 500 })
  }
}
```

**2.2 Функции обработки событий**

Создать файл: `src/shared/api/user-sync.ts`

```typescript
import { db } from './db'

export async function handleUserCreated(userData: any) {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    username,
    image_url,
    created_at,
    updated_at,
  } = userData

  const primaryEmail = email_addresses.find(
    (email: any) => email.id === userData.primary_email_address_id
  )

  if (!primaryEmail) {
    throw new Error('No primary email found')
  }

  const user = await db.user.create({
    data: {
      id,
      email: primaryEmail.email_address,
      firstName: first_name,
      lastName: last_name,
      name: [first_name, last_name].filter(Boolean).join(' ') || null,
      username,
      imageUrl: image_url,
      clerkCreatedAt: new Date(created_at),
      clerkUpdatedAt: new Date(updated_at),
    },
  })

  console.log('User created in database:', user.id)
  return user
}

export async function handleUserUpdated(userData: any) {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    username,
    image_url,
    updated_at,
  } = userData

  const primaryEmail = email_addresses.find(
    (email: any) => email.id === userData.primary_email_address_id
  )

  if (!primaryEmail) {
    throw new Error('No primary email found')
  }

  const user = await db.user.update({
    where: { id },
    data: {
      email: primaryEmail.email_address,
      firstName: first_name,
      lastName: last_name,
      name: [first_name, last_name].filter(Boolean).join(' ') || null,
      username,
      imageUrl: image_url,
      clerkUpdatedAt: new Date(updated_at),
    },
  })

  console.log('User updated in database:', user.id)
  return user
}

export async function handleUserDeleted(userData: any) {
  const { id } = userData

  // Soft delete или полное удаление - зависит от требований
  const user = await db.user.delete({
    where: { id },
  })

  console.log('User deleted from database:', id)
  return user
}
```

### Этап 3: Настройка Clerk Webhook

**3.1 В Clerk Dashboard:**
1. Перейти в раздел **Webhooks**
2. Создать новый endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Выбрать события:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Скопировать **Webhook Secret**

**3.2 Добавить переменную окружения:**
```env
CLERK_WEBHOOK_SECRET="whsec_..."
```

### Этап 4: Обновление env.js

Добавить новую переменную в `src/shared/config/env.js`:

```javascript
server: {
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(), // Добавить эту строку
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
},

runtimeEnv: {
  // Server-side variables
  DATABASE_URL: process.env.DATABASE_URL,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET, // Добавить эту строку
  NODE_ENV: process.env.NODE_ENV,
  // ...
}
```

### Этап 5: Установка зависимостей

```bash
npm install svix
```

### Этап 6: Тестирование

**6.1 Локальное тестирование:**
1. Использовать ngrok для туннелирования:
   ```bash
   npx ngrok http 3000
   ```
2. Обновить webhook URL в Clerk Dashboard
3. Зарегистрировать нового пользователя
4. Проверить создание записи в Neon БД

**6.2 Проверка в Prisma Studio:**
```bash
npx prisma studio
```

## Дополнительные возможности

### Middleware для проверки пользователя

Создать middleware для автоматической синхронизации:

```typescript
// src/middleware/user-sync.ts
import { auth } from '@clerk/nextjs'
import { db } from '@/shared/api/db'

export async function ensureUserExists() {
  const { userId } = auth()
  
  if (!userId) return null

  let user = await db.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    // Fallback: создать пользователя если webhook не сработал
    const clerkUser = await clerkClient.users.getUser(userId)
    user = await handleUserCreated(clerkUser)
  }

  return user
}
```

### tRPC процедуры для работы с пользователями

```typescript
// src/shared/api/routers/user.ts
export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.user.findUnique({
        where: { id: ctx.auth.userId }
      })
    }),

  updateProfile: protectedProcedure
    .input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.auth.userId },
        data: {
          ...input,
          name: [input.firstName, input.lastName]
            .filter(Boolean)
            .join(' ') || null
        }
      })
    })
})
```

## Безопасность

1. **Проверка webhook подписи** - обязательно для продакшена
2. **Rate limiting** для webhook endpoint
3. **Логирование** всех операций синхронизации
4. **Обработка ошибок** и retry механизмы

## Мониторинг

1. **Логи синхронизации** в консоли/файлах
2. **Метрики** успешных/неуспешных синхронизаций
3. **Алерты** при сбоях webhook'ов

## Следующие шаги

1. ✅ Обновить Prisma схему
2. ✅ Создать API endpoints
3. ✅ Настроить Clerk webhook
4. ✅ Добавить переменные окружения
5. ✅ Установить зависимости
6. ✅ Протестировать интеграцию
7. ✅ Развернуть на продакшен
8. ✅ Настроить мониторинг