import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FUTURES_DEFAULT_SYMBOL } from './index';

const FuturesComponent = dynamic(
    () => import('components/screens/Futures/futures'),
    { ssr: false }
);
const Futures = () => {
    return <FuturesComponent />
};

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
                'error',
                'spot',
            ])),
        },
    };
};

export const getStaticPaths = async () => {
    return {
        paths: [{ params: { pair: FUTURES_DEFAULT_SYMBOL } }],
        fallback: true,
    };
};

export default Futures;
