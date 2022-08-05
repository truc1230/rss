import Button from 'components/common/Button';
import Modal from 'components/common/ReModal';
import { ChevronDown, X } from 'react-feather';

const FuturesEditSLTP = ({ isVisible, order, onClose }) => {
    return (
        <Modal isVisible={isVisible} containerClassName='w-[390px] p-0'>
            <div className='px-5 py-4 flex items-center justify-between border-b border-divider dark:border-divider-dark'>
                <span className='font-bold text-[16px]'>
                    TP/SL for entire position
                </span>{' '}
                <X
                    size={20}
                    strokeWidth={1}
                    className='cursor-pointer'
                    onClick={onClose}
                />
            </div>
            <div className='px-5 pt-4 pb-6 text-sm'>
                <div className='mb-3 font-medium flex items-center justify-between'>
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        Symbol
                    </span>
                    <span className='text-dominant'>ETHUSDT Perpetual 50x</span>
                </div>
                <div className='mb-3 font-medium flex items-center justify-between'>
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        Entry Price
                    </span>
                    <span className=''>42,848.94 USDT</span>
                </div>
                <div className='font-medium flex items-center justify-between'>
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        Mark Price
                    </span>
                    <span className=''>42,848.94 USDT</span>
                </div>

                <div className='mt-5 flex items-center'>
                    <div className='px-3 flex items-center max-w-[266px] h-[36px] bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <span className='font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap'>
                            Take Profit
                        </span>
                        <input className='flex-grow px-2 text-right' />
                        <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                            USDT
                        </span>
                    </div>
                    <div className='relative ml-3 px-2 min-w-[72px] h-[36px] flex items-center justify-between bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <span className=''>Mark</span>
                        <ChevronDown
                            size={16}
                            strokeWidth={1}
                            className='mt-1'
                        />
                        <div></div>
                    </div>
                </div>
                <div className='mt-2 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    When{' '}
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        Mark Price
                    </span>{' '}
                    reaches{' '}
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        44,000.00
                    </span>
                    , it will trigger Take Profit Market order to clos this
                    position. Estimate PNL will be{' '}
                    <span className='text-dominant'>29.88 USDT</span>.
                </div>

                <div className='my-4 w-full h-[1px] bg-divider dark:bg-divider-dark' />

                <div className='flex items-center'>
                    <div className='px-3 flex flex-grow items-center max-w-[266px] h-[36px] bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <span className='font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap'>
                            Stop loss
                        </span>
                        <input className='flex-grow px-2 text-right' />
                        <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                            USDT
                        </span>
                    </div>
                    <div className='ml-3 px-2 min-w-[72px] h-[36px] flex items-center justify-between bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                        <span className=''>Mark</span>
                        <ChevronDown
                            size={16}
                            strokeWidth={1}
                            className='mt-1'
                        />
                    </div>
                </div>
                <div className='mt-2 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    When{' '}
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        Mark Price
                    </span>{' '}
                    reaches{' '}
                    <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                        44,000.00
                    </span>
                    , it will trigger Take Profit Market order to clos this
                    position. Estimate PNL will be{' '}
                    <span className='text-red'>-29.88 USDT</span>.
                </div>

                <div className='mt-4 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    This setting applies to the entire position.{' '}
                    <span className='font-bold'>Take-profit and stop-loss</span>{' '}
                    automaticcally cancel after closing the position. A market
                    order is triggerd when the stop price is reached. The order
                    will be rejected if the position size exceeds the Max Market
                    Order by Qty limit.
                </div>

                <Button
                    title='Confirm'
                    type='primary'
                    className='mt-5 !h-[36px]'
                    componentType='button'
                />
            </div>
        </Modal>
    )
}

export default FuturesEditSLTP
