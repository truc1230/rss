import ExchangePortfolio from 'components/screens/Wallet/Exchange/ExchangePortfolio';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Portfolio = () => <ExchangePortfolio/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar'])
    }
})

export default Portfolio
