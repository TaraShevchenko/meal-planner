import { Layout } from 'core/Layout'

import { OrderTable } from 'module/Order'

import { RoutesPaths } from 'shared/routes'
import { Container } from 'shared/ui/Container'

export default async function OrderPage() {
    return (
        <Layout pageTitle="Order" pageUrl={RoutesPaths.enum['/order']}>
            <Container className="py-10">
                <OrderTable />
            </Container>
        </Layout>
    )
}
