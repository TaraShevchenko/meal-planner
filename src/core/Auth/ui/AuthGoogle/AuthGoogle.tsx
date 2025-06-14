'use client'

import { signIn } from 'next-auth/react'
import { useLocale } from 'next-intl'

import { Button } from 'shared/ui/Button'
import { Google } from 'shared/ui/Icon'

export const AuthGoogle = () => {
    const locale = useLocale()

    const handleSignIn = () => {
        signIn('google', { callbackUrl: `/${locale}` }).catch((error) => {
            console.error('Sign-in google error:', error)
        })
    }

    return <Button onClick={handleSignIn} variant="outline" text={'Google'} icon={Google} />
}
