import { formatPrice } from 'src/redux/actions/utils';
// import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Emitter from 'src/redux/actions/emitter';
import { PublicSocketEvent } from 'src/redux/actions/const';
import { useRouter } from 'next/router';

const SpotHead = (props) => {
    const [symbolTicker, setSymbolTicker] = useState(null);
    const { symbol } = props;
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleRouteChange = () => {
        setLoading(true);
    };

    useEffect(() => {
        Emitter.on(PublicSocketEvent.SPOT_TICKER_UPDATE, async (data) => {
            if (data?.s === `${symbol.base}${symbol.quote}`) {
                setLoading(false);
                setSymbolTicker(data);
            }
        });
        router.events.on('routeChangeStart', handleRouteChange);
        return function cleanup() {
            Emitter.off(PublicSocketEvent.SPOT_TICKER_UPDATE);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [Emitter, symbol]);

    if (!symbolTicker) return null;

    // const { t } = useTranslation(['common', 'spot']);
    return (
        <Head>
            <title>{loading ? 'Loading' : `${formatPrice(symbolTicker?.p)} | ${symbolTicker?.s}`} | Nami Exchange</title>
            <meta property="og:title" content="Nami Exchange" key="title" />
        </Head>
    );
};

export default SpotHead;
