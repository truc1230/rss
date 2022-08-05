import React, { useContext, useMemo, useRef, useState } from 'react';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useTranslation } from 'next-i18next';
import { emitWebViewEvent, formatNumber } from 'redux/actions/utils';
import { FuturesOrderTypes, FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures';
import { getPrice, getType } from 'components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc';
import { placeFuturesOrder, reFetchOrderListInterval } from 'redux/actions/futures';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { useDispatch } from 'react-redux';
import OrderConfirm from 'components/screens/Mobile/Futures/PlaceOrder/OrderConfirm';

const OrderButtonMobile = ({
    side,
    price,
    size,
    stopPrice,
    type,
    decimals,
    pairConfig,
    pairPrice,
    leverage,
    sl,
    tp,
    isAuth,
    isError,
    quoteQty,
    decimalSymbol = 0
}) => {
    const context = useContext(AlertContext);
    const [disabled, setDisabled] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isBuy = VndcFutureOrderType.Side.BUY === side;
    const _price = getPrice(getType(type), side, price, pairPrice?.ask, pairPrice?.bid, stopPrice);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const rowData = useRef(null);

    const getTypesLabel = (type) => {
        switch (type) {
            case OrderTypes.Limit:
                return t('trade:order_types.limit');
            case OrderTypes.StopLimit:
                return t('trade:order_types.stop_limit');
            case OrderTypes.Market:
                return t('trade:order_types.market');
            case OrderTypes.StopMarket:
                return t('trade:order_types.stop_market');
            case OrderTypes.TrailingStopMarket:
                return t('trade:order_types.trailing_stop');
            default:
                return '--';
        }
    };

    const handlePlaceOrder = async () => {
        const requestId = Math.floor(Date.now() / 2000);
        setDisabled(true);
        const params = {
            symbol: pairConfig?.symbol,
            type: getType(type),
            side: side,
            quantity: size,
            price: _price,
            leverage,
            sl: sl,
            tp: tp,
            quoteQty,
            useQuoteQty: true,
            requestId
        };
        placeFuturesOrder(params, { alert: context?.alert }, t, () => {
            setTimeout(() => {
                setDisabled(false);
            }, 1000);
            setShowConfirmModal(false);
            dispatch(reFetchOrderListInterval(2, 5000));
        });
    };

    const onHandleSave = () => {
        if (!isAuth) {
            emitWebViewEvent('login');
            return;
        }
        if (isError) return;
        if (!isShowConfirm) {
            rowData.current = {
                baseAsset: pairConfig?.baseAsset,
                quoteAsset: pairConfig?.quoteAsset,
                symbol: pairConfig?.symbol,
                type: getType(type),
                side: side,
                quantity: size,
                price: _price,
                leverage,
                sl: sl,
                tp: tp,
                quoteQty,
            };
            setShowConfirmModal(true);
        } else {
            handlePlaceOrder();
        }

        //     const typeHtml = `<span class="${isBuy ? 'text-onus-green' : 'text-onus-red'}">
        //                         ${isBuy ? t('futures:buy') : t('futures:sell')} ${getTypesLabel(type)}
        //                         </span>`

        //     let priceFormatted = formatNumber(_price, decimals.decimalScalePrice, 0, true)

        //     let msg = t('futures:mobile:confirm_order_message', {
        //         type: typeHtml,
        //         price: priceFormatted,
        //         symbol: pairConfig?.symbol,
        //     }
        // )
        //     if (type.includes('MARKET')) {
        //         msg = t('futures:mobile:confirm_order_message_market', {
        //             type: typeHtml,
        //             price: priceFormatted,
        //             symbol: pairConfig?.symbol,
        //         }
        //     )
        //     }

        //     alertContext.alert.show('success',
        //         t('futures:preferences:order_confirm'),
        //         msg, '',
        //         handlePlaceOrder
        //     )
    };

    const classNameError = disabled || (isAuth && isError) ? 'opacity-[0.3] cursor-not-allowed' : '';
    const title = type === FuturesOrderTypes.Limit ? t('futures:mobile:limit') : type === FuturesOrderTypes.StopMarket ? 'stop market' : type === FuturesOrderTypes.StopLimit ? 'stop limit' : '';

    const isShowConfirm = useMemo(() => {
        if (typeof window === 'undefined') return false;
        let isShowConfirm = localStorage.getItem('show_order_confirm');
        if (isShowConfirm) {
            isShowConfirm = JSON.parse(isShowConfirm);
            return isShowConfirm.hidden;
        }
        return false;
    }, [showConfirmModal]);

    return (
        <>
            {showConfirmModal &&
                <OrderConfirm disabled={disabled} isShowConfirm={isShowConfirm} open={showConfirmModal}
                    data={rowData.current} decimals={decimals}
                    onConfirm={handlePlaceOrder} decimalSymbol={decimalSymbol}
                    onClose={() => !disabled && setShowConfirmModal(false)} />
            }
            <div onClick={onHandleSave}
                className={`${isBuy ? 'bg-onus-green' : 'bg-onus-red'} text-white text-sm h-[56px] rounded-[6px] flex flex-col items-center justify-center ${classNameError}`}>
                <div
                    className="font-semibold text-center">{!isAuth ? t('futures:mobile:login_short') : (isBuy ? t('common:buy') : t('common:sell')) + ' ' + title}</div>
                <div
                    className="font-medium break-all text-center">{formatNumber(_price, decimals.decimalScalePrice, 0, true)}</div>

            </div>
        </>
    );
};

export default OrderButtonMobile;
