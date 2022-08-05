import classNames from 'classnames';
import { ORDER_BOOK_MODE } from 'redux/actions/const';
import { memo } from 'react';
import { formatNumber } from 'redux/actions/utils';

const FuturesOrderBookItem = memo(
    ({ side, rate, amount, pairConfig, progress }) => {
        return (
            <div className='relative mb-[2px] last:mb-0'>
                {/* Progress Bar */}
                <div
                    style={{
                        width: progress || 0,
                    }}
                    className={classNames(
                        '-mx-2 px-2 absolute z-10 top-0 right-0 h-full rounded-[2px]',
                        {
                            'bg-red-lightRed': side === ORDER_BOOK_MODE.ASKS,
                            'bg-teal-opacitier': side === ORDER_BOOK_MODE.BIDS,
                        }
                    )}
                />

                {/* Order Value */}
                <div
                    style={{ height: FUTURES_ORDER_BOOK_ITEMS_HEIGHT }}
                    className='relative z-20 -mx-2 px-2 flex items-center justify-between font-medium text-xs rounded-[2px] hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer select-none'
                >
                    <div
                        style={{ flex: '1 1 0%' }}
                        className={classNames('justify-start text-dominant', {
                            'text-red': side === ORDER_BOOK_MODE.ASKS,
                        })}
                    >
                        {formatNumber(+rate, pairConfig?.pricePrecision || 4)}
                    </div>
                    <div
                        style={{ flex: '1 1 0%' }}
                        className='justify-end text-right text-darkBlue-5 dark:text-darkBlue-5'
                    >
                        {formatNumber(
                            +amount,
                            pairConfig?.quantityPrecision || 5
                        )}
                    </div>
                    <div
                        style={{ flex: '1 1 0%' }}
                        className='justify-end text-right text-darkBlue-5 dark:text-darkBlue-5'
                    >
                        {formatNumber(
                            +rate * +amount,
                            pairConfig?.quantityPrecision || 5
                        )}
                    </div>
                </div>
            </div>
        )
    }
)

export const FUTURES_ORDER_BOOK_ITEMS_HEIGHT = 18

export default FuturesOrderBookItem
