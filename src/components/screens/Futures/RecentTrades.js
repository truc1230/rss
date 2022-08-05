import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { FUTURES_ORDER_BOOK_ITEMS_HEIGHT } from './OrderBook/OrderBookItem';
import { API_GET_FUTURES_RECENT_TRADES } from 'redux/actions/apis';
import { ApiStatus, PublicSocketEvent } from 'redux/actions/const';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { BREAK_POINTS } from 'constants/constants';
import { debounce } from 'lodash';

import classNames from 'classnames';
import axios from 'axios';
import useWindowSize from 'hooks/useWindowSize';

let temp = []
const MAX_LENGTH = 200

const FuturesRecentTrades = ({ pairConfig }) => {
    const [loading, setLoading] = useState(false)
    const [recentTrades, setRecentTrades] = useState([])

    const publicSocket = useSelector((state) => state.socket.publicSocket)
    const { width } = useWindowSize()
    const router = useRouter()

    // ? Helper
    const updateRecentTrades = debounce((data) => {
        if (data?.s === pairConfig?.pair) {
            setLoading(false)
            temp.unshift(data)
            temp = temp.slice(0, MAX_LENGTH)
            setRecentTrades(temp)
        }
    }, 100)

    const handleRouteChange = () => setLoading(true)

    // ? Render
    const renderRecentTradesItems = useCallback(
        () =>
            recentTrades?.map((trade, index) => {
                const { p: rate, q: amount, T: time } = trade
                return (
                    <div
                        key={`futures_recentTrades_${index}`}
                        style={{ height: FUTURES_ORDER_BOOK_ITEMS_HEIGHT }}
                        className='relative z-20 -mx-2 px-2 flex items-center justify-between font-medium text-xs rounded-[2px] hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer select-none'
                    >
                        <div
                            style={{ flex: '1 1 0%' }}
                            className={classNames(
                                'justify-start text-dominant'
                            )}
                        >
                            {formatNumber(
                                +rate,
                                pairConfig?.quotePrecision || 2
                            )}
                        </div>
                        <div
                            style={{ flex: '1 1 0%' }}
                            className='justify-end text-right text-darkBlue-5 dark:text-darkBlue-5'
                        >
                            {formatNumber(
                                +amount,
                                pairConfig?.baseAssetPrecision || 5
                            )}
                        </div>
                        <div
                            style={{ flex: '1 1 0%' }}
                            className='justify-end text-right text-darkBlue-5 dark:text-darkBlue-5'
                        >
                            {formatTime(time, 'HH:mm:ss')}
                        </div>
                    </div>
                )
            }),
        [recentTrades]
    )

    // ? Side Effect
    useAsync(async () => {
        !recentTrades && setLoading(true)
        if (!pairConfig?.pair) return
        try {
            const { data } = await axios.get(API_GET_FUTURES_RECENT_TRADES, {
                params: { symbol: pairConfig.pair },
            })
            if (data?.status === ApiStatus.SUCCESS) {
                temp = data?.data || []
                temp = temp.slice(0, MAX_LENGTH)
                setRecentTrades(temp)
            }
        } catch (e) {
        } finally {
            setLoading(false)
        }
    }, [pairConfig?.pair])

    useEffect(() => {
        if (publicSocket && pairConfig?.pair) {
            publicSocket.emit('subscribe:futures:recent_trade', pairConfig.pair)
            publicSocket.removeListener(
                PublicSocketEvent.FUTURES_RECENT_TRADE_ADD,
                updateRecentTrades
            )
            publicSocket.on(
                PublicSocketEvent.FUTURES_RECENT_TRADE_ADD,
                updateRecentTrades
            )
        }
        router.events.on('routeChangeStart', handleRouteChange)
        return function cleanup() {
            if (publicSocket && pairConfig?.pair) {
                publicSocket.removeListener(
                    PublicSocketEvent.FUTURES_RECENT_TRADE_ADD,
                    updateRecentTrades
                )
                publicSocket.emit(
                    'unsubscribe:futures:recent_trade',
                    pairConfig.pair
                )
                router.events.off('routeChangeStart', handleRouteChange)
            }
        }
    }, [publicSocket, router, pairConfig?.pair])

    return (
        <div className='h-full flex flex-col pb-3.5'>
            <div className='hidden xl:block px-3.5 pt-5 py-2 w-full futures-component-title dragHandleArea'>
                Trades
            </div>
            <div
                style={{
                    height: ORDERS_HEADER_HEIGHT,
                }}
                className={classNames(
                    'px-3.5 pt-7 xl:pt-2.5 mb-2.5 flex items-center justify-between font-medium text-[10px] text-txtSecondary dark:text-txtSecondary-dark',
                    { dragHandleArea: width < BREAK_POINTS.xl }
                )}
            >
                <div style={{ flex: '1 1 0%' }} className='justify-start'>
                    Price ({pairConfig?.quoteAsset})
                </div>
                <div
                    style={{ flex: '1 1 0%' }}
                    className='justify-end text-right'
                >
                    Amount ({pairConfig?.baseAsset})
                </div>
                <div
                    style={{ flex: '1 1 0%' }}
                    className='justify-end text-right'
                >
                    Time
                </div>
            </div>
            <div className='px-3.5 flex-grow w-full overflow-y-auto'>
                {renderRecentTradesItems()}
            </div>
        </div>
    )
}

const ORDERS_HEADER_HEIGHT = 20

export default FuturesRecentTrades
