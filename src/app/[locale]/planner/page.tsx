import { Layout } from 'core/Layout'

import { RoutesPaths } from 'shared/routes'

import { Planner } from './Planner'

export default async function PlannerPage() {
    return (
        <Layout pageTitle="Planner" pageUrl={RoutesPaths.enum['/planner']}>
            <Planner />
        </Layout>
    )
}
