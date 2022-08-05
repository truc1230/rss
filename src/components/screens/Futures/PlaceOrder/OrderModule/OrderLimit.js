import { useTranslation } from 'next-i18next';
import { ChevronDown } from 'react-feather';

import TradingInput from 'components/trade/TradingInput';
import { FuturesStopOrderMode } from 'redux/reducers/futures';

const FuturesOrderLimit = ({
    isStopLimit,
    pairConfig,
    price,
    size,
    selectedAsset,
    getLastedLastPrice,
    handlePrice,
    handleQuantity,
    stopPrice,
    setStopPrice,
    setAsset,
    getValidator,
    stopOrderMode,
    setStopOrderMode,
    getOrderStopModeLabel,
    isVndcFutures,
    decimalScalePrice,
    decimalScaleQty
}) => {
    const { t } = useTranslation()

    const onReverseAsset = (current, asset) => {
        if (current === asset) return
        setAsset(asset)
        handleQuantity('')
    }


    return (
        <div>
            {isStopLimit && (
                <TradingInput
                    containerClassName='mb-[12px]'
                    label={'Stop Price'}
                    value={stopPrice}
                    allowNegative={false}
                    onValueChange={({ value }) => setStopPrice(value)}
                    decimalScale={decimalScalePrice}
                    tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                    renderTail={() => (
                        <div className='relative group select-none'>
                            <div className='flex items-center'>
                                {isVndcFutures ? 'VNDC' : <>
                                    {getOrderStopModeLabel(stopOrderMode)}
                                    <ChevronDown
                                        size={12}
                                        className='ml-1 group-hover:rotate-180'
                                    />
                                </>
                                }
                            </div>
                            {!isVndcFutures &&
                                <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                                    <div
                                        className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                        onClick={() =>
                                            setStopOrderMode(
                                                FuturesStopOrderMode.lastPrice
                                            )
                                        }
                                    >
                                        Last
                                    </div>
                                    <div
                                        className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                        onClick={() =>
                                            setStopOrderMode(
                                                FuturesStopOrderMode.markPrice
                                            )
                                        }
                                    >
                                        Mark
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                />
            )}
            <TradingInput
                containerClassName='mb-[12px]'
                label={t('common:price')}
                value={price}
                allowNegative={false}
                onValueChange={({ value }) => handlePrice(value)}
                decimalScale={decimalScalePrice}
                validator={getValidator('price')}
                tailContainerClassName='relative flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <>
                        <div
                            className='group truncate mr-2 text-dominant cursor-pointer'
                            onClick={getLastedLastPrice}
                        >
                            {isVndcFutures ? '' : t('futures:last_price')}
                            <div className='hidden group-hover:block absolute p-2 rounded-md -top-2 left-1/2 translate-x-[-85%] -translate-y-full text-xs text-txtPrimary dark:text-txtPrimary-dark bg-gray-3 dark:bg-darkBlue-4'>
                                {t('futures:last_price_tooltip')}
                                <div className='absolute bottom-0 translate-y-4 left-1/2 -translate-x-1/2 text-lg text-gray-3 dark:text-darkBlue-4'>
                                    <i className='ci-caret_down' />
                                </div>
                            </div>
                        </div>
                        <div>{pairConfig?.quoteAsset}</div>
                    </>
                )}
            />
            <TradingInput
                thousandSeparator={String(size)?.includes('%') ? false : true}
                label={t('futures:size')}
                value={size}
                allowNegative={false}
                suffix={String(size)?.includes('%') ? '%' : ''}
                onChange={({ target: { value } }) => handleQuantity(value)}
                // onValueChange={({ value }) => handleQuantity(value)}
                validator={getValidator('quantity')}
                decimalScale={decimalScaleQty}
                labelClassName='whitespace-nowrap capitalize'
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'>
                        <div className='flex items-center'>
                            {selectedAsset}{' '}
                            {!isVndcFutures &&
                                <ChevronDown
                                    size={12}
                                    className='ml-1 group-hover:rotate-180'
                                />
                            }
                        </div>
                        {!isVndcFutures &&
                            <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                                <div
                                    className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                    onClick={() =>
                                        onReverseAsset(
                                            selectedAsset,
                                            pairConfig?.quoteAsset
                                        )
                                    }
                                >
                                    {pairConfig?.quoteAsset}
                                </div>
                                <div
                                    className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                    onClick={() =>
                                        onReverseAsset(
                                            selectedAsset,
                                            pairConfig?.baseAsset
                                        )
                                    }
                                >
                                    {pairConfig?.baseAsset}
                                </div>
                            </div>
                        }
                    </div>
                )}
            />
        </div>
    )
}

export default FuturesOrderLimit
