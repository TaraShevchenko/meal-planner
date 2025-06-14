# ОТЛОЖЕННЫЕ ЗАДАЧИ MEAL PLANNER

## ОБЗОР

Этот документ содержит задачи, которые были отложены на более поздние этапы разработки в связи с изменением приоритетов и использованием ngrok для разработки.

## ЗАДАЧИ РАЗВЕРТЫВАНИЯ И CI/CD

### Развертывание на Vercel

**Статус:** Отложено (используется ngrok для dev режима)
**Приоритет:** Средний
**Планируемый срок:** После завершения MVP функционала

#### Задачи:

- [ ] **Подготовка к продакшену**
  - [ ] Подключение GitHub репозитория к Vercel
  - [ ] Настройка переменных окружения в Vercel
  - [ ] Конфигурация домена и SSL
  - [ ] Настройка автоматического деплоя
  - [ ] Тестирование продакшен сборки

#### Переменные окружения для Vercel:

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Next.js
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

### Настройка CI/CD Pipeline

**Статус:** Отложено
**Приоритет:** Средний
**Планируемый срок:** После стабилизации основного функционала

#### Задачи:

- [ ] **GitHub Actions для автоматизации**
  - [ ] Автоматическое тестирование при push
  - [ ] Проверка типов TypeScript в CI
  - [ ] Линтинг и форматирование в CI
  - [ ] Автоматический деплой при merge в main
  - [ ] Проверка безопасности зависимостей
  - [ ] Автоматическое создание релизов

#### Пример GitHub Actions workflow:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## ПРИЧИНЫ ОТСРОЧКИ

### Использование ngrok для разработки

- ✅ Локальный сервер доступен через интернет
- ✅ Webhooks работают без продакшен деплоя
- ✅ Быстрая итерация и тестирование
- ✅ Нет необходимости в настройке CI/CD на раннем этапе

### Фокус на MVP функционале

- Приоритет на создании схемы данных
- Разработка основного функционала приложения
- Тестирование бизнес-логики
- Валидация концепции продукта

## ПЛАНЫ НА БУДУЩЕЕ

### Когда вернуться к этим задачам:

1. **После завершения MVP схемы данных**
2. **После реализации основного функционала**
3. **При необходимости демонстрации стабильной версии**
4. **Перед публичным релизом**

### Критерии готовности для продакшена:

- [ ] Стабильная работа всех основных функций
- [ ] Покрытие тестами критического функционала
- [ ] Оптимизация производительности
- [ ] Безопасность и валидация данных
- [ ] Документация для пользователей

## АЛЬТЕРНАТИВНЫЕ РЕШЕНИЯ

### Вместо Vercel:

- **Railway** - простой деплой с PostgreSQL
- **Render** - бесплатный tier с автоматическим деплоем
- **Netlify** - для статических сайтов с serverless функциями

### Вместо GitHub Actions:

- **Vercel встроенные проверки** - автоматический линтинг и сборка
- **Husky + lint-staged** - локальные pre-commit хуки
- **Простые npm scripts** - базовая автоматизация