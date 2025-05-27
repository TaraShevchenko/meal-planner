import { type LocaleParams } from 'shared/lib/nextIntl'
import { handleGenerateMetadata } from 'shared/utils/handleGenerateMetadata'

export async function generateMetadata({ params }: LocaleParams) {
    return await handleGenerateMetadata({
        route: '/',
        namespace: 'metadata.welcome',
        locale: params.locale,
    })
}

export default async function WelcomePage() {
    return <>Welcome</>
}
