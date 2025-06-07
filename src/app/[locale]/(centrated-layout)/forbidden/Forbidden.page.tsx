import { RedirectBlock } from 'core/Auth'

import { type LocaleParams } from 'shared/lib/nextIntl'
import { handleGenerateMetadata } from 'shared/utils/handleGenerateMetadata'

export async function generateMetadata({ params }: LocaleParams) {
    return await handleGenerateMetadata({
        route: '/forbidden',
        namespace: 'metadata.forbidden',
        locale: params.locale,
    })
}

export default function ForbiddenPage() {
    return (
        <RedirectBlock
            url="/"
            title={'access_denied'}
            pageName={'planner'}
            // hint={'insufficient_rights'}
            warning={'please_contact_the_site_administrator_to_obtain_access_rights_to_this_page'}
        />
    )
}
