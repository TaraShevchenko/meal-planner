import { Layout } from 'core/Layout'

import { type LocaleParams } from 'shared/lib/nextIntl'
import { RoutesPaths } from 'shared/routes'
import { handleGenerateMetadata } from 'shared/utils/handleGenerateMetadata'

import { HomeContent } from './HomeContent'

export async function generateMetadata({ params }: LocaleParams) {
    return await handleGenerateMetadata({
        route: '/',
        namespace: 'metadata.home',
        locale: params.locale,
    })
}

export default async function HomePage() {
    return (
        <Layout pageTitle="Planner" pageUrl={RoutesPaths.enum['/']}>
            <HomeContent />
        </Layout>
    )
}
