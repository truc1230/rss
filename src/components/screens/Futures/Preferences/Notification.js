import { useDispatch, useSelector } from 'react-redux';
import { SET_FUTURES_PREFERENCES } from 'redux/actions/types';
import { useTranslation } from 'next-i18next';
import ToggleItem from './ToggleItem';

const NOTI = {
    TPSL: 'TPSL',
    FundingFee: 'FundingFee',
}

const FuturesPreferencesNotification = () => {
    const { t } = useTranslation()
    const preferences = useSelector(
        (state) => state.futures.preferences?.notification
    )

    const dispatch = useDispatch()

    const setNotification = (field, status) => {
        if (preferences?.[field] !== status) {
            dispatch({
                type: SET_FUTURES_PREFERENCES,
                payload: {
                    notification: { ...preferences, [field]: status },
                },
            })
        }
    }

    return (
        <>
            <div className='mb-3'>
                <ToggleItem
                    label={t('futures:preferences:tp_sl_trigger')}
                    active={!!preferences?.[NOTI.TPSL]}
                    onChange={() =>
                        setNotification(NOTI.TPSL, !preferences?.[NOTI.TPSL])
                    }
                />
                <div className='mt-1 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('futures:preferences:notification_limit_is_up')}
                </div>
            </div>
            <div>
                <ToggleItem
                    label={t('futures:preferences:funding_fee_trigger')}
                    active={!!preferences?.[NOTI.FundingFee]}
                    onChange={() =>
                        setNotification(
                            NOTI.FundingFee,
                            !preferences?.[NOTI.FundingFee]
                        )
                    }
                />
                <div className='mt-1 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('futures:preferences:you_will_be_notified_when')}
                </div>
            </div>
            <div className='mt-4 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                {t('futures:preferences:you_will_be_notified_of')}
            </div>
        </>
    )
}

export default FuturesPreferencesNotification
