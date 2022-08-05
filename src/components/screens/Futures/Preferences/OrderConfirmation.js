import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_FUTURES_PREFERENCES } from 'redux/actions/types';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import ToggleItem from './ToggleItem';
import { useTranslation } from 'next-i18next';

const FuturesPreferencesOrderConfirmation = () => {
    const { t } = useTranslation()
    const preferences = useSelector(
        (state) => state.futures.preferences.orderConfirmation
    )

    const dispatch = useDispatch()

    const getLabel = (value) => {
        switch (value) {
            case FuturesOrderTypes.Limit:
                return t('futures:preferences:limit_order')
            case FuturesOrderTypes.Market:
                return t('futures:preferences:market_order')
            case FuturesOrderTypes.StopLimit:
                return t('futures:preferences:stop_limit_order')
            case FuturesOrderTypes.StopMarket:
                return t('futures:preferences:stop_market_order')
            case FuturesOrderTypes.TrailingStopMarket:
                return t('futures:preferences:trailing_stop_order')
            default:
                return null
        }
    }

    const setOrderConfirmPreferences = (field, status) => {
        if (preferences?.[field] !== status) {
            dispatch({
                type: SET_FUTURES_PREFERENCES,
                payload: {
                    orderConfirmation: { ...preferences, [field]: status },
                },
            })
        }
    }

    const renderPreferencesToggle = useCallback(
        () =>
            Object.values(FuturesOrderTypes)
                ?.filter(
                    (o) =>
                        o !== FuturesOrderTypes.TakeProfit &&
                        o !== FuturesOrderTypes.TakeProfitMarket
                )?
                .map((type) => (
                    <ToggleItem
                        key={type}
                        label={getLabel(type)}
                        active={!!preferences?.[type]}
                        className='mb-3'
                        onChange={() =>
                            setOrderConfirmPreferences(
                                type,
                                !preferences?.[type]
                            )
                        }
                    />
                )),
        [preferences]
    )

    return (
        <div>
            {renderPreferencesToggle()}
            <div className='mt-4 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                {t('futures:preferences:order_confirmation_will_be')}
            </div>
        </div>
    )
}

export default FuturesPreferencesOrderConfirmation
