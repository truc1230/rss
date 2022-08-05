import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { LOCAL_STORAGE_KEY } from 'constants/constants';

export const FUTURES_DEFAULT_SYMBOL = 'BTCVNDC'

const FuturesIndex = () => {
    const router = useRouter()

    if (typeof window !== 'undefined') {
        // Find previous symbol
        const prevSymbol = localStorage.getItem(
            LOCAL_STORAGE_KEY.PreviousFuturesPair
        )

        router.push(
            `${PATHS.FUTURES_V2.DEFAULT}/${
                prevSymbol && !!prevSymbol?.toString()?.length
                    ? prevSymbol
                    : FUTURES_DEFAULT_SYMBOL
            }`,
            undefined,
            { shallow: true }
        )
    }
    return null
}

export default FuturesIndex
