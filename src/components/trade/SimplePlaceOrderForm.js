/* eslint-disable react-hooks/exhaustive-deps */
import { Listbox, Transition } from '@headlessui/react';
import axios from 'axios';
import { IconLock } from 'src/components/common/Icons';
import ceil from 'lodash/ceil';
import defaults from 'lodash/defaults';
import find from 'lodash/find';
import floor from 'lodash/floor';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { useAsync, useDebounce, useLocalStorage } from 'react-use';
import { getMarketWatch } from 'redux/actions/market';
import InputSlider from 'src/components/trade/InputSlider';
import * as Error from 'src/redux/actions/apiError';
import { ApiStatus, EPS, ExchangeOrderEnum, PublicSocketEvent, SpotMarketPriceBias, } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import {
    formatBalance,
    formatPrice,
    getDecimalScale,
    getFilter,
    getLoginUrl,
    getSymbolString,
} from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import showNotification from 'utils/notificationService';
import { GET_SPOT_FEE_CONFIG } from 'redux/actions/apis';
import { max, min } from 'lodash/math';
import { isNumber } from 'lodash';

let initPrice = '';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
        return htmlElRef.current && htmlElRef.current.focus();
    };
    return [htmlElRef, setFocus];
};

const allSubTabs = [
    ExchangeOrderEnum.Type.MARKET,
    ExchangeOrderEnum.Type.LIMIT,
];

const SimplePlaceOrderForm = ({ symbol, orderBook }) => {
    const [priceRef, setPriceFocus] = useFocus();
    const [quantityRef, setQuantityFocus] = useFocus();
    const [quoteQtyRef, setQuoteQtyFocus] = useFocus();
    const { base, quote } = symbol;
    const { t } = useTranslation();
    const QuantityMode = [
        {
            id: ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY,
            name: t('total'),
        },
        {
            id: ExchangeOrderEnum.QuantityMode.QUANTITY,
            name: t('amount'),
        },
    ];

    const user = useSelector(state => state.auth.user) || null;
    const balanceSpot = useSelector(state => state.wallet.SPOT);
    const selectedOrder = useSelector(state => state.spot?.selectedOrder);
    const cancelButtonRef = useRef();
    const [open, setOpen] = useState(false);
    const [quantityMode, setQuantityMode] = useState(QuantityMode[1]);
    const [buyPercentage, setBuyPercentage] = useState(0);
    const [sellPercentage, setSellPercentage] = useState(0);
    const [placing, setPlacing] = useState(false);
    const [orderSide, setOrderSide] = useState(ExchangeOrderEnum.Side.BUY);
    const [orderType, setOrderType] = useState(ExchangeOrderEnum.Type.LIMIT);
    const [buyQuantity, setBuyQuantity] = useState(0);
    const [sellQuantity, setSellQuantity] = useState(0);
    const [buyQuoteQty, setBuyQuoteQty] = useState(0);
    const [sellQuoteQty, setSellQuoteQty] = useState(0);
    const [focus, setFocus] = useState('');
    const [buyPrice, setBuyPrice] = useState();
    const [sellPrice, setSellPrice] = useState();
    const [loadingInitialPrice, setLoadingInitialPrice] = useState(true);
    const [initialPrice, setInitialPrice] = useState();
    const [needConfirm, setNeedConfirm] = useLocalStorage('spot:need_confirm', 'true');
    const [symbolTicker, setSymbolTicker] = useState(null);
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';
    const [isLoadingMultiValueList, setIsLoadingMultiValueList] = useState(true);
    const [multiValueList, setMultiValueList] = useState({});
    const [multiValue, setMultiValue] = useState(0);
    const router = useRouter();
    const [discountTransactionFee, setDiscountTransactionFee] = useState(0);
    const [isUseQuoteQuantity, setIsUseQuoteQuantity] = useState(false);
    const [state, set] = useState({ centerPrice: null, feeConfig: null })
    const setState = (state) => set(prevState => ({...prevState, ...state}))


    const getFeeConfig = async () => {
        try {
            const { data: {status, data: feeConfig}} = await axios.get(GET_SPOT_FEE_CONFIG);
            if (status === 'ok') {
                setState({feeConfig});
            }
        } catch (e) {
            console.log('Cant get fee config: ', e);
        }
    };

    useAsync(async () => {
        if (symbol) {
            setMultiValue(symbol?.quote === 'VNDC' ? 24000 : 1);
            const newSymbolTicker = await getMarketWatch(getSymbolString(symbol));
            setSymbolTicker(newSymbolTicker?.[0]);
        }
    }, [symbol]);

    useEffect(() => {
        getFeeConfig()
    }, [])

    useEffect(() => {
        Emitter.on(PublicSocketEvent.SPOT_TICKER_UPDATE, async (data) => {
            setSymbolTicker(data);
        });
        return function cleanup() {
            Emitter.off(PublicSocketEvent.SPOT_TICKER_UPDATE);
        };
    }, [Emitter]);

    useEffect(() => {
        if (initPrice !== symbolTicker?.b) {
            initPrice = symbolTicker?.b;
            setBuyPrice(+symbolTicker?.p);
            setSellPrice(+symbolTicker?.p);
            setBuyQuantity(0);
            setBuyQuoteQty(0);
            setBuyPercentage(0);
            setSellQuantity(0);
            setSellQuoteQty(0);
            setSellPercentage(0);
        }
    }, [symbolTicker]);

    useEffect(() => {
        if (selectedOrder?.price) {
            setBuyPrice(selectedOrder?.price);
            setSellPrice(selectedOrder?.price);
        }
        if (selectedOrder?.quantity) {
            setBuyQuantity(selectedOrder?.quantity);
            setSellQuantity(selectedOrder?.quantity);
        }
        if (selectedOrder?.quantity && selectedOrder?.price) {
            setBuyQuoteQty(floor(selectedOrder?.quantity * selectedOrder?.price, 2));
            setSellQuoteQty(floor(selectedOrder?.quantity * selectedOrder?.price, 2));
        }
    }, [selectedOrder]);

    useEffect(() => {
        if (orderBook) {
            const asks = orderBook?.asks.map(e => e[0])
            const bids = orderBook?.bids.map(e => e[0])
            if (max(bids) && min(asks)) {
                setState({ centerPrice: (max(bids) + min(asks)) / 2 })
            }
        }
    }, [orderBook])

    const currentExchangeConfig = exchangeConfig.find(e => e.symbol === getSymbolString(symbol));
    const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, currentExchangeConfig || []);
    const quantityFilter = getFilter(ExchangeOrderEnum.Filter.LOT_SIZE, currentExchangeConfig || []);
    const minNotionalFilter = getFilter(ExchangeOrderEnum.Filter.MIN_NOTIONAL, currentExchangeConfig || []);
    // const quoteAssetPrecision = currentExchangeConfig?.quoteAssetPrecision || 6;
    // const baseAssetPrecision = currentExchangeConfig?.baseAssetPrecision || 6;
    const baseAssetId = currentExchangeConfig?.baseAssetId || 0;
    const quoteAssetId = currentExchangeConfig?.quoteAssetId || 0;

    const handleClickSubTab = (tab) => {
        setOrderType(tab);
    };

    const subTabs = [
        ExchangeOrderEnum.Type.MARKET,
        ExchangeOrderEnum.Type.LIMIT,
    ];

    const filterOrderInputApi = (input = {}) => {
        const success = null;
        const {
            symbol,
            price,
            stopPrice,
            side,
            type,
            quantity,
            quoteOrderQty,
            useQuoteQty,
        } = defaults(input, {
            symbol: null,
            price: null,
            stopPrice: null,
            side: null,
            type: null,
            quantity: 0,
            quoteOrderQty: 0,
            useQuoteQty: false,
        });

        const config = currentExchangeConfig;
        if (config.filters && config.filters.length) {
            for (let i = 0; i < config.filters.length; i++) {
                const filter = config.filters[i];
                switch (filter.filterType) {
                    case ExchangeOrderEnum.Filter.PRICE_FILTER: {
                        const {
                            minPrice,
                            maxPrice,
                        } = filter;
                        if ([
                            ExchangeOrderEnum.Type.LIMIT,
                        ].includes(type)) {
                            if (
                                price < +minPrice
                                || price > +maxPrice
                            ) {
                                return Error.PRICE_FILTER;
                            }
                        }
                        if ([
                            ExchangeOrderEnum.Type.STOP_LIMIT,
                        ].includes(type)) {
                            if (stopPrice < minPrice || stopPrice > maxPrice) {
                                return Error.PRICE_FILTER;
                            }
                        }
                        break;
                    }
                    case ExchangeOrderEnum.Filter.LOT_SIZE: {
                        if (useQuoteQty && +quoteOrderQty > 0) break;
                        const {
                            minQty,
                            maxQty,
                        } = filter;
                        if (+quantity < +minQty || +quantity > +maxQty) {
                            return Error.LOT_SIZE;
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
        }
        return success;
    };

    const getInitialPrice = async (assetId, source) => {
        if (!(assetId)) return;
        setLoadingInitialPrice(true);
        const { data, status } = await fetchAPI({
            url: '/api/v1/asset/initial_price',
            options: {
                method: 'GET',
            },
            params: {
                assetId,
            },
            cancelToken: source.token,
        });
        setLoadingInitialPrice(false);

        if (status === ApiStatus.SUCCESS) {
            setInitialPrice(data);
        }
    };

    const handleRouteCancel = (source) => () => {
        source.cancel();
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        getInitialPrice(baseAssetId, source);
        router.events.on('routeChangeStart', handleRouteCancel(source));

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeStart', handleRouteCancel(source));
        };
    }, [baseAssetId, symbol]);


    const createOrder = async (_orderSide) => {
        // console.log('__ check cerate', _orderSide);
        // Filter input
        try {
            const _quantity = _orderSide === ExchangeOrderEnum.Side.BUY ? +buyQuantity : +sellQuantity;
            const _quoteOrderQty = _orderSide === ExchangeOrderEnum.Side.BUY ? +buyQuoteQty : +sellQuoteQty;
            const _price = _orderSide === ExchangeOrderEnum.Side.BUY ? +buyPrice : +sellPrice;

            const params = {
                symbol: `${base}${quote}`,
                side: _orderSide,
                type: orderType,
                quantity: _quantity,
                quoteOrderQty: _quoteOrderQty,
                price: _price,
                useQuoteQty: isUseQuoteQuantity,
            };
            // console.log('__ check params order', params);
            // console.log(orderType, quantityMode.id, ExchangeOrderEnum.Type.MARKET, ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY);

            // if (orderType === ExchangeOrderEnum.Type.MARKET && quantityMode.id === ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY) {
            //     params.useQuoteQty = true;
            // }
            // const filterResult = filterOrderInputApi(params);
            // if (filterResult) {
            //     const { code, message } = filterResult;
            //     showNotification({ message: `(${code}) ${t(`error:${message}`)}`, title: 'Error', type: 'failure' }, 'bottom', 'bottom-right');
            //     return;
            // }

            const res = await fetchAPI({
                url: '/api/v3/spot/order',
                options: {
                    method: 'POST',
                },
                params,
            });
            const { status, data, message } = res;
            if (status === ApiStatus.SUCCESS) {
                const {
                    baseAsset,
                    displayingId,
                    price: _price,
                    quantity: _quantity,
                    quoteAsset,
                    side,
                    type,
                } = data;
                let message = '';
                if (type === ExchangeOrderEnum.Type.MARKET) {
                    message = t('spot:place_success_market', {
                        displayingId, side, type, token: `${baseAsset}/${quoteAsset}`,
                    });
                } else {
                    message = t('spot:place_success_limit', {
                        displayingId, side, type, token: `${baseAsset}/${quoteAsset}`,
                    });
                }
                showNotification({ message, title: t('common:success'), type: 'success' },2500, 'bottom', 'bottom-right');
            } else {
                const error = find(Error, { code: res?.code });
                const { requestId } = data;
                let shortRequestId = null;
                let content = null;
                if (typeof requestId === 'string' && requestId?.length > 0) {
                    shortRequestId = (requestId.split('-')[0]).toUpperCase();
                    content = error
                        ? `(${shortRequestId}) ` + t(`error:${error.message}`)
                        : `(${shortRequestId}) ` + t('error:ERROR_COMMON');
                } else {
                    content = error
                        ? t(`error:${error.message}`)
                        : t('error:ERROR_COMMON');
                }
                switch (message) {
                    case ExchangeOrderEnum.Filter.MIN_NOTIONAL:
                        content = t('error:MIN_NOTIONAL', { value: `${formatPrice(minNotionalFilter.minNotional)} ${quote}` });
                        break;
                    default:
                        break;
                }

                showNotification({ message: content, title: t('common:failure'), type: 'warning' },2500, 'bottom', 'bottom-right');
            }
        } catch (e) {
            console.log('createOrder web: ', e);
        } finally {
            setPlacing(false);
        }
    };

    const orderTypeLabels = {
        [ExchangeOrderEnum.Type.LIMIT]: t('spot:limit'),
        [ExchangeOrderEnum.Type.MARKET]: t('spot:market'),
    };

    const confirmModal = async (_orderSide) => {
        // console.log('__ chekc order', _orderSide);
        setPlacing(true);
        // console.log('__ chekc order 2', _orderSide);
        await createOrder(_orderSide);
    };

    const getAvailableText = (assetId) => {
        return formatBalance(balanceSpot?.[assetId]?.value - balanceSpot?.[assetId]?.locked_value, 6);
    };

    const getAvailable = (assetId) => {
        return balanceSpot?.[assetId]?.value - balanceSpot?.[assetId]?.locked_value;
    };

    const getBalance = (assetId) => {
        return balanceSpot?.[assetId]?.value;
    };

    useDebounce(
        () => {
            if (focus !== 'percentage') return;
            if (!(baseAssetId && quoteAssetId)) return;
            const available = getAvailable(quoteAssetId);
            if (!(available > EPS)) return;
            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +buyPrice;

            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p * (1 + SpotMarketPriceBias.NORMAL);
            }
            const nextQuoteQty = floor(available * buyPercentage / 100 * (1), 2);
            const nextQuantity = floor(nextQuoteQty / _price, qtyDecimal);
            setBuyQuantity(nextQuantity);
            setBuyQuoteQty(nextQuoteQty);
        },
        100,
        [orderSide, orderType, quantityMode, buyPercentage],
    );
    useDebounce(
        () => {
            if (focus !== 'percentage') return;
            if (!(baseAssetId && quoteAssetId)) return;
            const available = getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            const _price = +sellPrice;
            const nextQuantity = floor(available * sellPercentage / 100, qtyDecimal);
            const nextQuoteQty = floor(nextQuantity * _price, 2);
            setSellQuantity(nextQuantity);
            setSellQuoteQty(nextQuoteQty);
        },
        100,
        [orderSide, orderType, quantityMode, sellPercentage],
    );

    useDebounce(
        () => {
            if (focus !== 'price') return; // Mac dinh la limit
            if (!(baseAssetId && quoteAssetId)) return;
            const available = orderSide === ExchangeOrderEnum.Side.BUY ? getAvailable(quoteAssetId) : getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            const _price = +buyPrice;
            const _quantity = +buyQuantity;
            const _quoteQty = +buyQuoteQty;

            const nextQuoteQty = floor(_quantity * _price * (1), 2);
            setBuyQuoteQty(nextQuoteQty);
            const nextPercentage = ceil(nextQuoteQty / available, 0);
            setBuyPercentage(nextPercentage);

            // setDebouncedValue(queryFilter);
        },
        100,
        [orderSide, orderType, quantityMode, buyPrice],
    );

    useDebounce(
        () => {
            if (focus !== 'price') return; // Mac dinh la limit
            if (!(baseAssetId && quoteAssetId)) return;
            const available = getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            const _price = +sellPrice;
            const _quantity = +sellQuantity;
            const _quoteQty = +sellQuoteQty;

            const nextQuoteQty = floor(_quantity * _price * (1), 2);
            setBuyQuoteQty(nextQuoteQty);
            if (orderSide === ExchangeOrderEnum.Side.BUY) {
                const nextPercentage = ceil(nextQuoteQty / available, 0);
                setBuyPercentage(nextPercentage);
            }

            // setDebouncedValue(queryFilter);
        },
        100,
        [orderSide, orderType, quantityMode, sellPrice],
    );
    useDebounce(
        () => {
            if (focus !== 'quantity') return;
            if (!(baseAssetId && quoteAssetId)) return;

            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +buyPrice;
            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p * (1);
            }
            const _quantity = +buyQuantity;
            const _quoteQty = +buyQuoteQty;

            const nextQuoteQty = floor(_quantity * _price * (1), 2);
            setBuyQuoteQty(nextQuoteQty);
            const available = orderSide === ExchangeOrderEnum.Side.BUY ? getAvailable(quoteAssetId) : getAvailable(baseAssetId);

            if (!(available > EPS)) return;
            const nextPercentage = ceil(nextQuoteQty / available * 100, 0);
            setBuyPercentage(Math.min(nextPercentage, 100));
        },
        100,
        [orderSide, orderType, quantityMode, buyQuantity],
    );
    useDebounce(
        () => {
            if (focus !== 'quantity') return;
            if (!(baseAssetId && quoteAssetId)) return;

            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +sellPrice;
            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p * (1);
            }
            const _quantity = +sellQuantity;
            const _quoteQty = +sellQuoteQty;

            const nextQuoteQty = floor(_quantity * _price * (1), 2);
            setSellQuoteQty(nextQuoteQty);
            const available = getAvailable(baseAssetId);

            if (!(available > EPS)) return;
            const nextPercentage = ceil(_quantity / available * 100, 0);
            setSellPercentage(Math.min(nextPercentage, 100));
        },
        100,
        [orderSide, orderType, quantityMode, sellQuantity],
    );
    useDebounce(
        () => {
            if (focus !== 'quoteQty') return;
            if (!(baseAssetId && quoteAssetId)) return;

            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +buyPrice;
            const _quantity = +buyQuantity;
            const _quoteQty = +buyQuoteQty;

            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p * (1);
            }
            const nextQuantity = floor(_quoteQty / _price * (1), qtyDecimal);
            setBuyQuantity(nextQuantity);
            let nextPercentage = 0;

            const available = orderSide === ExchangeOrderEnum.Side.BUY ? getAvailable(quoteAssetId) : getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            if (orderSide === ExchangeOrderEnum.Side.SELL) {
                nextPercentage = ceil(nextQuantity / available * 100, 0);
            } else {
                nextPercentage = ceil(_quoteQty / available * 100, 0);
            }
            setBuyPercentage(Math.min(nextPercentage, 100));

            // setDebouncedValue(queryFilter);
        },
        100,
        [orderSide, orderType, quantityMode, buyQuoteQty],
    );
    useDebounce(
        () => {
            if (focus !== 'quoteQty') return;
            if (!(baseAssetId && quoteAssetId)) return;

            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +sellPrice;
            const _quantity = +sellQuantity;
            const _quoteQty = +sellQuoteQty;

            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p * (1);
            }
            const nextQuantity = floor(_quoteQty / _price * (1), qtyDecimal);
            setSellQuantity(nextQuantity);
            let nextPercentage = 0;

            const available = getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            nextPercentage = ceil(nextQuantity / available * 100, 0);
            setSellPercentage(Math.min(nextPercentage, 100));

            // setDebouncedValue(queryFilter);
        },
        100,
        [orderSide, orderType, quantityMode, sellQuoteQty],
    );

    const _renderOrderType = useMemo(() => {
        const tabs = [];
        subTabs.forEach(tab => {
            if (currentExchangeConfig?.orderTypes
            && currentExchangeConfig?.orderTypes.includes(tab)
            ) {
                tabs.push(tab);
            }
        });
        return (
            <ul className="tabs justify-start mb-2 dragHandleArea">
                {tabs.map((tab, index) => {
                    return (
                        <li className={`tab-item px-2 font-medium ${orderType === tab ? 'active' : ''}`} key={index}>
                            <a
                                className={'tab-link text-txtSecondary dark:text-txtSecondary-dark ' + (orderType === tab ? 'active' : '')}
                                onClick={() => handleClickSubTab(tab)}
                            > {orderTypeLabels[tab]}
                            </a>
                        </li>);
                })}
            </ul>
        );
    }, [orderType, t, currentExchangeConfig]);

    const _renderOrderPrice = (_orderSide) => {
        // if (orderType !== ExchangeOrderEnum.Type.LIMIT) return null;
        return (
            <div className="flex justify-between items-center mb-2">

                <div className="form-group w-full">
                    <div className="input-group">
                        <div className="input-group-prepend px-3 flex-shrink-0 w-[80px] flex  items-center">
                            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium">{t('common:price')}</div>
                        </div>

                        {
                            orderType === ExchangeOrderEnum.Type.LIMIT
                            &&
                            (
                                <NumberFormat
                                    getInputRef={priceRef}
                                    className="form-control form-control-sm !pr-0 !pl-2 text-right font-medium outline-none"
                                    name="stop_buy_input"
                                    thousandSeparator
                                    onFocus={() => {
                                        setFocus('price');
                                    }}
                                    decimalScale={getDecimalScale(+priceFilter?.tickSize)}
                                    allowNegative={false}
                                    value={_orderSide === ExchangeOrderEnum.Side.BUY ? buyPrice : sellPrice}
                                    onValueChange={({ value }) => {
                                        if (_orderSide === ExchangeOrderEnum.Side.BUY) {
                                            setBuyPrice(value);
                                        } else {
                                            setSellPrice(value);
                                        }
                                    }}
                                />
                            )
                        }
                        {
                            orderType === ExchangeOrderEnum.Type.MARKET
                            &&
                            (
                                <input
                                    className="form-control form-control-sm !pr-0 !pl-2 text-right font-medium"
                                    name="stop_buy_input"
                                    type="text"
                                    disabled
                                    value={t('spot:market')}
                                />
                            )
                        }
                        <div
                            className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                        >
                            <span className="input-group-text text-txtSecondary dark:text-txtSecondary-dark">
                                {quote}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const _renderQuantitySlider = (_orderSide) => {
        return (
            <div className="mt-5 mb-3 relative">
                <InputSlider
                    axis="x"
                    x={_orderSide === ExchangeOrderEnum.Side.BUY ? buyPercentage : sellPercentage}
                    onDragStart={() => {
                        setFocus('percentage');
                        quantityRef?.current?.blur();
                        priceRef?.current?.blur();
                        quoteQtyRef?.current?.blur();
                    }}
                    onChange={({ x }) => {
                        if (_orderSide === ExchangeOrderEnum.Side.BUY) {
                            setBuyPercentage(x);
                        } else {
                            setSellPercentage(x);
                        }
                    }}
                />
            </div>
        );
    };

    const _renderQuantityMode = useMemo(() => {
        return (
            <Listbox
                value={quantityMode}
                onChange={(value) => {
                    if (value === QuantityMode[0]) {
                        setIsUseQuoteQuantity(true);
                    } else {
                        setIsUseQuoteQuantity(false);
                    }
                    setQuantityMode(value);
                }}
            >
                {({ open }) => (
                    <>
                        <div className="relative z-50">
                            <Listbox.Button
                                className="relative w-full text-left cursor-pointer focus:outline-none sm:text-sm"
                            >
                                <div className="text-sm text-black-500 font-medium">
                                    <span className="w-[100px]">
                                        {quantityMode.name}
                                    </span>
                                    <svg
                                        className="ml-1.5 inline"
                                        width="8"
                                        height="5"
                                        viewBox="0 0 8 5"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.31208 0C0.43606 0 -0.0165491 1.04647 0.583372 1.68483L3.22245 4.49301C3.6201 4.91614 4.29333 4.91276 4.68671 4.48565L7.27316 1.67747C7.8634 1.03664 7.40884 0 6.53761 0H1.31208Z"
                                            fill="#8B8C9B"
                                        />
                                    </svg>
                                </div>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options
                                    static
                                    className="absolute z-10 mt-1 w-32 bg-white border border-black-200 rounded transform  outline-none"
                                >
                                    {QuantityMode.map((mode) => (
                                        <Listbox.Option
                                            key={mode.id}
                                            className={({ selected, active }) => classNames(
                                                selected ? 'text-teal font-medium' : 'text-black-600',
                                                'text-sm  cursor-pointer hover:text-teal py-1 text-center hover:bg-gray-100 px-4',
                                            )}
                                            value={mode}
                                        >
                                            {({ selected, active }) => mode.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        );
    }, [quantityMode]);

    const _renderOrderQuoteQty = (_orderSide) => {
        if (orderType === ExchangeOrderEnum.Type.MARKET
            && quantityMode.id !== ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY) return null;
        return (
            <div className="flex justify-between items-center mb-3">
                <div className="form-group w-full">
                    <div className="input-group">
                        <div className="input-group-prepend px-3 flex-shrink-0 w-[80px] flex  items-center">
                            {/* {
                                orderType === ExchangeOrderEnum.Type.MARKET && orderSide === ExchangeOrderEnum.Side.BUY
                                    ? _renderQuantityMode
                                    : <div className="text-sm text-black-500 font-medium ">{t('total')}</div>
                            } */}
                            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium ">{t('total')}</div>
                        </div>
                        <NumberFormat
                            getInputRef={quoteQtyRef}
                            className="form-control form-control-sm !pr-0 !pl-2 text-right font-medium outline-none"
                            name="quoteQty"
                            onFocus={() => {
                                setFocus('quoteQty');
                            }}
                            thousandSeparator
                            decimalScale={2}
                            allowNegative={false}
                            value={_orderSide === ExchangeOrderEnum.Side.BUY ? buyQuoteQty : sellQuoteQty}
                            onChange={() => setIsUseQuoteQuantity(true)}
                            onValueChange={({ value }) => {
                                if (_orderSide === ExchangeOrderEnum.Side.BUY) {
                                    setBuyQuoteQty(value);
                                } else {
                                    setSellQuoteQty(value);
                                }
                            }}
                        />

                        <div
                            className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                        >
                            <span className="input-group-text text-txtSecondary dark:text-txtSecondary-dark">
                                {quote}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const _renderOrderQuantity = (_orderSide) => {
        return (
            <div className="flex justify-between items-center mb-3">

                <div className="form-group w-full">
                    <div className="input-group">
                        <div className="input-group-prepend px-3 flex-shrink-0 flex  items-center">
                            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium ">{t('common:amount')}</div>
                        </div>
                        <NumberFormat
                            getInputRef={quantityRef}
                            className="form-control form-control-sm !pr-0 !pl-2 text-right font-medium outline-none"
                            name="quantity"
                            onFocus={() => {
                                setFocus('quantity');
                            }}
                            thousandSeparator
                            decimalScale={getDecimalScale(+quantityFilter?.stepSize)}
                            allowNegative={false}
                            value={_orderSide === ExchangeOrderEnum.Side.BUY ? buyQuantity : sellQuantity}
                            onChange={() => setIsUseQuoteQuantity(false)}
                            onValueChange={({ value }) => {
                                if (_orderSide === ExchangeOrderEnum.Side.BUY) {
                                    setBuyQuantity(value);
                                } else {
                                    setSellQuantity(value);
                                }
                            }}
                        />

                        <div
                            className="input-group-append px-3 flex-shrink-0 flex justify-end items-center"
                        >
                            <span className="input-group-text text-txtSecondary dark:text-txtSecondary-dark">
                                {base}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const _renderPlaceOrderButton = (_orderSide) => {
        if (!user) {
            return (
                <div className="">
                    <a href={getLoginUrl('sso')} className="btn w-full capitalize button-common block text-center">
                        {t('sign_in_to_continue')}
                    </a>
                </div>
            );
        }

        return (
            <div className="">
                <button
                    onClick={() => confirmModal(_orderSide)}
                    type="button"
                    disabled={placing || currentExchangeConfig?.status === 'MAINTAIN'}
                    className={'btn btn-xs w-full capitalize disabled:bg-black-400 ' + (_orderSide === ExchangeOrderEnum.Side.BUY ? 'btn-green' : 'btn-red')}
                >{t(_orderSide)} {base}
                </button>
            </div>
        );
    };

    const _renderUserBalance = (_orderSide) => {
        return (
            <>
                <div className="mb-2 flex justify-between items-center">
                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium ">{t('spot:available_balance')}</div>
                    <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-medium text-right">
                        {
                            // eslint-disable-next-line no-nested-ternary
                            _orderSide === ExchangeOrderEnum.Side.BUY
                                ? quoteAssetId ? getAvailableText(quoteAssetId) : 0
                                : baseAssetId ? getAvailableText(baseAssetId) : 0
                        } {_orderSide === ExchangeOrderEnum.Side.BUY ? quote : base}
                    </div>
                </div>
            </>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    const _renderUserFee = useCallback((_orderSide) => {
        let feeValue = 0;
        if (currentExchangeConfig && state.feeConfig) {
            const fee = currentExchangeConfig?.feeMode === 1 ? state.feeConfig?.market_maker_promote : state.feeConfig?.normal;
            if (orderType === 'LIMIT') {
                if (currentExchangeConfig?.feeMode === 1) {
                    // @ts-ignore
                    const maker = orderSide === 'BUY' ? fee.maker?.buy : fee.maker?.sell;
                    if (
                        maker &&
                        isNumber(state?.centerPrice) &&
                        state?.centerPrice > 0 &&
                        sellPrice &&
                        isNumber(+sellPrice)
                    ) {
                        const userPrice = +sellPrice;
                        const _p =
                            (100 * (orderSide === 'BUY' ? 1 : -1) * (state.centerPrice - userPrice)) / state.centerPrice;

                        const _fees = [...maker].filter((e, index) => _p <= e.percentage || index === maker.length - 1);

                        const _fee = _fees?.[0];
                        feeValue = _fee?.fee * 100
                    }
                } else {
                    feeValue = +fee?.maker * 100;
                }
            } else if (orderType === 'MARKET') {
                feeValue = +fee?.taker * 100;
            }
        }

        // if (feeValue > 0) {
        //     return <Text style={styles.orderInfoValue}>{feeValue}%</Text>;
        // } else if (feeValue < 0) {
        //     return <Text style={[styles.orderInfoValue, {color: colors.teal}]}>+{-feeValue}%</Text>;
        // } else {
        //     return <Text style={[styles.orderInfoValue]}>---</Text>;
        // }

        return (
            <>
                <div className="mb-2 flex justify-between items-center">
                    <div className="text-xs text-black-500 font-medium ">Fee</div>
                    <div className="text-xs text-teal font-medium text-right">
                        {feeValue > 0 ? `${feeValue}%` : feeValue < 0 ? `+${-feeValue}%` : '---'}
                        {/*{*/}
                        {/*    // eslint-disable-next-line no-nested-ternary*/}
                        {/*    _orderSide === ExchangeOrderEnum.Side.BUY*/}
                        {/*        ? quoteAssetId ? getAvailableText(quoteAssetId) : 0*/}
                        {/*        : baseAssetId ? getAvailableText(baseAssetId) : 0*/}
                        {/*} {_orderSide === ExchangeOrderEnum.Side.BUY ? quote : base}*/}
                    </div>
                </div>
            </>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.centerPrice, state.feeConfig, currentExchangeConfig, orderSide, orderType, sellPrice]);

    return (
        <>
            <div className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark h-full px-2.5 spot-place-orders-container">
                {/* <h3 className="font-medium text-lg text-black pt-6 pb-4 px-1.5 dragHandleArea">{t('spot:place_order')}</h3> */}
                {/* {_renderOrderSide} */}
                {_renderOrderType}

                <div className="grid grid-cols-2 gap-5 mt-4">
                    <div className="">
                        {_renderUserBalance(ExchangeOrderEnum.Side.BUY)}
                        {_renderOrderPrice((ExchangeOrderEnum.Side.BUY))}
                        {_renderOrderQuantity((ExchangeOrderEnum.Side.BUY))}
                        {_renderQuantitySlider(ExchangeOrderEnum.Side.BUY)}
                        {_renderOrderQuoteQty((ExchangeOrderEnum.Side.BUY))}
                        {/* {_renderUserFee(ExchangeOrderEnum.Side.BUY)} */}
                        {currentExchangeConfig?.status === 'MAINTAIN' && <p className="text-sm mb-3 flex"><span className="mr-2"><IconLock width={12} height={16} /></span> <span>{t('spot:pair_under_maintenance', { base: symbol?.base, quote: symbol?.quote })}</span></p>}
                        {_renderPlaceOrderButton(ExchangeOrderEnum.Side.BUY)}
                    </div>
                    <div className="">

                        {_renderUserBalance(ExchangeOrderEnum.Side.SELL)}
                        {_renderOrderPrice((ExchangeOrderEnum.Side.SELL))}
                        {_renderOrderQuantity((ExchangeOrderEnum.Side.SELL))}
                        {_renderQuantitySlider(ExchangeOrderEnum.Side.SELL)}
                        {_renderOrderQuoteQty((ExchangeOrderEnum.Side.SELL))}
                        {/* {_renderUserFee(ExchangeOrderEnum.Side.SELL)} */}
                        {currentExchangeConfig?.status === 'MAINTAIN' && <p className="text-sm mb-3 flex"><span className="mr-2"><IconLock width={12} height={16} /></span> <span>{t('spot:pair_under_maintenance', { base: symbol?.base, quote: symbol?.quote })}</span></p>}
                        {_renderPlaceOrderButton(ExchangeOrderEnum.Side.SELL)}
                    </div>
                </div>

            </div>
        </>
    );
};

export default SimplePlaceOrderForm;
