import { useState } from 'react';
import { getMarginModeLabel } from 'redux/actions/futures';

import FuturesMarginModeSettings from '../MarginModeSettings';
import FuturesLeverageSettings from '../LeverageSettings';
import FuturesPreferences from '../Preferences';
import TradeSetings from 'components/svg/TradeSettings';

const PlaceConfigs = ({ pairConfig, userSettings, leverage, setLeverage, isVndcFutures, isAuth }) => {
    const pair = pairConfig?.pair
    const marginMode = userSettings?.marginType?.[pairConfig?.pair]
    const positionMode = userSettings?.dualSidePosition || false

    const [isActive, setIsActive] = useState({})

    const openPopup = (key) => setIsActive({ [key]: true })

    const closePopup = (key) => setIsActive({ [key]: false })

    return (
        <>
            <div className='pt-5 pb-3 flex items-center w-full'>
                <div className='flex-grow flex items-center w-full'>
                    <div
                        onClick={() => !isVndcFutures && openPopup('marginMode')}
                        className={`${isVndcFutures ? 'cursor-auto text-gray dark:text-darkBlue-4 ' : ''} px-[16px] py-1 mr-2.5 text-xs font-bold bg-bgSecondary dark:bg-darkBlue-3 cursor-pointer hover:opacity-80 rounded-md`}
                    >
                        {isVndcFutures ? 'Isolated' : getMarginModeLabel(marginMode) || '--'}
                    </div>
                    <div
                        onClick={() => openPopup('leverage')}
                        className='px-[16px] py-1 mr-2.5 text-xs font-bold bg-bgSecondary dark:text-txtSecondary-dark dark:bg-darkBlue-3 cursor-pointer hover:opacity-80 rounded-md'
                    >
                        {leverage}x
                    </div>
                </div>
                {isAuth && !isVndcFutures &&
                    <div
                        onClick={() => openPopup('preferences')}
                        className='-mr-1.5 w-8 h-7 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-4 dark:hover:bg-darkBlue-3'
                    >
                        <TradeSetings size={16} />
                    </div>
                }
            </div>
            {isAuth && !isVndcFutures &&
                <FuturesPreferences
                    isVisible={!!isActive?.preferences}
                    positionMode={positionMode}
                    onClose={() => closePopup('preferences')}
                />
            }
            <FuturesMarginModeSettings
                isVisible={!!isActive?.marginMode}
                marginMode={marginMode}
                pair={pairConfig?.pair}
                onClose={() => closePopup('marginMode')}
            />
            {!!isActive?.leverage && (
                <FuturesLeverageSettings
                    pair={pair}
                    leverage={leverage}
                    setLeverage={setLeverage}
                    pairConfig={pairConfig}
                    isVisible={!!isActive?.leverage}
                    isAuth={isAuth}
                    onClose={() => closePopup('leverage')}
                    isVndcFutures={isVndcFutures}
                />
            )}
        </>
    )
}
export default PlaceConfigs
