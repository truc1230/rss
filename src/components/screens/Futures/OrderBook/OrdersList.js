import { maxBy } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { ORDER_BOOK_MODE } from 'redux/actions/const';

import FuturesOrderBookItem from './OrderBookItem';
import classNames from 'classnames';

const FuturesOrdersList = ({ side, orders, isOnly, pairConfig }) => {
    const ref = useRef()

    const renderOrderItems = useCallback(() => {
        const maxQuote = maxBy(orders, (o) => o[1])

        return orders?.map((order, index) => {
            const [, q] = order
            const progress = (q / maxQuote?.[1]) * 100

            return (
                <FuturesOrderBookItem
                    key={`futures_${side}_${index}`}
                    side={side}
                    rate={order[0]}
                    amount={order?.[1]}
                    pairConfig={pairConfig}
                    progress={progress}
                />
            )
        })
    }, [side, orders, pairConfig])

    useEffect(() => {
        if (side === ORDER_BOOK_MODE.ASKS && isOnly && ref.current) {
            ref.current.scrollTop = ref.current?.scrollHeight
        }
    }, [ref, isOnly, side])

    return (
        <div
            ref={ref}
            className={classNames(
                'px-3.5 h-full overflow-hidden transition-all duration-100',
                {
                    '!overflow-auto': isOnly,
                    'flex flex-col': side === ORDER_BOOK_MODE.ASKS,
                    'justify-end': side === ORDER_BOOK_MODE.ASKS && !isOnly,
                    'pb-2.5': isOnly && side === ORDER_BOOK_MODE.BIDS,
                }
            )}
        >
            {renderOrderItems()}
        </div>
    )
}

export default FuturesOrdersList
