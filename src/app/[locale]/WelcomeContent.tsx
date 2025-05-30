'use client'

import { useSession } from 'next-auth/react'

import { RoutesPaths } from 'shared/routes'
import { Anchor } from 'shared/ui/Button'

export function WelcomeContent() {
    const { data: session } = useSession()

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="mx-auto max-w-md text-center">
                <div className="space-y-4">
                    {session ? (
                        <>
                            <Anchor
                                href={RoutesPaths.enum['/order']}
                                text="Order"
                                variant="default"
                                size="default"
                                className="w-full"
                            />
                            <Anchor
                                href={RoutesPaths.enum['/planner']}
                                text="Planner"
                                variant="outline"
                                size="default"
                                className="w-full"
                            />
                        </>
                    ) : (
                        <>
                            <Anchor
                                href={RoutesPaths.enum['/login']}
                                text="Login"
                                variant="default"
                                size="default"
                                className="w-full"
                            />
                            <Anchor
                                href={RoutesPaths.enum['/registration']}
                                text="Registration"
                                variant="outline"
                                size="default"
                                className="w-full"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
