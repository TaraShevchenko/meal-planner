import { z } from 'zod'

export const ROUTES_PATHS = [
    '/',
    '/forbidden',
    '/unauthorized',
    '/login',
    '/registration',
    '/order',
    '/planner',
] as const

export const RoutesPaths = z.enum(ROUTES_PATHS)

export type RoutesPathsType = z.infer<typeof RoutesPaths>

// Публичные роуты, которые не требуют аутентификации
export const PUBLIC_ROUTES = ['/login', '/registration', '/unauthorized', '/forbidden', '/api/auth'] as const

// Приватные роуты, которые требуют аутентификации
export const PRIVATE_ROUTES = ['/', '/planner', '/order'] as const

// Роуты, которые должны редиректить авторизованных пользователей
export const GUEST_ONLY_ROUTES = ['/login', '/registration'] as const

/**
 * Проверяет является ли роут публичным
 */
export const isPublicRoute = (pathname: string): boolean => {
    return PUBLIC_ROUTES.some((route) => pathname.includes(route))
}

/**
 * Проверяет является ли роут только для гостей
 */
export const isGuestOnlyRoute = (pathname: string): boolean => {
    return GUEST_ONLY_ROUTES.some((route) => pathname.includes(route))
}

/**
 * Проверяет является ли роут приватным
 */
export const isPrivateRoute = (pathname: string): boolean => {
    return PRIVATE_ROUTES.some((route) => {
        // Точное совпадение для корневого роута
        if (route === '/' && pathname === '/') return true
        if (route === '/' && pathname.match(/^\/[a-z]{2}$/)) return true

        // Для остальных роутов проверяем включение
        return pathname.includes(route)
    })
}

/**
 * Конфигурация роутинга для middleware
 */
export const ROUTING_CONFIG = {
    public: PUBLIC_ROUTES,
    private: PRIVATE_ROUTES,
    guestOnly: GUEST_ONLY_ROUTES,
    defaultRedirect: {
        unauthorized: '/unauthorized',
        authorized: '/',
    },
} as const

// Экспортируем утилиты
export * from './utils'
