import { memo } from 'react';
import { formatNumber } from 'redux/actions/utils';
import { useRouter } from 'next/router';
import { roundTo } from 'round-to';
import { PATHS } from 'constants/paths';
import classNames from 'classnames';

const FuturesFavoritePairItem = memo(({ pair }) => {
    const router = useRouter()
    return (
        <div
            className='flex items-center font-medium text-xs px-2.5 py-2 hover:bg-gray-4 dark:hover:bg-darkBlue-3 cursor-pointer rounded-md select-none'
            onClick={() =>
                router.query?.pair !== pair?.symbol &&
                router.push(PATHS.FUTURES_V2.DEFAULT + `/${pair?.symbol}`)
            }
        >
            <div className='mr-1 text-gray-1 dark:text-white'>{pair?.symbol}</div>
            <div
                className={classNames('tracking-wide min-w-[40px] text-right', {
                    'text-red': pair?.priceChangePercent < 0,
                    'text-dominant': pair?.priceChangePercent >= 0,
                })}
            >
                {formatNumber(roundTo(pair?.priceChangePercent * (pair?.quoteAsset === 'VNDC' ? 100 : 1), 2), 2, 2, true)}
                %
            </div>
        </div>
    )
})

export default FuturesFavoritePairItem
