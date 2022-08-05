import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { PublicSocketEvent } from 'redux/actions/const';
import { debounce } from 'lodash';
import { PATHS } from 'constants/paths';

import FuturesMarketWatch from 'models/FuturesMarketWatch';
import classNames from 'classnames';
import Emitter from 'redux/actions/emitter';
import { usePrevious } from 'react-use';
import { formatNumber } from 'redux/actions/utils';
import { roundTo } from 'round-to';
import Star from 'components/svg/Star';
import colors from 'styles/colors';
import { favoriteAction } from 'redux/actions/user';
import { TRADING_MODE } from 'src/redux/actions/const';
import { getFuturesFavoritePairs } from '../../../../redux/actions/futures';

const FuturesPairListItems = ({ pairConfig, changePercent24h, isDark, isFavorite, isAuth }) => {
    const [pairTicker, setPairTicker] = useState(null)
    const dispatch = useDispatch();
    const publicSocket = useSelector((state) => state.futures.publicSocket)
    const marketWatch = useSelector((state) => state.futures.marketWatch)

    const prevLastPrice = usePrevious(pairTicker?.lastPrice)
    const prev24hChangePercent = usePrevious(pairTicker?.priceChangePercent)

    const router = useRouter()

    const onReceiveTicker = debounce((ticker) => setPairTicker(ticker), 1000)
    const isClickFavorite = useRef(false);

    const handleSetFavorite = async () => {
        isClickFavorite.current = true;
        await favoriteAction(isFavorite ? 'delete' : 'put', TRADING_MODE.FUTURES, pairConfig?.baseAsset + '_' + pairConfig?.quoteAsset)
        dispatch(getFuturesFavoritePairs())
        isClickFavorite.current = false;
    }

    const renderContract = useCallback(() => {
        return (
            <div style={{ flex: '1 1 0%' }} className='flex items-center'>
                {isAuth &&
                    <Star
                        onClick={handleSetFavorite}
                        size={14}
                        fill={isFavorite
                            ? colors.yellow
                            : isDark
                                ? colors.darkBlue5
                                : colors.grey2
                        }
                        className='cursor-pointer mr-[10px]'
                    />
                }
                <div></div> {pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}
            </div>
        )
    }, [pairConfig?.pair, isFavorite])

    const renderLastPrice = useCallback(() => {
        return (
            <div
                style={{ flex: '1 1 0%' }}
                className={classNames('justify-end text-right text-dominant', {
                    '!text-red': pairTicker?.lastPrice < prevLastPrice,
                })}
            >
                {pairTicker?.lastPrice
                    ? formatNumber(
                        pairTicker?.lastPrice,
                        pairConfig?.pricePrecision
                    )
                    : '--'}
            </div>
        )
    }, [pairTicker?.lastPrice, prevLastPrice])

    const render24hChange = useCallback(() => {
        return (
            <div
                style={{ flex: '1 1 0%' }}
                className={classNames(
                    'justify-end text-right text-dominant', //text-darkBlue-5 dark:text-darkBlue-5
                    {
                        '!text-red': pairTicker?.priceChangePercent < 0,
                    }
                )}
            >
                {pairTicker?.priceChangePercent
                    ? formatNumber(
                        roundTo(pairTicker.priceChangePercent * (pairTicker?.quoteAsset === 'VNDC' ? 100 : 1), 2),
                        2,
                        2,
                        true
                    ) + '%'
                    : '--'}
            </div>
        )
    }, [pairTicker?.priceChangePercent])

    const renderTotalVolume = useCallback(() => {
        return (
            <div
                style={{ flex: '1 1 0%' }}
                className='justify-end text-right text-darkBlue-5 dark:text-darkBlue-5'
            >
                {pairTicker?.priceChangePercent || '--'}
            </div>
        )
    }, [])

    useEffect(() => {
        if (pairConfig?.pair && !pairTicker && marketWatch) {
            setPairTicker(marketWatch[pairConfig?.pair])
        }
    }, [pairTicker, marketWatch, pairConfig?.pair])

    useEffect(() => {
        if (pairConfig?.pair) {
            Emitter.on(
                PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE + pairConfig.pair,
                async (data) => {
                    if (data) {
                        const _pairTicker = FuturesMarketWatch.create(data, pairConfig?.quoteAsset)
                        if (_pairTicker?.symbol === pairConfig.pair) {
                            setPairTicker(_pairTicker)
                        }
                    }
                }
            )
        }

        return () => Emitter.off(PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE + pairConfig.pair)
    }, [publicSocket, pairConfig?.pair])

    // useEffect(() => console.log('MinTicker => ', pairTicker), [pairTicker])

    return (
        <div
            className='px-4 py-0.5 flex items-center justify-between font-medium text-xs rounded-[2px] hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer select-none'
            onClick={() =>
                !isClickFavorite.current && router.push(PATHS.FUTURES_V2.DEFAULT + `/${pairConfig?.pair}`)
            }
        >
            {renderContract()}
            {renderLastPrice()}
            {render24hChange()}
        </div>
    )
}

export default FuturesPairListItems
