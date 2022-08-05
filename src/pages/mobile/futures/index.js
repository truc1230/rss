import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { LOCAL_STORAGE_KEY } from 'constants/constants';
import { useMemo } from 'react';

export const FUTURES_DEFAULT_SYMBOL = 'BTCVNDC'

const FuturesIndex = () => {
    const router = useRouter()

    const params = useMemo(() => {
        return router.asPath.indexOf('?') !== -1 ? router.asPath.substring(router.asPath.indexOf('?')) : ''
    }, [router])

    if (typeof window !== 'undefined') {
        // Find previous symbol
        const prevSymbol = localStorage.getItem(
            LOCAL_STORAGE_KEY.PreviousFuturesPair
        )

        router.push(
            `/mobile${PATHS.FUTURES_V2.DEFAULT}/${prevSymbol && !!prevSymbol?.toString()?.length
                ? prevSymbol
                : FUTURES_DEFAULT_SYMBOL
            }${params}`,
            undefined,
            { shallow: true }
        )
    }
    return null
}

export default FuturesIndex
