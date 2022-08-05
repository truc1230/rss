import { IconLoading } from 'src/components/common/Icons';
import { reverse } from 'lodash';
import { Popover, Transition } from '@headlessui/react';
import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { ExchangeOrderEnum, PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { getOrderBook } from 'src/redux/actions/market';
import { SET_SPOT_SELECTED_ORDER } from 'src/redux/actions/types';
import { formatPrice, getFilter, getSymbolString, } from 'src/redux/actions/utils';
import LastPrice from '../markets/LastPrice';
import OrderBookAll from 'src/components/svg/OrderBookAll';
import OrderBookBids from 'src/components/svg/OrderBookBids';
import OrderBookAsks from 'src/components/svg/OrderBookAsks';
import { ORDER_BOOK_MODE } from 'redux/actions/const';
import SvgChevronDown from 'src/components/svg/ChevronDown';
import { getDecimalScale } from 'redux/actions/utils';
import { handleTickSize } from 'utils/MarketDepthMerger';
import classNames from 'classnames';

const OrderBook = (props) => {
    const { t } = useTranslation(['common', 'spot'])
    const { symbol, layoutConfig, parentState } = props
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] })
    const { base, quote } = props.symbol
    const dispatch = useDispatch()
    const setSelectedOrder = (order) => {
        dispatch({
            type: SET_SPOT_SELECTED_ORDER,
            payload: order,
        })
    }
    const quoteAsset = useSelector((state) => state.user.quoteAsset) || 'USDT'
    const router = useRouter()

    const symbolString = useMemo(() => {
        return base + quote
    }, [base, quote])
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig)
    const [tickSize, setTickSize] = useState(0.01)
    const [decimal, setDecimal] = useState(2)
    const [tickSizeOptions, setTickSizeOptions] = useState([])
    const [loadingAsks, setLoadingAsks] = useState(true)
    const [loadingBids, setLoadingBids] = useState(true)
    const [orderBookMode, setOrderBookMode] = useState(ORDER_BOOK_MODE.ALL)

    const [height, setHeight] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight)
        }
    }, [ref.current, layoutConfig?.h])

    useAsync(async () => {
        // Get symbol list
        const _orderBook = await getOrderBook(getSymbolString(symbol))
        await setOrderBook(_orderBook)
        setLoadingAsks(false)
        setLoadingBids(false)
    }, [symbol])

    const handleRouteChange = async () => {
        setLoadingAsks(true)
        setLoadingBids(true)
    }

    useEffect(() => {
        if (orderBook) {
            parentState({ orderBook })
        }
    }, [orderBook])

    useEffect(() => {
        const event = PublicSocketEvent.SPOT_DEPTH_UPDATE + 'order_book'
        Emitter.on(event, async (data) => {
            if (data?.symbol === `${symbol.base}${symbol.quote}`) {
                setLoadingAsks(false)
                setLoadingBids(false)
                setOrderBook(data)
            }
        })
        router.events.on('routeChangeStart', handleRouteChange)

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return function cleanup() {
            Emitter.off(event)
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [symbol])

    useEffect(() => {
        const currentExchangeConfig = exchangeConfig.find(
            (e) => e.symbol === getSymbolString(symbol)
        )
        const priceFilter = getFilter(
            ExchangeOrderEnum.Filter.PRICE_FILTER,
            currentExchangeConfig || []
        )
        const result = []
        for (let i = 0; i < 5; i++) {
            result.push(+priceFilter?.tickSize * 10 ** i)
        }
        setTickSizeOptions(result)
        setTickSize(+priceFilter?.tickSize)
    }, [exchangeConfig, symbol])

    useEffect(() => {
        setDecimal(getDecimalScale(tickSize))
    }, [tickSize])

    const divide = orderBookMode === ORDER_BOOK_MODE.ALL ? 2 : 1

    const MAX_LENGTH = Math.floor((height - 145) / divide / 20)
    let asks = []
    let bids = []

    const originAsks =
        orderBook?.asks?.length > 0
            ? orderBy(orderBook?.asks, [(e) => +e[0]])
            : []
    const originBids =
        orderBook?.bids?.length > 0
            ? orderBy(orderBook?.bids, [(e) => +e[0]], 'desc')
            : []

    for (
        let i = 0;
        i < Math.min(MAX_LENGTH, orderBook?.asks?.length || 0);
        i++
    ) {
        if (originAsks[i]) {
            asks.push(originAsks[i])
        } else {
            asks.push([0, 0])
        }
    }
    for (
        let i = 0;
        i < Math.min(MAX_LENGTH, orderBook?.bids?.length || 0);
        i++
    ) {
        if (originBids[i]) {
            bids.push(originBids[i])
        } else {
            bids.push([0, 0])
        }
    }

    // const handleTickSize = (data, type) => {
    //     const _data = data.map((e) => {
    //         const rate = type === 'ask' ? ceil((+e[0]), decimal)  : floor((+e[0]) , decimal);
    //         return { rate, amount: +e[1] };
    //     });

    //     const groupedData = groupBy(_data, 'rate');
    //     const output = [];
    //     map(groupedData, (objs, key) => {
    //         output.push([key, sumBy(objs, 'amount')]);
    //         return true;
    //     });
    //     return output;
    // };

    asks = reverse(asks)
    asks = handleTickSize(asks, tickSize, 'ask')
    bids = handleTickSize(bids, tickSize, 'bids')
    asks = orderBy(asks, [(e) => +e[0]], ['desc'])
    bids = orderBy(bids, [(e) => -e[0]])
    const maxAsk = maxBy(asks, (o) => {
        return o[1]
    })
    const maxBid = maxBy(bids, (o) => {
        return o[1]
    })

    const renderOrderRow = (order, index, side) => {
        const [p, q] = order
        const maxQuote = side === 'buy' ? maxAsk?.[1] : maxBid?.[1]
        const percentage = (q / maxQuote) * 100
        return (
            <div
                className='progress-container my-[1px] cursor-pointer hover:bg-teal-50 dark:hover:bg-darkBlue-3'
                key={index}
                onClick={() => setSelectedOrder({ price: +p, quantity: +q })}
            >
                <div className='flex items-center flex-1'>
                    <div
                        className={`flex-1  text-xs font-medium leading-table ${
                            side === 'buy' ? 'text-red' : 'text-teal'
                        }`}
                    >
                        {p ? formatPrice(p, decimal || 8) : '-'}
                    </div>
                    <div className='flex-1 text-Primary dark:text-txtPrimary-dark text-xs font-medium leading-table text-right'>
                        {q
                            ? formatPrice(+q, exchangeConfig, symbolString)
                            : '-'}
                    </div>
                    <div className='flex-1 text-Primary dark:text-txtPrimary-dark text-xs font-medium leading-table text-right'>
                        {p > 0
                            ? formatPrice(p * q, quoteAsset === 'VNDC' ? 0 : 2)
                            : '-'}
                    </div>
                </div>
                <div
                    className={`progress-bar ${
                        side === 'buy' ? 'ask-bar' : 'bid-bar'
                    } `}
                    style={{ width: `${parseInt(percentage, 10)}%` }}
                />
            </div>
        )
    }

    const renderOrderBook = (side) => {
        // side: buy|sell

        let inner
        if (
            side === 'buy' &&
            [ORDER_BOOK_MODE.ASKS, ORDER_BOOK_MODE.ALL].includes(orderBookMode)
        ) {
            inner = loadingAsks ? (
                <div className='flex items-center justify-center h-full'>
                    <IconLoading color='#00C8BC' />
                </div>
            ) : (
                <div className=''>
                    {asks.map((order, index) => {
                        return renderOrderRow(order, index, 'buy')
                    })}
                </div>
            )
        } else if (
            side === 'sell' &&
            [ORDER_BOOK_MODE.BIDS, ORDER_BOOK_MODE.ALL].includes(orderBookMode)
        ) {
            inner = loadingBids ? (
                <div className='flex items-center justify-center h-full'>
                    <IconLoading color='#00C8BC' />
                </div>
            ) : (
                <div className=''>
                    {bids.map((order, index) => {
                        return renderOrderRow(order, index, 'sell')
                    })}
                </div>
            )
        }

        if (inner) {
            return (
                <div
                    className={classNames(
                        'flex flex-col justify-start flex-1',
                        { '!justify-end': side === 'buy' }
                    )}
                >
                    {inner}
                </div>
            )
        }
        return null
    }

    const renderTickSizeOptions = () => {
        return (
            <Popover className='relative'>
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`flex items-center h-5 rounded bg-bgInput dark:bg-bgInput-dark pl-2 pr-1 ${
                                open ? '' : 'text-opacity-90'
                            } `}
                        >
                            <span className='text-xxs font-medium text-txtSecondary dark:text-txtSecondary-dark mr-1'>
                                {tickSize}
                            </span>
                            <SvgChevronDown size={14} />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter='transition ease-out duration-200'
                            enterFrom='opacity-0 translate-y-1'
                            enterTo='opacity-100 translate-y-0'
                            leave='transition ease-in duration-150'
                            leaveFrom='opacity-100 translate-y-0'
                            leaveTo='opacity-0 translate-y-1'
                        >
                            <Popover.Panel className='absolute right-0 z-10'>
                                <div className='overflow-hidden rounded-md shadow-lg bg-white dark:bg-darkBlue-3'>
                                    <div className='w-32 relative'>
                                        {tickSizeOptions.map((item, index) => {
                                            const isActive = tickSize === item
                                            return (
                                                <div
                                                    onClick={() =>
                                                        setTickSize(item)
                                                    }
                                                    key={index}
                                                    className={`h-8 leading-8 px-2 cursor-pointer w-full font-medium text-xs text-center rounded-sm
                                                                 dark:text-txtSecondary-dark
                                                                hover:text-teal
                                                                dark:hover:text-teal
                                                                ${
                                                                    isActive
                                                                        ? 'bg-opacity-10 dark:bg-opacity-10 bg-teal text-teal dark:bg-teal dark:text-teal'
                                                                        : ''
                                                                }
                                                                `}
                                                >
                                                    {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        )
    }

    return (
        <>
            <div
                className='px-2.5 relative h-full bg-bgSpotContainer dark:bg-bgSpotContainer-dark flex flex-col box-border'
                ref={ref}
            >
                <div className='flex items-center justify-between py-4 dragHandleArea'>
                    <div className='font-medium text-sm text-txtPrimary dark:text-txtPrimary-dark'>
                        {t('orderbook')}
                    </div>
                </div>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex justify-start'>
                        <OrderBookAll
                            className={`mr-3 cursor-pointer ${
                                orderBookMode === ORDER_BOOK_MODE.ALL
                                    ? ''
                                    : 'opacity-50'
                            }`}
                            onClick={() =>
                                setOrderBookMode(ORDER_BOOK_MODE.ALL)
                            }
                        />
                        <OrderBookBids
                            className={`mr-3 cursor-pointer ${
                                orderBookMode === ORDER_BOOK_MODE.BIDS
                                    ? ''
                                    : 'opacity-50'
                            }`}
                            onClick={() =>
                                setOrderBookMode(ORDER_BOOK_MODE.BIDS)
                            }
                        />
                        <OrderBookAsks
                            className={`mr-3 cursor-pointer ${
                                orderBookMode === ORDER_BOOK_MODE.ASKS
                                    ? ''
                                    : 'opacity-50'
                            }`}
                            onClick={() =>
                                setOrderBookMode(ORDER_BOOK_MODE.ASKS)
                            }
                        />
                    </div>
                    {renderTickSizeOptions()}
                </div>
                <div className='flex flex-col flex-1'>
                    <div className=''>
                        <div className='flex justify-between items-center mb-3'>
                            <div className='flex flex-1 justify-start text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium'>
                                {t('price')} ({quote})
                            </div>
                            <div className='flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium'>
                                {t('quantity')} ({base})
                            </div>
                            <div className='flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium'>
                                {t('total')} ({quote})
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col flex-1'>
                        {renderOrderBook('buy')}
                        <div className=' dark:border-divider-dark py-3 flex justify-center items-center'>
                            <div className='text-sm w-full'>
                                <span className='font-medium text-base text-center'>
                                    <LastPrice
                                        symbol={symbol}
                                        colored
                                        exchangeConfig={exchangeConfig}
                                    />
                                </span>
                            </div>
                        </div>
                        {renderOrderBook('sell')}
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderBook
