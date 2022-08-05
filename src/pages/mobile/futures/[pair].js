import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LoadingPage from 'components/screens/Mobile/LoadingPage';
const FuturesMobileComponent = dynamic(
    () => import('components/screens/Mobile/Futures/Futures'),
    { ssr: true, loading: () => <LoadingPage /> }
);
const FuturesMobile = () => {
    return <FuturesMobileComponent />
};


export const getServerSideProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
                'spot',
                'error',
                'markets'
            ])),
        },
    };
};
export default FuturesMobile;
