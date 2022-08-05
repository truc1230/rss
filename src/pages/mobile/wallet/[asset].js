import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutMobile from 'components/common/layouts/LayoutMobile';
import DynamicNoSsr from 'components/DynamicNoSsr';
import Transfer from 'components/screens/Mobile/Wallet/Transfer';

const WalletScreen = () => {
    return (
        <DynamicNoSsr>
            <LayoutMobile>
                <Transfer/>
            </LayoutMobile>
        </DynamicNoSsr>
    )
}

export const getStaticProps = async ({locale}) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'wallet', 'error'])),
        },
    }
}

export async function getStaticPaths() {
    return {
        paths: [{params: {asset: 'USDT'}}],
        fallback: true,
    }
}

export default WalletScreen
