import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import OrderVolumeMobile from './OrderVolumeMobile';
import OrderPriceMobile from './OrderPriceMobile';
import OrderTPMobile from './OrderTPMobile';
import OrderSLMobile from './OrderSLMobile';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import OrderTypeMobile from './OrderTypeMobile';
import OrderMarginMobile from './OrderMarginMobile';
import OrderButtonMobile from './OrderButtonMobile';
import { emitWebViewEvent, formatNumber, getLiquidatePrice, getSuggestSl, getSuggestTp } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import OrderCollapse from './OrderCollapse';
// import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc';
import { getPrice, getType } from 'components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { createSelector } from 'reselect';
import OrderVolumeMobileModal from './OrderVolumeMobileModal';
import SideOrder from 'components/screens/Mobile/Futures/SideOrder';
import OrderLeverage from 'components/screens/Mobile/Futures/PlaceOrder/OrderLeverage';
import { getFilter, } from 'redux/actions/utils';
// import ExpiredModal from 'components/screens/Mobile/ExpiredModal'
import { ExchangeOrderEnum, FuturesOrderEnum } from 'redux/actions/const';
import EditSLTPVndcMobile from 'components/screens/Mobile/Futures/EditSLTPVndcMobile';

const getPairPrice = createSelector(
    [
        state => state.futures,
        (state, pair) => pair
    ],
    (futures, pair) => futures.marketWatch[pair]
);

const initPercent = 10;

const PlaceOrder = ({
    decimals,
    side,
    setSide,
    pairPrice,
    pair,
    isAuth,
    availableAsset,
    pairConfig,
    isVndcFutures,
    collapse,
    onBlurInput,
    decimalSymbol
}) => {
    const lastPrice = pairPrice?.lastPrice;
    const { t } = useTranslation();
    const initPercent = 10;
    const [type, setType] = useState(OrderTypes.Market);
    const [leverage, setLeverage] = useState(50);
    const [size, setSize] = useState(0);
    const [price, setPrice] = useState(0);
    const [stopPrice, setStopPrice] = useState(0);
    const [tp, setTp] = useState('');
    const [sl, setSl] = useState('');
    const rowData = useRef(null);
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const firstTime = useRef(true);
    const context = useContext(AlertContext);
    const marketWatch = useSelector(state => getPairPrice(state, pair));
    const newDataLeverage = useRef(0);
    const [showEditVolume, setShowEditVolume] = useState(false);
    const [quoteQty, setQuoteQty] = useState(0);
    const [showExpiredModal, setShowExpiredModal] = useState(false);

    const getMaxQuoteQty = (price, type, side, leverage, availableAsset, pairPrice, pairConfig, isQuoteQty) => {
        let maxBuy = 0;
        let maxSell = 0;
        let _price = price;
        if (Math.trunc(availableAsset) > 0) {
            if ([OrderTypes.Limit, OrderTypes.StopMarket, OrderTypes.StopLimit].includes(type) && price) {
                maxBuy = availableAsset / ((1 / leverage) + (0.1 / 100)) / (isQuoteQty ? 1 : price);
                maxSell = maxBuy;
            } else if ([OrderTypes.Market].includes(type)) {
                price = side === VndcFutureOrderType.Side.BUY ? pairPrice?.ask : pairPrice?.bid;
                maxBuy = availableAsset / ((1 / leverage) + (0.1 / 100)) / (isQuoteQty ? 1 : pairPrice?.ask);
                maxSell = availableAsset / ((1 / leverage) + (0.1 / 100)) / (isQuoteQty ? 1 : pairPrice?.bid);
            }
        }
        const lotSize =
            pairConfig?.filters?.find((o) =>
                [
                    FuturesOrderTypes.Market,
                    FuturesOrderTypes.StopMarket,
                ].includes(type)
                    ? o?.filterType === 'MARKET_LOT_SIZE'
                    : o?.filterType === 'LOT_SIZE'
            ) || {};
        const _maxConfig = lotSize?.maxQty * (isQuoteQty ? price : 1); //maxConfig quoteQty
        const _maxQty = side === VndcFutureOrderType.Side.BUY ? maxBuy : maxSell;
        return isAuth ? Math.min(_maxConfig, _maxQty) : _maxConfig;
    };

    useEffect(() => {
        if (typeof window !== undefined) {
            const search = new URLSearchParams(window.location.search)
            if (search && search.get('need_login') === 'true' && context?.alert) {
                // setShowExpiredModal(true);
                context.alert.show('expired',
                    t('futures:mobile.invalid_session_title'),
                    t('futures:mobile.invalid_session_content'),
                    null,
                    () => {
                        emitWebViewEvent('login');
                    },
                    null, {
                    confirmTitle: t('futures:mobile.invalid_session_button'),
                    hideCloseButton: true
                }
                )
            }
        }
    }, [context.alert]);

    useEffect(() => {
        if (firstTime.current && (marketWatch?.lastPrice > 0 || pairPrice?.lastPrice > 0)) {
            firstTime.current = false;
        }
    }, [marketWatch, pairPrice, firstTime.current]);

    useEffect(() => {
        firstTime.current = true;
        if (!localStorage.getItem('auto_type_tp_sl')) {
            localStorage.setItem('auto_type_tp_sl', JSON.stringify({ auto: true }))
        }
    }, [pair]);

    useEffect(() => {
        if (firstTime.current) return;
        setPrice(lastPrice);
        setStopPrice(lastPrice);
    }, [pair, type]);

    useEffect(() => {
        if (firstTime.current) return;
        const _lastPrice = marketWatch?.lastPrice ?? lastPrice;
        onChangeSlTp(leverage, _lastPrice)
    }, [side, type, decimals, leverage]);


    useEffect(() => {
        if (firstTime.current) return;
        if (type === OrderTypes.Market) {
            onChangeQuoteQty(lastPrice, leverage);
        }
    }, [decimals, leverage]);

    useEffect(() => {
        if (firstTime.current) return;
        const _lastPrice = marketWatch?.lastPrice ?? lastPrice;
        setPrice(_lastPrice);
        setStopPrice(_lastPrice);
    }, [firstTime.current, decimals]);

    const onChangeQuoteQty = (price, leverage) => {
        const minQuoteQty = pairConfig?.filters.find(item => item.filterType === 'MIN_NOTIONAL')?.notional ?? 100000;
        const maxQuoteQty = getMaxQuoteQty(price, type, side, leverage, availableAsset, pairPrice, pairConfig, true);
        let _quoteQty = +Number(maxQuoteQty * (initPercent / 100))
            .toFixed(decimalSymbol);
        // let _quoteQty = minQuoteQty
        _quoteQty = _quoteQty < minQuoteQty ? minQuoteQty : _quoteQty;
        const _size = +((_quoteQty / price) * initPercent / 100);
        setSize(_size);
        setQuoteQty(_quoteQty);
    };

    const onChangeSlTp = (leverage, _lastPrice) => {
        let autoTypeInput = localStorage.getItem('auto_type_tp_sl');
        if (autoTypeInput) {
            autoTypeInput = JSON.parse(autoTypeInput)
            if (autoTypeInput.auto) {
                const _sl = +(getSuggestSl(side, _lastPrice, leverage, leverage >= 100 ? 0.9 : 0.6)).toFixed(decimals.decimalScalePrice);
                const _tp = +(getSuggestTp(side, _lastPrice, leverage, leverage >= 100 ? 0.9 : 0.6)).toFixed(decimals.decimalScalePrice);
                if (leverage <= 10) {
                    setTp('');
                    setSl('');
                } else if (leverage <= 20) {
                    setSl(_sl);
                    setTp('');
                } if (leverage > 20) {
                    setSl(_sl);
                    setTp(_tp);
                }
            }
        }
    }

    useEffect(() => {
        if (firstTime.current) return;
        if (newDataLeverage.current) {
            const _lastPrice = marketWatch?.lastPrice ?? lastPrice;
            onChangeQuoteQty(_lastPrice, newDataLeverage?.current);
            onChangeSlTp(newDataLeverage.current, _lastPrice)
        }
    }, [firstTime.current, newDataLeverage.current]);

    const getLeverage = (_leverage) => {
        newDataLeverage.current = _leverage;
    };

    const marginAndValue = useMemo(() => {
        const volume = quoteQty || 0;
        const volumeLength = +Number(volume).toFixed(0).length;
        const margin = volume / leverage;
        const marginLength = +Number(margin).toFixed(0).length;
        return {
            volume,
            margin,
            volumeLength,
            marginLength
        };
    }, [pairPrice, side, type, size, quoteQty]);

    const awaitValidator = useRef(false);
    const timerValidator = useRef(null);
    const [flag, setFlag] = useState(false);
    useEffect(() => {
        awaitValidator.current = true;
        clearTimeout(timerValidator.current)
        timerValidator.current = setTimeout(() => {
            awaitValidator.current = false;
            setFlag(!flag);
        }, 500);
        setFlag(!flag);
    }, [side])

    const inputValidator = (mode) => {
        let isValid = true;
        let msg = null;
        switch (mode) {
            case 'quoteQty':
                const _min = pairConfig?.filters.find(item => item.filterType === 'MIN_NOTIONAL')?.notional ?? 100000;
                const _decimals = 0;
                const _max = +Number(availableAsset / (1 / leverage + (0.1 / 100)))
                    .toFixed(0);
                const _displayingMax = `${formatNumber(_max, _decimals, 0, true)} ${pairConfig?.quoteAsset}`;
                const _displayingMin = `${formatNumber(_min, _decimals, 0, true)} ${pairConfig?.quoteAsset}`;
                if (quoteQty < +_min) {
                    msg = `${t('futures:minimum_qty')} ${_displayingMin} `;
                    isValid = false;
                } else if (quoteQty > +Number(_max)
                    .toFixed(_decimals)) {
                    msg = `${t('futures:maximum_qty')} ${_displayingMax}`;
                    isValid = false;
                }
                return {
                    isValid,
                    msg
                };

            case 'price':
            case 'stop_loss':
            case 'take_profit':
                // Nếu không nhập thì ko cần validate luôn, cho phép đặt lệnh không cần SL, TP
                if ((mode === 'stop_loss' && !sl)
                    || mode === 'take_profit' && !tp) {
                    return {
                        isValid,
                        msg
                    };
                }
                const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, pairConfig);
                const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, pairConfig);
                const _maxPrice = priceFilter?.maxPrice;
                const _minPrice = priceFilter?.minPrice;
                let _activePrice = marketWatch?.lastPrice ?? lastPrice;
                if (mode !== 'price') {
                    if (type === 'LIMIT') {
                        _activePrice = price
                    } else if (type === 'STOP_MARKET') {
                        _activePrice = stopPrice
                    }
                }

                // Truong hop dat lenh market
                const lowerBound = {
                    min: Math.max(_minPrice, _activePrice * percentPriceFilter?.multiplierDown),
                    max: Math.min(_activePrice, _activePrice * (1 - percentPriceFilter?.minDifferenceRatio)),
                }

                const upperBound = {
                    min: Math.max(_activePrice, _activePrice * (1 + percentPriceFilter?.minDifferenceRatio)),
                    max: Math.min(_maxPrice, _activePrice * percentPriceFilter?.multiplierUp),
                }

                let bound = lowerBound
                if (side === FuturesOrderEnum.Side.BUY) {
                    bound = mode === 'stop_loss' ? lowerBound : upperBound
                } else {
                    bound = mode === 'stop_loss' ? upperBound : lowerBound
                }

                if (mode === 'stop_loss') {
                    bound = side === FuturesOrderEnum.Side.BUY ? lowerBound : upperBound
                    // Modify bound base on type
                    if (sl < bound.min) {
                        isValid = false
                        msg = `${t('futures:minimum_price')} ${formatNumber(bound.min, decimals.decimalScalePrice, 0, true)}`;
                    } else if (sl > bound.max) {
                        isValid = false
                        msg = `${t('futures:maximum_price')} ${formatNumber(bound.max, decimals.decimalScalePrice, 0, true)}`;
                    }
                } else if (mode === 'take_profit') {
                    bound = side === FuturesOrderEnum.Side.BUY ? upperBound : lowerBound
                    if (tp < bound.min) {
                        isValid = false
                        msg = `${t('futures:minimum_price')} ${formatNumber(bound.min, decimals.decimalScalePrice, 0, true)}`;
                    } else if (tp > bound.max) {
                        isValid = false
                        msg = `${t('futures:maximum_price')} ${formatNumber(bound.max, decimals.decimalScalePrice, 0, true)}`;
                    }
                } else if (mode === 'price' && (type === 'STOP_MARKET' || type === 'LIMIT')) {
                    const _checkPrice = type === 'STOP_MARKET' ? stopPrice : price
                    if (side === FuturesOrderEnum.Side.BUY) {
                        // Truong hop la buy thi gia limit phai nho hon gia hien tai
                        if (type === 'LIMIT') {
                            if (price < lowerBound.min) {
                                isValid = false
                                msg = `${t('futures:minimum_price')} ${formatNumber(lowerBound.min, decimals.decimalScalePrice, 0, true)}`;
                            } else if (price > lowerBound.max) {
                                isValid = false
                                msg = `${t('futures:maximum_price')} ${formatNumber(lowerBound.max, decimals.decimalScalePrice, 0, true)}`;
                            }
                        } else if (type === 'STOP_MARKET') {
                            if (stopPrice < upperBound.min) {
                                isValid = false
                                msg = `${t('futures:minimum_price')} ${formatNumber(upperBound.min, decimals.decimalScalePrice, 0, true)}`;
                            } else if (stopPrice > upperBound.max) {
                                isValid = false
                                msg = `${t('futures:maximum_price')} ${formatNumber(upperBound.max, decimals.decimalScalePrice, 0, true)}`;
                            }
                        }
                    } else if (side === FuturesOrderEnum.Side.SELL) {
                        if (type === 'LIMIT') {
                            if (price < upperBound.min) {
                                isValid = false
                                msg = `${t('futures:minimum_price')} ${formatNumber(upperBound.min, decimals.decimalScalePrice, 0, true)}`;
                            } else if (price > upperBound.max) {
                                isValid = false
                                msg = `${t('futures:maximum_price')} ${formatNumber(upperBound.max, decimals.decimalScalePrice, 0, true)}`;
                            }
                        } else if (type === 'STOP_MARKET') {
                            if (stopPrice < lowerBound.min) {
                                isValid = false
                                msg = `${t('futures:minimum_price')} ${formatNumber(lowerBound.min, decimals.decimalScalePrice, 0, true)}`;
                            } else if (stopPrice > lowerBound.max) {
                                isValid = false
                                msg = `${t('futures:maximum_price')} ${formatNumber(lowerBound.max, decimals.decimalScalePrice, 0, true)}`;
                            }
                        }
                    }
                }

                if (mode === 'stop_loss' && isValid) {
                    //  Kiểm tra hợp lệ giá liquidate không
                    // const size = size
                    const liquidatePrice = getLiquidatePrice({ quantity: size, side, quoteQty, leverage }, _activePrice)
                    const bias = 0.1 / 100
                    const liquidatePriceBound = {
                        upper: liquidatePrice * (1 - bias),
                        lower: liquidatePrice * (1 + bias)
                    }
                    if (side === VndcFutureOrderType.Side.SELL && sl > liquidatePriceBound.upper) {
                        isValid = false
                        msg = `${t('futures:liquidate_alert_less')} ${formatNumber(liquidatePriceBound.upper, decimals.decimalScalePrice, 0, true)}`;
                    } else if (side === VndcFutureOrderType.Side.BUY && sl < liquidatePriceBound.lower) {
                        isValid = false
                        msg = `${t('futures:liquidate_alert_greater')} ${formatNumber(liquidatePriceBound.lower, decimals.decimalScalePrice, 0, true)}`;
                    }
                }

                return {
                    isValid,
                    msg
                };
            case 'leverage':
                const min = pairConfig?.leverageConfig?.min ?? 0;
                const max = pairConfig?.leverageConfig?.max ?? 0;
                if (min > leverage) {
                    msg = `${t('futures:minimum_leverage')} ${_displayingMin} `;
                    isValid = false;
                }
                if (max < leverage) {
                    msg = `${t('futures:maximum_leverage')} ${_displayingMax}`;
                    isValid = false;
                }
                return {
                    isValid,
                    msg,
                    isError: !isValid
                };
            default:
                return {};
        }
    };

    const isError = useMemo(() => {
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit];
        const not_valid = collapse ? (!inputValidator('quoteQty').isValid || !inputValidator('leverage').isValid) :
            (!inputValidator('price', ArrStop.includes(type)).isValid || !inputValidator('stop_loss').isValid || !inputValidator('take_profit').isValid ||
                !inputValidator('quoteQty').isValid || !inputValidator('leverage').isValid);
        return not_valid;
    }, [price, size, type, stopPrice, sl, tp, isVndcFutures, leverage, quoteQty, collapse]);

    const canShowChangeTpSL = useMemo(() => {
        if (!isAuth) return false
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit];
        if (!inputValidator('price', ArrStop.includes(type)).isValid ||
            !inputValidator('quoteQty').isValid) {
            return false
        }
        return true
    }, [isAuth, type, pairConfig, price, side, leverage, availableAsset, pairPrice]);

    const onChangeTpSL = () => {
        if (!isAuth) return;
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit];
        if (!inputValidator('price', ArrStop.includes(type)).isValid ||
            !inputValidator('quoteQty').isValid) {
            const minQuoteQty = pairConfig?.filters.find(item => item.filterType === 'MIN_NOTIONAL')?.notional ?? 100000;
            const maxQuoteQty = getMaxQuoteQty(price, type, side, leverage, availableAsset, pairPrice, pairConfig, true);
            const available = maxQuoteQty >= minQuoteQty;
            context.alert.show('error', t('futures:invalid_amount'), available ? t('futures:invalid_amount_price') : t('futures:mobile:balance_insufficient'));
            return;
        }
        onBlurInput();
        const _price = getPrice(getType(type), side, price, pairPrice?.ask, pairPrice?.bid, stopPrice);
        rowData.current = {
            fee: 0,
            quantity: size,
            status: 0,
            price: _price,
            quoteAsset: pairConfig?.quoteAsset,
            symbol: pairConfig?.symbol,
            sl: sl ? +Number(sl).toFixed(decimals?.decimalScalePrice ?? 0) : 0,
            tp: tp ? +Number(tp).toFixed(decimals?.decimalScalePrice ?? 0) : 0,
            leverage,
            side,
        };
        setShowEditSLTP(true);
    };

    const onConfirmSLTP = (data) => {
        setSl(data.sl || '');
        setTp(data.tp || '');
        setShowEditSLTP(false);
    };

    const onConfirmEditVolume = (quoteQty) => {
        const _price = type === FuturesOrderTypes.Market ?
            (VndcFutureOrderType.Side.BUY === side ? pairPrice?.ask : pairPrice?.bid) :
            price;
        const _size = (quoteQty / _price)
        setSize(+_size);
        setQuoteQty(quoteQty);
        setShowEditVolume(false);
    };
    return (
        <>

            <div className="flex flex-wrap justify-between px-[16px] py-[10px] relative z-10 bg-onus">
                {/* {showExpiredModal && <ExpiredModal onClose={() => setShowExpiredModal(false)} />} */}
                {showEditSLTP &&
                    <EditSLTPVndcMobile
                        onusMode={true}
                        isVisible={showEditSLTP}
                        order={rowData.current}
                        onClose={() => setShowEditSLTP(false)}
                        status={rowData.current.status}
                        onConfirm={onConfirmSLTP}
                        lastPrice={lastPrice}
                        isMobile
                    />
                }
                {collapse &&
                    <OrderCollapse
                        side={side} pairPrice={pairPrice} type={type} size={size}
                        price={price} stopPrice={stopPrice} pairConfig={pairConfig}
                        decimals={decimals} leverage={leverage} isAuth={isAuth}
                        marginAndValue={marginAndValue} availableAsset={availableAsset}
                        quoteQty={quoteQty} isError={isError}
                    />
                }
                <div className={collapse ? 'hidden' : 'w-full flex flex-wrap justify-between'}>
                    <OrderInput>
                        <div className="flex flex-row justify-between">
                            <OrderTypeMobile type={type} setType={setType}
                                orderTypes={pairConfig?.orderTypes} isVndcFutures={isVndcFutures} />

                            <OrderLeverage
                                leverage={leverage} setLeverage={setLeverage}
                                isAuth={isAuth} pair={pair}
                                pairConfig={pairConfig}
                                inputValidator={inputValidator}
                                context={context}
                                getLeverage={getLeverage}
                            />
                        </div>

                    </OrderInput>
                    {!collapse &&
                        <OrderInput>
                            <SideOrder side={side} setSide={setSide} />
                        </OrderInput>
                    }
                    <OrderInput data-tut="order-volume">
                        {showEditVolume && <OrderVolumeMobileModal
                            size={size}
                            decimal={decimalSymbol}
                            onClose={() => setShowEditVolume(false)}
                            onConfirm={onConfirmEditVolume}
                            pairConfig={pairConfig}
                            type={type}
                            side={side}
                            quoteQty={quoteQty}
                            price={price}
                            pairPrice={pairPrice}
                            leverage={leverage}
                            availableAsset={availableAsset}
                            getMaxQuoteQty={getMaxQuoteQty}
                        />}
                        <OrderVolumeMobile
                            size={size} setSize={setSize} decimal={decimalSymbol}
                            context={context}
                            pairConfig={pairConfig}
                            quoteQty={quoteQty}
                            setShowEditVolume={setShowEditVolume}
                        />
                    </OrderInput>
                    <OrderInput>
                        <OrderPriceMobile
                            onusMode={true}
                            validator={inputValidator('price')}
                            type={type}
                            price={price} setPrice={setPrice} decimals={decimals}
                            context={context} stopPrice={stopPrice} setStopPrice={setStopPrice}
                            pairConfig={pairConfig}
                        />
                    </OrderInput>
                    <OrderInput data-tut="order-sl">
                        <OrderSLMobile
                            validator={!awaitValidator.current && inputValidator('stop_loss')}
                            sl={sl} setSl={setSl} decimals={decimals}
                            show={canShowChangeTpSL}
                            onChangeTpSL={onChangeTpSL} context={context}
                            isAuth={isAuth}
                        />
                    </OrderInput>
                    <OrderInput data-tut="order-tp">
                        <OrderTPMobile
                            validator={!awaitValidator.current && inputValidator('take_profit')}
                            show={canShowChangeTpSL}
                            tp={tp} setTp={setTp} decimals={decimals}
                            onChangeTpSL={onChangeTpSL} context={context}
                            isAuth={isAuth}
                        />
                    </OrderInput>
                    <OrderInput>
                        <OrderMarginMobile marginAndValue={marginAndValue} pairConfig={pairConfig}
                            availableAsset={availableAsset} decimal={decimalSymbol} />
                    </OrderInput>
                    <OrderInput data-tut="order-button">
                        <OrderButtonMobile
                            tp={tp} sl={sl} type={type} size={size} price={price}
                            stopPrice={stopPrice} side={side} decimals={decimals}
                            pairConfig={pairConfig} pairPrice={pairPrice}
                            leverage={leverage} isAuth={isAuth} isError={isError}
                            quoteQty={quoteQty} decimalSymbol={decimalSymbol}
                        />
                    </OrderInput>
                </div>
            </div>
        </>
    );
};

const OrderInput = styled.div`
  width: calc(50% - 8px);
  margin-bottom: 8px
`;

export default PlaceOrder;
