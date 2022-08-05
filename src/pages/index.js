
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const APP_URL = process.env.APP_URL || 'https://nami.exchange'

const Index = () => {

    return (
        <div className='mt-8'>abc</div>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'home',
            'modal',
            'input',
            'table',
        ])),
    },
})

export default Index
