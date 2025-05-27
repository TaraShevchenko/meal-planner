import { Layout } from 'module/core/Layout'

import { RoutesPaths } from 'shared/routes'

export default async function OrderPage() {
    return (
        <Layout pageTitle="Order" pageUrl={RoutesPaths.enum['/order']}>
            <></>
        </Layout>
    )
}
