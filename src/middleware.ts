import { type NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'

import { routing } from 'shared/lib/nextIntl'
import { ROUTING_CONFIG, createLocalizedUrl, extractLocale, isGuestOnlyRoute, isPublicRoute } from 'shared/routes'

const intlMiddleware = createIntlMiddleware(routing)

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const intlResponse = intlMiddleware(req)

    if (intlResponse && intlResponse.status === 307) {
        return intlResponse
    }

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

        return intlResponse
    }

    if (!isAuthenticated) {
        const unauthorizedUrl = createLocalizedUrl(ROUTING_CONFIG.defaultRedirect.unauthorized, locale, req.url)
        return NextResponse.redirect(unauthorizedUrl)
    }

    return intlResponse
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)'],
}
