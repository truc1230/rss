/* eslint-disable react-hooks/exhaustive-deps */
import { IconLock } from 'src/components/common/Icons';
import ceil from 'lodash/ceil';
import defaults from 'lodash/defaults';
import find from 'lodash/find';
import floor from 'lodash/floor';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { useAsync, useDebounce } from 'react-use';
import { getMarketWatch } from 'redux/actions/market';
import InputSlider from 'src/components/trade/InputSlider';
import * as Error from 'src/redux/actions/apiError';
import { ApiStatus, EPS, ExchangeOrderEnum, PublicSocketEvent, } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import {
    formatBalance,
    formatPrice,
    formatWallet,
    getDecimalScale,
    getFilter,
    getLoginUrl,
    getSymbolString,
} from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import showNotification from 'utils/notificationService';

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

const PlaceOrderForm = ({ symbol }) => {
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

    const user = useSelector((state) => state.auth.user) || null;
    const balanceSpot = useSelector((state) => state.wallet.SPOT);
    const selectedOrder = useSelector((state) => state.spot?.selectedOrder);
    const [open, setOpen] = useState(false);
    const [quantityMode, setQuantityMode] = useState(QuantityMode[0]);
    const [percentage, setPercentage] = useState(0);
    const [placing, setPlacing] = useState(false);
    const [orderSide, setOrderSide] = useState(ExchangeOrderEnum.Side.BUY);
    const [orderType, setOrderType] = useState(ExchangeOrderEnum.Type.MARKET);
    const [quantity, setQuantity] = useState(0);
    const [quoteQty, setQuoteQty] = useState(0);
    const [focus, setFocus] = useState();
    const [price, setPrice] = useState();
    const [symbolTicker, setSymbolTicker] = useState(null);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const quoteAsset = useSelector((state) => state.user.quoteAsset) || 'USDT';
    const router = useRouter();
    const [isUseQuoteQuantity, setIsUseQuoteQuantity] = useState(false);

    useAsync(async () => {
        if (symbol) {
            setMultiValue(symbol?.quote === 'VNDC' ? 24000 : 1);
            const newSymbolTicker = await getMarketWatch(
                getSymbolString(symbol),
            );
            setSymbolTicker(newSymbolTicker?.[0]);
        }
    }, [symbol]);

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
            setPrice(+symbolTicker?.p);
            setQuantity(0);
            setQuoteQty(0);
            setPercentage(0);
        }
    }, [symbolTicker]);

    useEffect(() => {
        if (selectedOrder?.price) setPrice(selectedOrder?.price);
        if (selectedOrder?.quantity) setQuantity(selectedOrder?.quantity);
        if (selectedOrder?.quantity && selectedOrder?.price) {
            setQuoteQty(
                floor(selectedOrder?.quantity * selectedOrder?.price, 2),
            );
        }
    }, [selectedOrder]);

    const currentExchangeConfig = exchangeConfig.find(
        (e) => e.symbol === getSymbolString(symbol),
    );
    const priceFilter = getFilter(
        ExchangeOrderEnum.Filter.PRICE_FILTER,
        currentExchangeConfig || [],
    );
    const quantityFilter = getFilter(
        ExchangeOrderEnum.Filter.LOT_SIZE,
        currentExchangeConfig || [],
    );
    const minNotionalFilter = getFilter(
        ExchangeOrderEnum.Filter.MIN_NOTIONAL,
        currentExchangeConfig || [],
    );
    // const quoteAssetPrecision = currentExchangeConfig?.quoteAssetPrecision || 6;
    // const baseAssetPrecision = currentExchangeConfig?.baseAssetPrecision || 6;
    const baseAssetId = currentExchangeConfig?.baseAssetId || 0;
    const quoteAssetId = currentExchangeConfig?.quoteAssetId || 0;

    const handleClickTab = (side) => {
        setOrderSide(side);
        if (side === ExchangeOrderEnum.Side.SELL) {
            setQuantityMode(QuantityMode[1]);
        }
        // setIsUseQuoteQuantity(false);
        // setOrderType(ExchangeOrderEnum.Type.LIMIT);
    };
    const handleClickSubTab = (tab) => {
        setOrderType(tab);
        setQuantityMode(QuantityMode[1]);
        // setIsUseQuoteQuantity(false);
    };

    const subTabs = [
        ExchangeOrderEnum.Type.MARKET,
        ExchangeOrderEnum.Type.LIMIT,
    ];

    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };

    const filterOrderInputApi = (input = {}) => {
        const success = null;
        const { stopPrice, type, useQuoteQty } = defaults(input, {
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
                        const { minPrice, maxPrice } = filter;
                        if ([ExchangeOrderEnum.Type.LIMIT].includes(type)) {
                            if (price < +minPrice || price > +maxPrice) {
                                return Error.PRICE_FILTER;
                            }
                        }
                        if (
                            [ExchangeOrderEnum.Type.STOP_LIMIT].includes(type)
                        ) {
                            if (stopPrice < minPrice || stopPrice > maxPrice) {
                                return Error.PRICE_FILTER;
                            }
                        }
                        break;
                    }
                    case ExchangeOrderEnum.Filter.LOT_SIZE: {
                        if (useQuoteQty && +quoteQty > 0) break;
                        const { minQty, maxQty } = filter;
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

    const createOrder = async () => {
        // Filter input
        try {
            const params = {
                symbol: `${base}${quote}`,
                side: orderSide,
                type: orderType,
                quantity: +quantity,
                quoteOrderQty: +quoteQty,
                price: +price,
                useQuoteQty: isUseQuoteQuantity,
            };
            // console.log(orderType, quantityMode.id, ExchangeOrderEnum.Type.MARKET, ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY);

            // if (orderType === ExchangeOrderEnum.Type.MARKET && quantityMode.id === ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY) {
            //     params.useQuoteQty = true;
            // }
            const filterResult = filterOrderInputApi(params);
            if (filterResult) {
                const { code, message } = filterResult;
                showNotification(
                    {
                        message: `(${code}) ${t(`error:${message}`)}`,
                        title: 'Error',
                        type: 'failure',
                    },
                    2500,
                    'bottom',
                    'bottom-right',
                );
                return;
            }

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
                    executedQty,
                    executedQuoteQty,
                    price: _price,
                    quantity: _quantity,
                    quoteAsset,
                    side,
                    type,
                } = data;
                let message = '';
                if (type === ExchangeOrderEnum.Type.MARKET) {
                    message = t('spot:place_success_market', {
                        displayingId,
                        side,
                        type,
                        token: `${baseAsset}/${quoteAsset}`,
                    });
                } else {
                    message = t('spot:place_success_limit', {
                        displayingId,
                        side,
                        type,
                        token: `${baseAsset}/${quoteAsset}`,
                    });
                }
                showNotification(
                    { message, title: t('common:success'), type: 'success' },
                    2500,
                    'bottom',
                    'bottom-right',
                );
            } else {
                const error = find(Error, { code: res?.code });
                const { requestId } = data;
                let shortRequestId = null;
                let content = null;
                if (typeof requestId === 'string' && requestId?.length > 0) {
                    shortRequestId = requestId.split('-')[0].toUpperCase();
                    content = error
                        ? t(`error:${error.message}`) +
                          ` (Code: ${shortRequestId})`
                        : t('error:ERROR_COMMON') +
                          ` (Code: ${shortRequestId})`;
                } else {
                    content = error
                        ? t(`error:${error.message}`)
                        : t('error:ERROR_COMMON');
                }
                switch (message) {
                    case ExchangeOrderEnum.Filter.MIN_NOTIONAL:
                        content = t('error:MIN_NOTIONAL', {
                            value: `${formatPrice(
                                minNotionalFilter.minNotional,
                            )} ${quote}`,
                        });
                        break;
                    default:
                        break;
                }

                showNotification(
                    {
                        message: content,
                        title: t('common:failure'),
                        type: 'warning',
                    },
                    2500,
                    'bottom',
                    'bottom-right',
                );
            }
        } catch (e) {
            // console.log('createOrder web: ', e);
        } finally {
            setPlacing(false);
            closeModal();
        }
    };

    const orderTypeLabels = {
        [ExchangeOrderEnum.Type.LIMIT]: t('spot:limit'),
        [ExchangeOrderEnum.Type.MARKET]: t('spot:market'),
    };

    const confirmModal = async () => {
        setPlacing(true);
        await createOrder();
    };

    const getAvailableText = (assetId) => {
        return formatBalance(
            balanceSpot?.[assetId]?.value -
                balanceSpot?.[assetId]?.locked_value,
            6,
        );
    };

    const getAvailable = (assetId) => {
        return (
            balanceSpot?.[assetId]?.value - balanceSpot?.[assetId]?.locked_value
        );
    };

    const getBalance = (assetId) => {
        return balanceSpot?.[assetId]?.value;
    };

    useDebounce(
        () => {
            if (focus !== 'percentage') return;
            if (!(baseAssetId && quoteAssetId)) return;
            const available = orderSide === ExchangeOrderEnum.Side.BUY
                    ? getAvailable(quoteAssetId)
                    : getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +price;


            if (orderSide === ExchangeOrderEnum.Side.BUY) {
                if (orderType === ExchangeOrderEnum.Type.MARKET) {
                    _price = +symbolTicker?.p ;
                }

                const nextQuoteQty = floor(
                    ((available * percentage) / 100),
                    2,
                );
                const nextQuantity = floor(nextQuoteQty / _price, qtyDecimal);
                setQuantity(nextQuantity);
                setQuoteQty(nextQuoteQty);
            } else {
                const nextQuantity = floor(
                    (available * percentage) / 100,
                    qtyDecimal,
                );
                const nextQuoteQty = floor(nextQuantity * _price, 2);
                setQuantity(nextQuantity);
                setQuoteQty(nextQuoteQty);
            }
        },
        100,
        [orderSide, orderType, quantityMode, percentage],
    );
    useDebounce(
        () => {
            if (focus !== 'price') return; // Mac dinh la limit
            if (!(baseAssetId && quoteAssetId)) return;
            const available =
                orderSide === ExchangeOrderEnum.Side.BUY
                    ? getAvailable(quoteAssetId)
                    : getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            const _price = +price;
            const _quantity = +quantity;
            const _quoteQty = +quoteQty;

            const nextQuoteQty = floor(
                _quantity *
                    _price,
                2,
            );
            setQuoteQty(nextQuoteQty);
            if (orderSide === ExchangeOrderEnum.Side.BUY) {
                const nextPercentage = ceil(nextQuoteQty / available, 0);
                setPercentage(nextPercentage);
            }

            // setDebouncedValue(queryFilter);
        },
        100,
        [orderSide, orderType, quantityMode, price],
    );
    useDebounce(
        () => {
            if (focus !== 'quantity') return;
            if (!(baseAssetId && quoteAssetId)) return;

            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +price;
            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p ;
            }
            const _quantity = +quantity;
            const _quoteQty = +quoteQty;

            const nextQuoteQty = floor(
                _quantity *
                    _price,
                2,
            );
            setQuoteQty(nextQuoteQty);
            const available =
                orderSide === ExchangeOrderEnum.Side.BUY
                    ? getAvailable(quoteAssetId)
                    : getAvailable(baseAssetId);

            if (!(available > EPS)) return;
            let nextPercentage = 0;
            if (orderSide === ExchangeOrderEnum.Side.SELL) {
                nextPercentage = ceil((_quantity / available) * 100, 0);
            } else {
                nextPercentage = ceil((nextQuoteQty / available) * 100, 0);
            }
            setPercentage(Math.min(nextPercentage, 100));
        },
        100,
        [orderSide, orderType, quantityMode, quantity],
    );
    useDebounce(
        () => {

            if (focus !== 'quoteQty') return;
            if (!(baseAssetId && quoteAssetId)) return;

            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +price;
            const _quantity = +quantity;
            const _quoteQty = +quoteQty;


            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p;
            }

            const nextQuantity = floor(
                (_quoteQty / _price),
                qtyDecimal,
            );

            setQuantity(nextQuantity);
            let nextPercentage = 0;

            const available =
                orderSide === ExchangeOrderEnum.Side.BUY
                    ? getAvailable(quoteAssetId)
                    : getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            if (orderSide === ExchangeOrderEnum.Side.SELL) {
                nextPercentage = ceil((nextQuantity / available) * 100, 0);
            } else {
                nextPercentage = ceil((_quoteQty / available) * 100, 0);
            }
            setPercentage(Math.min(nextPercentage, 100));

            // setDebouncedValue(queryFilter);
        },
        100,
        [orderSide, orderType, quantityMode, quoteQty],
    );

    const _renderOrderSide = useMemo(() => {
        return (
            <div className="spot-place-orders-tabs mb-4">
                <div
                    className={
                        'spot-place-orders-tab bg-bgInput dark:bg-bgInput-dark capitalize text-txtSecondary dark:text-txtSecondary-dark block--left' +
                        (orderSide === ExchangeOrderEnum.Side.BUY
                            ? ' active'
                            : '')
                    }
                    onClick={() => handleClickTab(ExchangeOrderEnum.Side.BUY)}
                >
                    {t('common:buy')}
                </div>
                <svg
                    className={`spot-place-orders-tab bg-bgInput dark:bg-bgInput-dark arrow  ${
                        orderSide === ExchangeOrderEnum.Side.SELL
                            ? 'sell'
                            : 'buy'
                    }`}
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    fill="none"
                >
                    <path fill={orderSide === ExchangeOrderEnum.Side.SELL ? '#E5544B' : '#00C8BC'} d="M32 0L18.1569 0C17.096 0 16.0786 0.421427 15.3284 1.17157L3.32842 13.1716C1.76633 14.7337 1.76633 17.2663 3.32843 18.8284L15.3284 30.8284C16.0786 31.5786 17.096 32 18.1569 32H32V0Z" />
                </svg>
                <div
                    className={
                        'spot-place-orders-tab bg-bgInput dark:bg-bgInput-dark capitalize text-txtSecondary dark:text-txtSecondary-dark block--right' +
                        (orderSide === ExchangeOrderEnum.Side.SELL
                            ? ' active'
                            : '')
                    }
                    onClick={() => handleClickTab(ExchangeOrderEnum.Side.SELL)}
                >
                    {t('common:sell')}
                </div>
            </div>
        );
    }, [orderSide, t]);

    const _renderOrderType = useMemo(() => {
        const tabs = [];
        // subTabs.forEach(tab => {
        //     if (currentExchangeConfig?.orderTypes
        //     && currentExchangeConfig?.orderTypes.includes(tab)
        //     ) {
        //         tabs.push(tab);
        //     }
        // });

        subTabs.forEach(tab => {
            tabs.push(tab);
        });

        return (
            <ul className="tabs justify-start mb-4">
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

    const _renderOrderPrice = () => {
        // if (orderType !== ExchangeOrderEnum.Type.LIMIT) return null;
        return (
            <div className="flex justify-between items-center mb-2">
                <div className="form-group w-full">
                    <div className="input-group">
                        <div className="input-group-prepend px-3 flex-shrink-0 w-[80px] flex  items-center">
                            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium">
                                {t('common:price')}
                            </div>
                        </div>

                        {orderType === ExchangeOrderEnum.Type.LIMIT && (
                            <NumberFormat
                                getInputRef={priceRef}
                                className="form-control form-control-sm !pr-0 !pl-2 text-right font-medium outline-none"
                                name="stop_buy_input"
                                thousandSeparator
                                onFocus={() => {
                                    setFocus('price');
                                }}
                                decimalScale={getDecimalScale(
                                    +priceFilter?.tickSize,
                                )}
                                allowNegative={false}
                                value={price}
                                onValueChange={({ value }) => {
                                    setPrice(value);
                                }}
                            />
                        )}
                        {orderType === ExchangeOrderEnum.Type.MARKET && (
                            <input
                                className="form-control form-control-sm !pr-0 !pl-2 text-right font-medium"
                                name="stop_buy_input"
                                type="text"
                                disabled
                                value={t('spot:market')}
                            />
                        )}
                        <div className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center">
                            <span className="input-group-text text-txtSecondary dark:text-txtSecondary-dark">
                                {quote}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const _renderQuantitySlider = useMemo(() => {
        return (
            <div className="mt-6 mb-4 relative">
                <InputSlider
                    axis="x"
                    x={percentage}
                    onDragStart={() => {
                        setFocus('percentage');
                        quantityRef?.current?.blur();
                        priceRef?.current?.blur();
                        quoteQtyRef?.current?.blur();
                    }}
                    onChange={({ x }) => {
                        // if (orderSide === ExchangeOrderEnum.Side.BUY) {
                        //     setIsUseQuoteQuantity(true);
                        // } else {
                        //     setIsUseQuoteQuantity(false);
                        // }
                        setPercentage(x);
                    }}
                />
            </div>
        );
    }, [percentage, orderSide]);

    const _renderOrderQuoteQty = useMemo(() => {
        if (
            orderType === ExchangeOrderEnum.Type.MARKET &&
            quantityMode.id !== ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY
        ) { return null; }
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
                            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium ">
                                {t('total')}
                            </div>
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
                            value={quoteQty}
                            // onChange={() => setIsUseQuoteQuantity(true)}
                            onValueChange={({ value }) => setQuoteQty(value)}
                        />

                        <div className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center">
                            <span className="input-group-text text-txtSecondary dark:text-txtSecondary-dark">
                                {quote}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [price, orderType, symbol, t, quoteQty, quantityMode]);

    const _renderOrderQuantity = useMemo(() => {
        return (
            <div className="flex justify-between items-center mb-3">
                <div className="form-group w-full">
                    <div className="input-group">
                        <div className="input-group-prepend px-3 flex-shrink-0 flex  items-center">
                            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium ">
                                {t('common:amount')}
                            </div>
                        </div>
                        <NumberFormat
                            getInputRef={quantityRef}
                            className="form-control form-control-sm !pr-0 !pl-2 text-right font-medium outline-none"
                            name="quantity"
                            onFocus={() => {
                                setFocus('quantity');
                            }}
                            thousandSeparator
                            decimalScale={getDecimalScale(
                                +quantityFilter?.stepSize,
                            )}
                            allowNegative={false}
                            value={quantity}
                            // onChange={() => setIsUseQuoteQuantity(false)}
                            onValueChange={({ value }) => setQuantity(value)}
                        />

                        <div className="input-group-append px-3 flex-shrink-0 flex justify-end items-center">
                            <span className="input-group-text text-txtSecondary dark:text-txtSecondary-dark">
                                {base}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [quantity, symbol, quantityMode, orderSide, orderType]);

    const _renderOrderValue = useMemo(() => {
        return <>{formatWallet(price * quantity)}</>;
    }, [price, quantity, symbol]);

    const _renderPlaceOrderButton = () => {
        if (!user) {
            return (
                <div className="mt-6">
                    <a
                        href={getLoginUrl('sso')}
                        className="btn w-full capitalize button-common block text-center"
                    >
                        {t('sign_in_to_continue')}
                    </a>
                </div>
            );
        }

        return (
            <div className="mt-6">
                <button
                    // onClick={() => (orderType === ExchangeOrderEnum.Type.LIMIT ? openModal() : (needConfirm === 'true' ? openModal() : confirmModal()))}
                    onClick={confirmModal}
                    type="button"
                    disabled={
                        placing || currentExchangeConfig?.status === 'MAINTAIN'
                    }
                    className={
                        'btn w-full capitalize disabled:bg-black-400 ' +
                        (orderSide === ExchangeOrderEnum.Side.BUY
                            ? 'btn-green'
                            : 'btn-red')
                    }
                >
                    {t(orderSide)} {base}
                </button>
            </div>
        );
    };

    const _renderUserBalance = () => {
        return (
            <>
                <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark ">
                        {t('spot:available_balance')}
                    </div>
                    <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-semibold text-right">
                        {
                            // eslint-disable-next-line no-nested-ternary
                            orderSide === ExchangeOrderEnum.Side.BUY
                                ? quoteAssetId
                                    ? getAvailableText(quoteAssetId)
                                    : 0
                                : baseAssetId
                                    ? getAvailableText(baseAssetId)
                                    : 0
                        }{' '}
                        {orderSide === ExchangeOrderEnum.Side.BUY
                            ? quote
                            : base}
                    </div>
                </div>
            </>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    return (
        <>
            <div className="px-2.5 spot-place-orders-container rounded">
                <h3 className="font-semibold text-sm text-txtPrimary dark:text-txtPrimary-dark  my-4 dragHandleArea">
                    {t('spot:place_order')}
                </h3>
                {_renderOrderSide}
                {_renderOrderType}

                <div className="tab-content">
                    {_renderOrderPrice()}
                    {_renderOrderQuantity}
                    {_renderQuantitySlider}
                    {_renderOrderQuoteQty}
                    {currentExchangeConfig?.status === 'MAINTAIN' && (
                        <p className="text-sm mb-3 flex">
                            <span className="mr-2">
                                <IconLock width={12} height={16} />
                            </span>{' '}
                            <span>
                                {t('spot:pair_under_maintenance', {
                                    base: symbol?.base,
                                    quote: symbol?.quote,
                                })}
                            </span>
                        </p>
                    )}
                    {_renderUserBalance()}
                    {_renderPlaceOrderButton()}
                </div>

                {/* {_renderAssetPortfolio()} */}
            </div>
        </>
    );
};

export default PlaceOrderForm;
