import { CalendarIcon, ShoppingCartIcon } from 'lucide-react'

import { LogoutButton } from 'core/Auth/ui/LogoutButton'

import { RoutesPaths, type RoutesPathsType } from 'shared/routes'
import { Anchor } from 'shared/ui/Button'
import { Container } from 'shared/ui/Container'
import { Text } from 'shared/ui/Text'

interface HeaderProps {
    pageTitle: string
    pageUrl: RoutesPathsType
}

export function Header({ pageTitle, pageUrl }: HeaderProps) {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
                <div className="flex h-14 items-center justify-between">
                    <Text tag="h1" variant="title" text={pageTitle} />
                    <div className="flex items-center space-x-2">
                        <Anchor
                            href={RoutesPaths.enum['/']}
                            text="Planner"
                            variant="link"
                            icon={CalendarIcon}
                            isActive={pageUrl === RoutesPaths.enum['/']}
                        />
                        <Anchor
                            href={RoutesPaths.enum['/order']}
                            text="Order"
                            variant="link"
                            icon={ShoppingCartIcon}
                            isActive={pageUrl === RoutesPaths.enum['/order']}
                        />
                        <LogoutButton />
                    </div>
                </div>
            </Container>
        </header>
    )
}
