import { useState } from 'react';
import { X } from 'react-feather';

import classNames from 'classnames';
import Modal from 'components/common/ReModal';
import FuturesPreferencesOrderConfirmation from './OrderConfirmation';
import FuturesPreferencesPositionMode from './PositionMode';
import FuturesPreferencesNotification from './Notification';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

const PREFERENCES = {
    ORDER_CONFIRMATION: 'ORDER_CONFIRMATION',
    POSITION_MODE: 'POSITION_MODE',
    NOTIFICATION: 'NOTIFICATION',
}

const FuturesPreferences = ({ isVisible, onClose, positionMode }) => {
    const { t } = useTranslation()
    const [section, setSection] = useState(PREFERENCES.ORDER_CONFIRMATION)
    const preferences = useSelector((state) => state.futures.preferences)

    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName='p-0 w-[596px] h-[380px] dark:border border-divider-dark'
        >
            <div className='flex flex-col h-full'>
                <div className='-mt-1 p-5 pb-4 flex items-center justify-between font-bold text-sm border-b border-divider dark:border-divider-dark'>
                    {t('futures:preferences:preferences')}
                    <div
                        className='flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer'
                        onClick={onClose}
                    >
                        <X size={16} />
                    </div>
                </div>

                {/* Settings */}
                <div className='flex flex-grow'>
                    <div className='pl-5 pt-1 pb-3 w-[30%] border-r border-divider dark:border-divider-dark'>
                        <div
                            className={classNames(
                                'font-medium text-sm py-2 cursor-pointer hover:text-dominant',
                                {
                                    'text-dominant':
                                        section ===
                                        PREFERENCES.ORDER_CONFIRMATION,
                                }
                            )}
                            onClick={() =>
                                setSection(PREFERENCES.ORDER_CONFIRMATION)
                            }
                        >
                            {t('futures:preferences:order_confirm')}
                        </div>
                        <div
                            className={classNames(
                                'font-medium text-sm py-2 cursor-pointer hover:text-dominant',
                                {
                                    'text-dominant':
                                        section === PREFERENCES.POSITION_MODE,
                                }
                            )}
                            onClick={() =>
                                setSection(PREFERENCES.POSITION_MODE)
                            }
                        >
                            {t('futures:preferences:position_mode')}
                        </div>
                        <div
                            className={classNames(
                                'font-medium text-sm py-2 cursor-pointer hover:text-dominant',
                                {
                                    'text-dominant':
                                        section === PREFERENCES.NOTIFICATION,
                                }
                            )}
                            onClick={() => setSection(PREFERENCES.NOTIFICATION)}
                        >
                            {t('futures:preferences:notification')}
                        </div>
                    </div>
                    <div className='w-[70%] px-5 py-3'>
                        {section === PREFERENCES.ORDER_CONFIRMATION && (
                            <FuturesPreferencesOrderConfirmation />
                        )}
                        {section === PREFERENCES.POSITION_MODE && (
                            <FuturesPreferencesPositionMode
                                positionMode={positionMode}
                            />
                        )}
                        {section === PREFERENCES.NOTIFICATION && (
                            <FuturesPreferencesNotification />
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default FuturesPreferences
