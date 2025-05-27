import { RedirectBlock } from 'module/core/Auth'

import { type LocaleParams } from 'shared/lib/nextIntl'
import { handleGenerateMetadata } from 'shared/utils/handleGenerateMetadata'

export async function generateMetadata({ params }: LocaleParams) {
    return await handleGenerateMetadata({
        route: '/unauthorized',
        namespace: 'metadata.unauthorized',
        locale: params.locale,
    })
}

export default function UnauthorizedPage() {
    return (
        <RedirectBlock
            url="/login"
            title={'access_denied'}
            pageName={'login_page_name'}
            // hint={'please_login_to_access_the_page'}
            warning={'go_to_login_page_to_login_and_get_access_to_the_page'}
        />
    )
}
