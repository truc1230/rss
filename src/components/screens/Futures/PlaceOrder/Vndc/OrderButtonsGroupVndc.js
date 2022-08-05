import { useCallback, useState } from 'react';
import { placeFuturesOrder } from 'redux/actions/futures';
import { useTranslation } from 'next-i18next';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { getLoginUrl } from 'src/redux/actions/utils';
import { useRouter } from 'next/router';

export const getType = (type) => {
    switch (type) {
        case FuturesOrderTypes.Limit:
            return VndcFutureOrderType.Type.LIMIT;
        case FuturesOrderTypes.Market:
            return VndcFutureOrderType.Type.MARKET;
        case FuturesOrderTypes.StopLimit:
        case FuturesOrderTypes.StopMarket:
            return VndcFutureOrderType.Type.STOP;
        default:
            return VndcFutureOrderType.Limit;
    }
}

export const getPrice = (type, side, price, ask, bid, stopPrice) => {
    if (type === VndcFutureOrderType.Type.MARKET) return VndcFutureOrderType.Side.BUY === side ? ask : bid;
    if (type === VndcFutureOrderType.Type.STOP) return Number(stopPrice);
    return Number(price);
}

const FuturesOrderButtonsGroupVndc = ({
    pairConfig,
    type,
    positionMode,
    quantity,
    price,
    size,
    stopPrice,
    lastPrice,
    stopOrderMode,
    leverage,
    orderSlTp,
    isError,
    ask,
    bid,
    isAuth,
    decimalScaleQty,
    decimalScalePrice,
    side
}) => {
    const { t } = useTranslation()
    const router = useRouter();
    const [disabled, setDisabled] = useState(false);
    const handleParams = useCallback(
        (side) => {
            const params = {
                symbol: pairConfig?.symbol,
                type: getType(type),
                side: side,
                quantity: +size,
                price: getPrice(getType(type), side, price, ask, bid, stopPrice),
                leverage,
                sl: +Number(orderSlTp.sl).toFixed(decimalScalePrice),
                tp: +Number(orderSlTp.tp).toFixed(decimalScalePrice),
            }
            return params
        },
        [
            pairConfig?.symbol,
            type,
            size,
            quantity,
            price,
            orderSlTp,
            stopPrice,
            ask, bid,
        ]
    )

    const onLogin = () => {
        router.push(getLoginUrl('sso'))
    }

    const onHandleClick = (side) => {
        if (!isAuth) {
            window.open(
                getLoginUrl('sso', 'login'),
                '_self'
            )
            return;
        }
        if (isError) return;
        setDisabled(true)
        placeFuturesOrder(handleParams(side), {
            filters: pairConfig?.filters,
            lastPrice,
            isMarket: [
                FuturesOrderTypes.Market,
                FuturesOrderTypes.StopMarket,
            ].includes(type),
        }, t, () => {
            setDisabled(false)
        })
    }

    const classNameError = disabled || (isAuth && isError) ? '!bg-gray-3 dark:!bg-darkBlue-3 dark:!text-darkBlue-4 text-gray-1 cursor-not-allowed' : '';

    return (
        <div className='flex items-center justify-between font-bold text-sm text-white select-none'>
            {side === VndcFutureOrderType.Side.BUY ?
                <div
                    className={`w-full bg-dominant text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80 ${classNameError}`}
                    onClick={() => onHandleClick(VndcFutureOrderType.Side.BUY)}
                >
                    {isAuth ? t('futures:buy_order') : t('futures:order_table:login_to_continue')}
                </div>
                :
                <div
                    className={`w-full bg-red text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80 ${classNameError}`}
                    onClick={() => onHandleClick(VndcFutureOrderType.Side.SELL)}
                >
                    {isAuth ? t('futures:sell_order') : t('futures:order_table:login_to_continue')}
                </div>
            }
        </div>
    )
}

export default FuturesOrderButtonsGroupVndc
