import { z } from 'zod'

export const ROUTES_PATHS = ['/', '/forbidden', '/unauthorized', '/login', '/registration', '/order'] as const

export const RoutesPaths = z.enum(ROUTES_PATHS)

export type RoutesPathsType = z.infer<typeof RoutesPaths>

export const PUBLIC_ROUTES = ['/login', '/registration', '/unauthorized', '/forbidden', '/api/auth'] as const

export const PRIVATE_ROUTES = ['/', '/order'] as const

export const GUEST_ONLY_ROUTES = ['/login', '/registration'] as const

export const isPublicRoute = (pathname: string): boolean => {
    return PUBLIC_ROUTES.some((route) => pathname.includes(route))
}

export const isGuestOnlyRoute = (pathname: string): boolean => {
    return GUEST_ONLY_ROUTES.some((route) => pathname.includes(route))
}

export const isPrivateRoute = (pathname: string): boolean => {
    return PRIVATE_ROUTES.some((route) => {
        if (route === '/' && pathname === '/') return true
        if (route === '/' && pathname.match(/^\/[a-z]{2}$/)) return true

        return pathname.includes(route)
    })
}

export const ROUTING_CONFIG = {
    public: PUBLIC_ROUTES,
    private: PRIVATE_ROUTES,
    guestOnly: GUEST_ONLY_ROUTES,
    defaultRedirect: {
        unauthorized: '/unauthorized',
        authorized: '/',
    },
} as const

export * from './utils'
