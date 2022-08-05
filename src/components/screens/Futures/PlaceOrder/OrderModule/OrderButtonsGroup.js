import { useCallback } from 'react';
import { placeFuturesOrder } from 'redux/actions/futures';
import { useTranslation } from 'next-i18next';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { getLoginUrl } from 'src/redux/actions/utils';
import { useRouter } from 'next/router';

const FuturesOrderButtonsGroup = ({
    pairConfig,
    type,
    positionMode,
    quantity,
    price,
    stopPrice,
    lastPrice,
    currentType,
    stopOrderMode,
    isAuth
}) => {
    const { t } = useTranslation()
    const router = useRouter();
    const handleParams = useCallback(
        (side) => {
            const params = {
                symbol: pairConfig?.symbol,
                type,
                side,
                quantity: side === 'BUY' ? +quantity?.buy : +quantity?.sell,
            }

            positionMode
                ? (params.positionSide = side === 'BUY' ? 'LONG' : 'SHORT')
                : delete params.positionSide

            switch (type) {
                case FuturesOrderTypes.Limit:
                    params.price = +price
                    break
                case FuturesOrderTypes.StopLimit:
                    params.price = +price
                    params.stopPrice = +stopPrice
                    params.workingType = stopOrderMode
                    break
                case FuturesOrderTypes.StopMarket:
                    params.stopPrice = +stopPrice
                    params.workingType = stopOrderMode
                    break
            }

            return params
        },
        [
            pairConfig?.symbol,
            type,
            positionMode,
            quantity,
            price,
            stopPrice,
            stopOrderMode,
        ]
    )

    const onLogin = () => {
        router.push(getLoginUrl('sso'))
    }

    return (
        <div className='flex items-center justify-between font-bold text-sm text-white select-none'>
            <div
                className='w-[48%] bg-dominant text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() =>
                    !isAuth ? onLogin() :
                        placeFuturesOrder(handleParams('BUY'), {
                            filters: pairConfig?.filters,
                            lastPrice,
                            isMarket: [
                                FuturesOrderTypes.Market,
                                FuturesOrderTypes.StopMarket,
                            ].includes(currentType),
                        }, t)
                }
            >
                {isAuth ? t('common:buy') + '/Long' : t('futures:order_table:login_to_continue')}
            </div>
            <div
                className='w-[48%] bg-red text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() =>
                    !isAuth ? onLogin() :
                        placeFuturesOrder(handleParams('SELL'), {
                            filters: pairConfig?.filters,
                            lastPrice,
                            isMarket: [
                                FuturesOrderTypes.Market,
                                FuturesOrderTypes.StopMarket,
                            ].includes(currentType),
                        }, t)
                }
            >
                {isAuth ? t('common:sell') + '/Short' : t('futures:order_table:login_to_continue')}
            </div>
        </div>
    )
}

export default FuturesOrderButtonsGroup
