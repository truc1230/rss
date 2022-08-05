import { useState } from 'react';

import classNames from 'classnames';
import Button from 'components/common/Button';
import Slider from 'components/trade/InputSlider';
import colors from 'styles/colors';
import { useTranslation } from 'next-i18next';

const FuturesCalculatorPML = () => {
    const { t } = useTranslation();
    const [side, setSide] = useState('Long')

    return (
        <div className='mt-4 flex'>
            <div className='w-1/2 px-5 border-r border-divider dark:border-divider-dark'>
                <div className='font-bold text-[16px]'>{t('futures:calulator:result')}</div>
                <div className='mt-4 flex items-center justify-between flex-wrap font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                    <div>{t('futures:calulator:init_margin')}</div>
                    <div>
                        <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                            60.00
                        </span>{' '}
                        USDT
                    </div>
                </div>
                <div className='mt-2.5 flex items-center justify-between flex-wrap font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                    <div>PNL</div>
                    <div>
                        <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                            60.00
                        </span>{' '}
                        USDT
                    </div>
                </div>
                <div className='mt-2.5 flex items-center justify-between flex-wrap font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                    <div>ROE</div>
                    <div className='text-txtPrimary dark:text-txtPrimary-dark'>
                        100.00%
                    </div>
                </div>
            </div>
            <div className='w-1/2 px-5'>
                {/* Block Side */}
                <div className='z-10 relative w-full h-[32px] flex items-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-3 rounded-[4px] overflow-hidden'>
                    <div
                        className={classNames(
                            'w-1/2 text-center z-20 select-none cursor-pointer text-txtSecondary dark:text-txtSecondary-dark',
                            { '!text-white': side === 'Long' }
                        )}
                        onClick={() => setSide('Long')}
                    >
                        Long
                    </div>
                    <div
                        className={classNames(
                            'w-1/2 text-center z-20 select-none cursor-pointer text-txtSecondary dark:text-txtSecondary-dark',
                            { '!text-white': side === 'Short' }
                        )}
                        onClick={() => setSide('Short')}
                    >
                        Short
                    </div>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='132'
                        height='32'
                        viewBox='0 0 132 32'
                        fill='none'
                        className={classNames('absolute z-10', {
                            'right-0 rotate-180': side === 'Short',
                        })}
                    >
                        <path
                            d='M0 6C0 2.68629 2.68629 0 6 0H110.647C112.023 0 113.357 0.472831 114.426 1.33927L130.593 14.4464C131.58 15.2469 131.58 16.7531 130.593 17.5536L114.426 30.6607C113.357 31.5272 112.023 32 110.647 32H5.99999C2.68628 32 0 29.3137 0 26V6Z'
                            fill={side === 'Long' ? colors.teal : colors.red2}
                        />
                    </svg>
                </div>

                {/* Slider */}
                <div className='mt-5'>
                    <Slider useLabel axis='x' xmax={125} labelSuffix='x' />
                </div>
                <div className='mt-3.5 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    *{t('futures:calulator:max_position_leverage')}:{' '}
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        1000 USDT
                    </span>
                </div>

                {/* Input Group */}
                <div className='mt-5'>
                    <div className='px-3 h-[36px] mb-2 flex items-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <input
                            placeholder={t('futures:order_table:open_price')}
                            className='flex-grow text-xs pr-3'
                        />
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            USDT
                        </span>
                    </div>
                    <div className='px-3 h-[36px] mb-2 flex items-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <input
                            placeholder={t('futures:calulator:exit_price')}
                            className='flex-grow text-xs pr-3'
                        />
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            USDT
                        </span>
                    </div>
                    <div className='px-3 h-[36px] flex items-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <input
                            placeholder={t('futures:order_table:quantity')}
                            className='flex-grow text-xs pr-3'
                        />
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            USDT
                        </span>
                    </div>
                </div>

                {/* Button  */}
                <Button
                    componentType='button'
                    type='primary'
                    title={t('futures:calulator:calculate')}
                    className='mt-5 !h-[36px]'
                />
            </div>
        </div>
    )
}

export default FuturesCalculatorPML
