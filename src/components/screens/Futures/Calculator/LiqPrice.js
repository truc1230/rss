import { useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';

import useOutsideClick from 'hooks/useOutsideClick';
import classNames from 'classnames';
import Slider from 'components/trade/InputSlider';
import colors from 'styles/colors';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';

const FuturesCalculatorLiqPrice = () => {
    const [positionMode, setPositionMode] = useState('One-way')
    const [marginMode, setMarginMode] = useState('Cross')
    const [side, setSide] = useState('Long')
    const [dropdown, setDropdown] = useState({})

    const marginRef = useRef()
    const positionRef = useRef()
    const { t } = useTranslation();

    useOutsideClick(marginRef, () => dropdown?.marginMode && setDropdown({}))
    useOutsideClick(
        positionRef,
        () => dropdown?.positionMode && setDropdown({})
    )

    const closeDropdown = () => setDropdown({})

    const onChangeMarginMode = (mode) => {
        setMarginMode(mode)
        setDropdown({})
    }

    const onChangePositionMode = (mode) => {
        setPositionMode(mode)
        setDropdown({})
    }

    return (
        <div className='mt-4 flex'>
            <div className='w-1/2 px-5 border-r border-divider dark:border-divider-dark'>
                <div className='font-bold text-[16px]'>{t('futures:calulator:result')}</div>
                <div className='mt-4 flex items-center justify-between flex-wrap font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                    <div>{t('futures:calulator:liq_price')}</div>
                    <div>- USDT</div>
                </div>
                <div className='mt-[30px] font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('futures:calulator:liq_price_description')}
                </div>
            </div>
            <div className='w-1/2 px-5'>
                {/* Block Mode  */}
                <div className='flex relative z-[99] items-center justify-between select-none'>
                    {/* Margin Mode */}
                    <div
                        ref={marginRef}
                        className='w-[48%] relative flex items-center justify-center py-2 text-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-3 rounded-[4px] cursor-pointer'
                        onClick={() =>
                            setDropdown({ marginMode: !dropdown?.marginMode })
                        }
                    >
                        {marginMode}{' '}
                        <ChevronDown
                            size={16}
                            strokeWidth={1.2}
                            className={classNames('ml-1', {
                                'rotate-180': !!dropdown?.marginMode,
                            })}
                        />
                        {/* MarginMode Dropdown */}
                        <div
                            className={classNames(
                                'absolute hidden py-1 mt-1 w-full left-0 top-full text-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]',
                                { '!block': !!dropdown?.marginMode }
                            )}
                        >
                            <div
                                className='py-2 hover:bg-dominant hover:text-white'
                                onClick={() => onChangeMarginMode('Cross')}
                            >
                                Cross
                            </div>
                            <div
                                className='py-2 hover:bg-dominant hover:text-white'
                                onClick={() => onChangeMarginMode('Isolated')}
                            >
                                Isolated
                            </div>
                        </div>
                    </div>

                    {/* Position Mode */}
                    <div
                        ref={positionRef}
                        className='w-[48%] relative flex items-center justify-center py-2 text-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-3 rounded-[4px] cursor-pointer'
                        onClick={() =>
                            setDropdown({
                                positionMode: !dropdown?.positionMode,
                            })
                        }
                    >
                        {positionMode} Mode{' '}
                        <ChevronDown
                            size={16}
                            strokeWidth={1.2}
                            className={classNames('ml-1', {
                                'rotate-180': !!dropdown?.positionMode,
                            })}
                        />
                        {/* PositionMode Dropdown */}
                        <div
                            className={classNames(
                                'absolute hidden py-1 mt-1 w-full left-0 top-full text-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]',
                                { '!block': !!dropdown?.positionMode }
                            )}
                        >
                            <div
                                className='py-2 hover:bg-dominant hover:text-white'
                                onClick={() => onChangePositionMode('One-way')}
                            >
                                {t('futures:calulator:one_way')}
                            </div>
                            <div
                                className='py-2 hover:bg-dominant hover:text-white'
                                onClick={() => onChangePositionMode('Hedge')}
                            >
                                {t('futures:calulator:hedge_mode')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Block Side */}
                <div className='mt-2.5 z-10 relative w-full h-[32px] flex items-center font-medium text-sm bg-gray-5 dark:bg-darkBlue-3 rounded-[4px] overflow-hidden'>
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

export default FuturesCalculatorLiqPrice
