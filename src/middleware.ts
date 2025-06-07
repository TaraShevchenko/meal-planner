import { type NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'

import { routing } from 'shared/lib/nextIntl'
import { ROUTING_CONFIG, createLocalizedUrl, extractLocale, isGuestOnlyRoute, isPublicRoute } from 'shared/routes'

const intlMiddleware = createIntlMiddleware(routing)

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const isAuthenticated = !!token
    const locale = extractLocale(pathname)

    if (isPublicRoute(pathname)) {
        if (isAuthenticated && isGuestOnlyRoute(pathname)) {
            const homeUrl = createLocalizedUrl(ROUTING_CONFIG.defaultRedirect.authorized, locale, req.url)
            return NextResponse.redirect(homeUrl)
        }

        return intlMiddleware(req)
    }

    if (!isAuthenticated) {
        const unauthorizedUrl = createLocalizedUrl(ROUTING_CONFIG.defaultRedirect.unauthorized, locale, req.url)
        return NextResponse.redirect(unauthorizedUrl)
    }

    return intlMiddleware(req)
}

export const config = {
    matcher: ['/', '/(ua|ru|en)/:path*'],
}
