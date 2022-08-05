import ExchangeTransfer from 'components/screens/Wallet/Exchange/ExchangeTransfer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Transfer = () => <ExchangeTransfer/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar'])
    }
})

export default Transfer
