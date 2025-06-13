# 🧠 MEMORY BANK: Архитектурные проблемы и решения

## Проблема: Смешивание серверных и клиентских компонентов

### Описание проблемы
При сборке Next.js приложения часто возникают ошибки, которые на первый взгляд кажутся связанными с переменными окружения (env.js), но на самом деле корень проблемы в неправильной архитектуре импортов.

**Основная причина:** Где-то в коде есть файл, который объединяет серверные и клиентские компоненты, что приводит к конфликтам при сборке.

### Пример правильной архитектуры

В проекте Meal Planner используется правильное разделение:

```
src/entities/family/
├── api/
│   ├── client-queries.ts  # Только клиентские хуки
│   └── queries.ts         # Только серверные запросы
├── client.ts              # Экспорт только клиентских API
├── index.ts               # Экспорт только типов и общих утилит
├── model/
│   └── types.ts          # Общие типы
└── server.ts              # Экспорт только серверных API
```

### Ключевые принципы

1. **client.ts** - экспортирует только клиентские хуки и компоненты
   ```typescript
   export { familyClientQueries } from './api/client-queries';
   ```

2. **server.ts** - экспортирует только серверные функции
   ```typescript
   export { familyQueries } from './api/queries';
   ```

3. **index.ts** - экспортирует только типы и общие утилиты
   ```typescript
   export { type Family, type FamilyMember, type FamilyWithMembers } from './model/types';
   // For client-side usage, import from './client'
   // For server-side usage, import from './server'
   // This file exports only shared utilities and types
   ```

### Что НЕ делать

❌ **Неправильно:** Смешивать в одном файле
```typescript
// BAD: Не делайте так!
export { familyQueries } from './api/queries';        // Серверное
export { familyClientQueries } from './api/client-queries'; // Клиентское
```

✅ **Правильно:** Разделять по назначению
```typescript
// client.ts - только клиентское
export { familyClientQueries } from './api/client-queries';

// server.ts - только серверное  
export { familyQueries } from './api/queries';
```

### Диагностика проблемы

Если видите ошибки типа:
- `Invalid environment variables`
- `Failed to load next.config.js`
- Проблемы с AUTH_DISCORD_ID, AUTH_DISCORD_SECRET

**Проверьте:**
1. Нет ли файлов, которые импортируют и серверные, и клиентские API одновременно
2. Правильно ли разделены экспорты в entity файлах
3. Используются ли правильные импорты в компонентах (client.ts для клиента, server.ts для сервера)

### Решение

1. Найти файлы, которые смешивают серверные и клиентские импорты
2. Разделить их на отдельные файлы (client.ts и server.ts)
3. Обновить импорты в компонентах для использования правильных источников
4. Убедиться, что index.ts экспортирует только типы и общие утилиты

---

**Дата записи:** 2024-01-13  
**Проект:** Meal Planner  
**Статус:** Критическая архитектурная проблема - требует внимания при каждом новом проекте