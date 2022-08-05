import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FuturesMarginMode as MarginModes } from 'redux/reducers/futures';
import { getFuturesUserSettings, setFuturesMarginMode, } from 'redux/actions/futures';
import { X } from 'react-feather';

import classNames from 'classnames';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { ScaleLoader } from 'react-spinners';
import colors from 'styles/colors';

const FuturesMarginModeSettings = ({
    isVisible,
    onClose,
    pair,
    marginMode,
}) => {
    const [mode, setMode] = useState(marginMode)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const onSetMarginMode = async (pair, mode) => {
        setError(false)
        setLoading(true)
        const data = await setFuturesMarginMode(pair, mode)
        if (data) {
            setMode(data)
            setLoading(false)
            dispatch(getFuturesUserSettings())
            onClose()
        } else {
            setError(true)
            setLoading(false)
        }
    }

    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName='max-w-[306px] top-[50%]'
        >
            <div className='-mt-1.5 mb-3 flex items-center justify-between font-bold text-sm'>
                BTC/USDT Perpetual Margin Mode
                <div
                    className='flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer'
                    onClick={onClose}
                >
                    <X size={16} />
                </div>
            </div>
            <div className='mb-3 flex items-center justify-between'>
                <div
                    onClick={() => setMode(MarginModes.Cross)}
                    className={classNames(
                        'w-[48%] py-1.5 font-medium text-center text-sm text-txtSecondary dark:text-txtSecondary-dark rounded-[4px] select-none border border-divider dark:border-divider-dark cursor-pointer hover:text-dominant hover:border-dominant',
                        {
                            '!text-dominant !border-dominant':
                                mode === MarginModes.Cross,
                        }
                    )}
                >
                    Cross
                </div>
                <div
                    onClick={() => setMode(MarginModes.Isolated)}
                    className={classNames(
                        'w-[48%] py-1.5 font-medium text-center text-sm text-txtSecondary dark:text-txtSecondary-dark rounded-[4px] select-none border border-divider dark:border-divider-dark cursor-pointer hover:text-dominant hover:border-dominant',
                        {
                            '!text-dominant !border-dominant':
                                mode === MarginModes.Isolated,
                        }
                    )}
                >
                    Isolated
                </div>
            </div>
            <div className='pb-3 mb-3 border-b border-divider dark:border-divider-dark font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                *Switching the margin mode will only apply it to the selected
                contract.
            </div>
            <div className='text-xs mb-2.5'>
                <span className='font-bold'>Isolated Margin:</span>{' '}
                <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                    là chế độ mà ở đó cho phép lượng margin của một vị thế được
                    giới hạn trong một khoảng nhất định. Khi tới ngưỡng thanh
                    lý, mọi người chỉ mất đi số tiền đặt vào vị thế đó.
                </span>
            </div>
            <div className='text-xs mb-5'>
                <span className='font-bold'>Cross Margin:</span>{' '}
                <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                    là chế độ mà ở đó cho phép các vị thế sử dụng tất cả số dư
                    trong tài khoản cross để tránh việc bị thanh lý. Nhưng khi
                    xảy ra việc thanh lý, mọi người sẽ mất toàn bộ số dư trong
                    tài khoản và tất cả các vị thế đang mở.
                </span>
            </div>
            {error && (
                <div className='text-red text-xs text-center'>
                    Error occurred, please try again.
                </div>
            )}
            <div className='mt-5 mb-2'>
                <Button
                    title={
                        loading ? (
                            <ScaleLoader
                                color={colors.white}
                                width={2}
                                height={12}
                            />
                        ) : (
                            'Confirm'
                        )
                    }
                    componentType='button'
                    type='primary'
                    onClick={() => onSetMarginMode(pair, mode)}
                />
            </div>
        </Modal>
    )
}

export default FuturesMarginModeSettings
