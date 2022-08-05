import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';

const SpotComp = dynamic(
    () => import('src/components/spot/SpotComp'),
    { ssr: false },
);
const Spot = () => {
    return <SpotComp />;
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'spot', 'error', 'landing']),
    },
});

export async function getStaticPaths() {
    return {
        paths: [
            { params: { id: 'BTC-USDT' } },
        ],
        fallback: true,
    };
}
export default Spot;
