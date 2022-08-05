import classNames from 'classnames';
import useOutsideClick from 'hooks/useOutsideClick';
import { memo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';

const FuturesOrderBookMerger = memo(
    ({ tickSize, tickSizeList, onSetTickSize }) => {
        const [active, setActive] = useState(false)
        const ref = useRef()

        useOutsideClick(ref, () => active && setActive(false))

        const onActive = () => setActive((prevState) => !prevState)

        const onNextTickSize = (tickSize) => {
            onSetTickSize && onSetTickSize(tickSize)
            setActive(false)
        }

        return (
            <div className='relative select-none cursor-pointer'>
                <div
                    className='px-2 flex items-center justify-center min-w-[56px] bg-gray-5 dark:bg-darkBlue-3 rounded-[2px] font-medium text-[10px] text-txtSecondary dark:text-txtSecondary-dark'
                    onClick={onActive}
                >
                    {tickSize}
                    {active ? (
                        <ChevronUp size={10} className='ml-2.5' />
                    ) : (
                        <ChevronDown size={10} className='ml-2.5' />
                    )}
                </div>
                {active && (
                    <div
                        ref={ref}
                        className='py-2 absolute z-10 mt-1.5 left-1/2 -translate-x-1/2 top-full bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:drop-shadow-none dark:border dark:border-darkBlue-3 rounded-md'
                    >
                        {tickSizeList?.map((tickSz) => (
                            <div
                                key={tickSz}
                                onClick={() => onNextTickSize(tickSz)}
                                className={classNames(
                                    'px-3.5 py-1 font-medium text-xs text-center hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer',
                                    {
                                        'text-dominant': tickSz === tickSize,
                                    }
                                )}
                            >
                                {tickSz}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
)

export default FuturesOrderBookMerger
