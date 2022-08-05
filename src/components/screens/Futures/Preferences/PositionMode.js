import { useDispatch } from 'react-redux';
import { getFuturesUserSettings, setFuturesPositionMode, } from 'redux/actions/futures';
import { FuturesPositionMode } from 'redux/reducers/futures';

import RadioBox from 'components/common/RadioBox';
import { useTranslation } from 'next-i18next';

const FuturesPreferencesPositionMode = ({ positionMode }) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const onSetPositionMode = (mode) => {
        setFuturesPositionMode(mode)
        dispatch(getFuturesUserSettings())
    }

    return (
        <>
            <div className='mb-3'>
                <RadioBox
                    id={FuturesPositionMode.OneWay}
                    label={t('futures:calulator:one_way')}
                    checked={!positionMode}
                    description={t('futures:preferences:in_the_one_way_mode')}
                    onChange={() => onSetPositionMode(false)}
                />
            </div>
            <div>
                <RadioBox
                    id={FuturesPositionMode.Hedge}
                    label={t('futures:calulator:hedge_mode')}
                    checked={positionMode}
                    description={t('futures:preferences:in_the_hedge_way_mode')}
                    onChange={() => onSetPositionMode(true)}
                />
            </div>
            <div className='mt-5 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                {t('futures:preferences:if_there_are_open_positions')}
            </div>
        </>
    )
}

export default FuturesPreferencesPositionMode
