import dynamic from 'next/dynamic';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { WALLET_SCREENS } from 'pages/wallet/index';
import { isMobile } from 'react-device-detect';
const MaldivesLayout = dynamic(() => import('components/common/layouts/MaldivesLayout'),
    { ssr: false })
const LayoutMobile = dynamic(() => import('components/common/layouts/LayoutMobile'),
    { ssr: false })
const WalletComponent = dynamic(() => import('components/screens/Wallet'),
    { ssr: false })

const Wallet = () => isMobile ? <LayoutMobile ><WalletComponent /></LayoutMobile> : <MaldivesLayout> <WalletComponent /></MaldivesLayout>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet'])
    }
})

export async function getStaticPaths() {
    return {
        paths: [
            {
                params: {
                    id: WALLET_SCREENS.OVERVIEW
                }
            }
        ],
        fallback: true,
    };
}

export default Wallet
