import { type ReactNode } from 'react'

import { type RoutesPathsType } from 'shared/routes'

import { Header } from './Header'

interface LayoutProps {
    children: ReactNode
    pageTitle: string
    pageUrl: RoutesPathsType
}

export function Layout({ children, pageTitle, pageUrl }: LayoutProps) {
    return (
        <div className="min-h-screen">
            <Header pageTitle={pageTitle} pageUrl={pageUrl} />
            <main className="flex-1">{children}</main>
        </div>
    )
}
