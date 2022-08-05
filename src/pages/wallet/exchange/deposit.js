import ExchangeDeposit from 'components/screens/Wallet/Exchange/ExchangeDeposit';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Deposit = () => <ExchangeDeposit/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'modal'])
    }
})

export default Deposit
