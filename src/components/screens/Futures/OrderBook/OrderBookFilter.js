import { memo } from 'react';
import { ORDER_BOOK_MODE } from 'redux/actions/const';

import OrderBookAll from 'src/components/svg/OrderBookAll';
import OrderBookBids from 'src/components/svg/OrderBookBids';
import OrderBookAsks from 'src/components/svg/OrderBookAsks';
import classNames from 'classnames';

const FuturesOrderBookFilter = memo(({ filterMode, onFilter }) => {
    return (
        <div className='flex'>
            <OrderBookAll
                onClick={() => onFilter(ORDER_BOOK_MODE.ALL)}
                className={classNames('opacity-60 cursor-pointer', {
                    '!opacity-100': filterMode === ORDER_BOOK_MODE.ALL,
                })}
            />
            <OrderBookBids
                onClick={() => onFilter(ORDER_BOOK_MODE.BIDS)}
                className={classNames('ml-3 opacity-60 cursor-pointer', {
                    '!opacity-100': filterMode === ORDER_BOOK_MODE.BIDS,
                })}
            />
            <OrderBookAsks
                onClick={() => onFilter(ORDER_BOOK_MODE.ASKS)}
                className={classNames('ml-3 opacity-60 cursor-pointer', {
                    '!opacity-100': filterMode === ORDER_BOOK_MODE.ASKS,
                })}
            />
        </div>
    )
})

export default FuturesOrderBookFilter
