import { CalendarIcon, ShoppingCartIcon } from 'lucide-react'

import { RoutesPaths, type RoutesPathsType } from 'shared/routes'
import { Anchor } from 'shared/ui/Button'
import { Text } from 'shared/ui/Text'

interface HeaderProps {
    pageTitle: string
    pageUrl: RoutesPathsType
}

export function Header({ pageTitle, pageUrl }: HeaderProps) {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-14 items-center justify-between">
                    <Text tag="h1" variant="title" text={pageTitle} />
                    <div className="flex items-center space-x-4">
                        <Anchor
                            href={RoutesPaths.enum['/planner']}
                            text="Planner"
                            variant="link"
                            icon={CalendarIcon}
                            size="sm"
                            isActive={pageUrl === RoutesPaths.enum['/planner']}
                        />
                        <Anchor
                            href={RoutesPaths.enum['/order']}
                            text="Order"
                            variant="link"
                            icon={ShoppingCartIcon}
                            size="sm"
                            isActive={pageUrl === RoutesPaths.enum['/order']}
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}
