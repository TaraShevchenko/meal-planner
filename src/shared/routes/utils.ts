/**
 * Утилиты для работы с роутингом
 */

/**
 * Извлекает локаль из pathname
 */
export const extractLocale = (pathname: string): string => {
    const segments = pathname.split('/')
    const locale = segments[1]

    if (locale && locale.length === 2 && /^[a-z]{2}$/.test(locale)) {
        return locale
    }

    return 'en'
}

/**
 * Очищает pathname от локали
 */
export const stripLocale = (pathname: string): string => {
    const segments = pathname.split('/')
    const locale = segments[1]

    if (locale && locale.length === 2 && /^[a-z]{2}$/.test(locale)) {
        return '/' + segments.slice(2).join('/')
    }

    return pathname
}

/**
 * Добавляет локаль к пути
 */
export const addLocale = (path: string, locale: string): string => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    if (!cleanPath) {
        return `/${locale}`
    }

    return `/${locale}/${cleanPath}`
}

/**
 * Создаёт URL с учётом локали
 */
export const createLocalizedUrl = (path: string, locale: string, baseUrl: string): URL => {
    const localizedPath = addLocale(path, locale)
    return new URL(localizedPath, baseUrl)
}
