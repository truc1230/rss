import ExchangeWithdraw from 'components/screens/Wallet/Exchange/ExchangeWithdraw';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Withdraw = () => <ExchangeWithdraw/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'error', 'modal'])
    }
})

export default Withdraw
