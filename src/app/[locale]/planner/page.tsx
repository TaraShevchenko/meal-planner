import { Layout } from 'module/core/Layout'

import { RoutesPaths } from 'shared/routes'

export default async function PlannerPage() {
    return (
        <Layout pageTitle="Planner" pageUrl={RoutesPaths.enum['/planner']}>
            <></>
        </Layout>
    )
}
