import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiStatus, ORDER_BOOK_MODE, PublicSocketEvent, } from 'redux/actions/const';
import { FUTURES_ORDER_BOOK_ITEMS_HEIGHT } from './OrderBookItem';
import { formatNumber } from 'redux/actions/utils';
import { API_GET_FUTURES_DEPTH } from 'redux/actions/apis';
import { useAsync, usePrevious } from 'react-use';
import { isNumber, orderBy } from 'lodash';
import { handleTickSize } from 'utils/MarketDepthMerger';
import { roundTo } from 'round-to';

import FuturesOrderBookFilter from './OrderBookFilter';
import FuturesOrderBookMerger from './OrderBookMerger';
import FuturesOrdersList from './OrdersList';
import classNames from 'classnames';
import Emitter from 'redux/actions/emitter';
import Axios from 'axios';

const INITIAL_STATE = {
    loading: false,
    orderBook: null,
    tickSize: 0.01,
    tickSizeList: [],
    filterMode: ORDER_BOOK_MODE.ALL,
    componentHeight: 0,
    ordersMinHeight: 0,
}

const FuturesOrderBook = ({
    pairConfig,
    lastPrice,
    markPrice,
    orderBookLayout,
    setOrderInput,
    setAssumingPrice,
}) => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    const ref = useRef()
    const prevLastPrice = usePrevious(lastPrice)

    // ? Helper
    const initOrderBookData = (
        data,
        tickSize = 2,
        height = state.componentHeight,
        filterMode = state.filterMode
    ) => {
        let ordersMinHeight, maxRow
        const ask = orderBy(data?.ask, (e) => +e[0]) || []
        const bids = orderBy(data?.bids, (e) => +e[0], 'desc') || []

        if (filterMode === ORDER_BOOK_MODE.ALL) {
            ordersMinHeight = (height - 44 - ORDERS_HEADER_HEIGHT) / 2
            maxRow = Math.floor(
                ordersMinHeight / FUTURES_ORDER_BOOK_ITEMS_HEIGHT
            )
        } else {
            ordersMinHeight = height - 32 - ORDERS_HEADER_HEIGHT + 15
            maxRow = 20
        }

        const orderBook = {
            ask: handleTickSize(ask, tickSize, 'ask').splice(0, maxRow),
            bids: handleTickSize(bids, tickSize)?.splice(0, maxRow),
        }

        setAssumingPrice({
            ask: orderBook?.ask?.[0]?.[0],
            bid: orderBook?.bid?.[orderBook?.bid?.length - 1]?.[0],
        })

        setState({ ordersMinHeight, orderBook })
    }

    const onFilter = (filterMode) =>
        filterMode !== state.filterMode && setState({ filterMode })

    const onSetTickSize = (tickSize) =>
        tickSize !== state.tickSize && setState({ tickSize })

    // ? Render Handler
    const renderLastMarkPrice = useCallback(() => {
        return (
            <>
                <div
                    className={classNames('text-right w-[47%] text-dominant', {
                        '!text-red': lastPrice < prevLastPrice,
                    })}
                >
                    {formatNumber(
                        roundTo(
                            lastPrice || 0,
                            pairConfig?.pricePrecision || 0
                        ),
                        pairConfig?.pricePrecision || 0
                    )}
                    {/* <span
                        className={classNames(
                            'inline-block translate-y-[1px] transition-opacity duration-75 opacity-0',
                            {
                                '!rotate-180 !opacity-100':
                                    lastPrice < prevLastPrice,
                                '!rotate-0 !opacity-100':
                                    lastPrice > prevLastPrice,
                            }
                        )}
                    >
                        <i className='ci-short_up' />
                    </span> */}
                </div>
                <div className='text-center w-[6%]'>~</div>
                <div className='w-[47%] text-txtSecondary dark:text-txtSecondary-dark'>
                    {formatNumber(
                        roundTo(
                            markPrice || 0,
                            pairConfig?.pricePrecision || 0
                        ),
                        pairConfig?.pricePrecision || 0
                    )}
                </div>
            </>
        )
    }, [lastPrice, markPrice])

    // ? Side effect
    useAsync(async () => {
        if (!pairConfig?.pair) return
        !state.orderBook && setState({ loading: true })
        if (!state.orderBook && !state.componentHeight) {
            try {
                const { data } = await Axios.get(API_GET_FUTURES_DEPTH, {
                    params: { symbol: pairConfig?.pair },
                })

                if (data?.status === ApiStatus.SUCCESS)
                    initOrderBookData(
                        data?.data,
                        state.tickSize,
                        state.componentHeight,
                        ORDER_BOOK_MODE.ALL
                    )
            } catch (e) {
                console.log(`Can't get orderbook data `, e)
            } finally {
                setState({ loading: false })
            }
        }
    }, [state.tickSize, state.componentHeight])

    useEffect(() => {
        Emitter.on(PublicSocketEvent.FUTURES_DEPTH_UPDATE, (data) => {
            data &&
                initOrderBookData(
                    data,
                    state.tickSize,
                    state.componentHeight,
                    state.filterMode
                )
        })

        return () => {
            Emitter.off(PublicSocketEvent.FUTURES_DEPTH_UPDATE)
        }
    }, [state.tickSize, state.componentHeight, state.filterMode])

    useEffect(() => {
        if (ref.current?.clientHeight) {
            setState({
                componentHeight: ref.current.clientHeight,
            })
        }
    }, [ref.current, orderBookLayout?.h])

    useEffect(() => {
        const priceFilter = pairConfig?.filters?.find(
            (o) => o.filterType === 'PRICE_FILTER'
        )
        if (priceFilter) {
            const tickSize = +priceFilter.tickSize
            if (isNumber(tickSize) && tickSize) {
                const tickSizeList = []
                for (let i = 0; i < 5; i++) {
                    const _tick = tickSize * 10 ** i
                    tickSizeList.push(_tick)
                }

                setState({
                    tickSize,
                    tickSizeList,
                })
            }
        }
    }, [pairConfig])

    return (
        <div className='h-full flex flex-col'>
            <div className='hidden xl:block px-3.5 pt-5 py-2 w-full futures-component-title dragHandleArea'>
                OrderBook
            </div>
            <div className='relative z-30 px-3.5 mt-3.5 xl:mt-0 w-full flex items-center justify-between'>
                <FuturesOrderBookFilter
                    filterMode={state.filterMode}
                    onFilter={onFilter}
                />
                <FuturesOrderBookMerger
                    tickSize={state.tickSize}
                    tickSizeList={state.tickSizeList}
                    onSetTickSize={onSetTickSize}
                />
            </div>
            <div
                style={{
                    height: ORDERS_HEADER_HEIGHT,
                }}
                className='px-3.5 pt-2.5 mb-2.5 flex items-center justify-between font-medium text-[10px] text-txtSecondary dark:text-txtSecondary-dark'
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
                    Total ({pairConfig?.baseAsset})
                </div>
            </div>
            <div ref={ref} className='flex-grow overflow-hidden'>
                {/* Sell Orders */}
                {(state.filterMode === ORDER_BOOK_MODE.ALL ||
                    state.filterMode === ORDER_BOOK_MODE.ASKS) && (
                    <div
                        style={{ height: state.ordersMinHeight }}
                        className='overflow-hidden'
                    >
                        <FuturesOrdersList
                            side={ORDER_BOOK_MODE.ASKS}
                            orders={state.orderBook?.ask}
                            isOnly={state.filterMode === ORDER_BOOK_MODE.ASKS}
                            setOrderInput={setOrderInput}
                            pairConfig={pairConfig}
                        />
                    </div>
                )}

                <div
                    style={{
                        height:
                            state.filterMode === ORDER_BOOK_MODE.ALL ? 44 : 32,
                    }}
                    className='px-3.5 flex items-center justify-center text-md font-medium'
                >
                    {renderLastMarkPrice()}
                </div>

                {/* Buy Orders */}
                {(state.filterMode === ORDER_BOOK_MODE.ALL ||
                    state.filterMode === ORDER_BOOK_MODE.BIDS) && (
                    <div
                        style={
                            state.filterMode === ORDER_BOOK_MODE.ALL
                                ? { height: state.ordersMinHeight }
                                : { height: state.ordersMinHeight }
                        }
                        className='overflow-hidden'
                    >
                        <FuturesOrdersList
                            side={ORDER_BOOK_MODE.BIDS}
                            orders={state.orderBook?.bids}
                            isOnly={state.filterMode === ORDER_BOOK_MODE.BIDS}
                            setOrderInput={setOrderInput}
                            pairConfig={pairConfig}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

const LAST_PRICE_HEIGHT = 32
const ORDERS_HEADER_HEIGHT = 20

export default FuturesOrderBook
