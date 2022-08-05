import { useCallback, useRef, useState } from 'react';
import { NAMI_FUTURES_EARNED_SHARE } from 'constants/constants';
import { useScreenshot } from 'use-react-screenshot';
import { useSelector } from 'react-redux';
import { formatTime } from 'redux/actions/utils';
import { QRCode } from 'react-qrcode-logo';
import { saveAs } from 'file-saver';

import classNames from 'classnames';
import CheckBox from 'components/common/CheckBox';
import Button from 'components/common/Button';
import Modal from 'components/common/ReModal';

const FuturesProfitEarned = ({ isVisible }) => {
    const [inforToShare, setInforToShare] = useState({
        leverage: true,
        pnlAmount: true,
        price: true,
    })

    const [screenShot, setScreenShot] = useScreenshot()

    const ref = useRef()

    const auth = useSelector((state) => state.auth.user)

    const onSelectShareInfo = (field) =>
        setInforToShare((prevState) => ({
            ...prevState,
            [field]: !!!inforToShare?.[field],
        }))

    const onDownload = useCallback(() => {
        if (!ref?.current) return
        setScreenShot(ref.current)
        setTimeout(
            () =>
                screenShot &&
                saveAs(
                    screenShot,
                    `${NAMI_FUTURES_EARNED_SHARE}_${formatTime(
                        Date.now(),
                        'dd-MM-yyyy_HH:mm'
                    )}`
                ),
            1000
        )
    }, [ref, screenShot])

    const renderReferQrCode = useCallback(() => {
        if (!auth?.code_refer) return null
        return (
            <>
                <QRCode value={auth.code_refer} size={120} />
                <div className='mt-2.5 w-[140px] font-medium text-sm text-center'>
                    Referral Code
                </div>
                <div className='mt-1 w-[140px] font-bold text-[20px] text-center uppercase'>
                    {auth.code_refer}
                </div>
            </>
        )
    }, [auth])

    const renderLeverage = useCallback(() => {
        if (!inforToShare.leverage) return null
        return (
            <>
                <span className='mx-3'>|</span>
                <span>50X</span>
            </>
        )
    }, [inforToShare.leverage])

    const renderPnlAmount = useCallback(() => {
        return (
            <span
                className={classNames(
                    'font-medium text-[18px] duration-75 transition-all',
                    {
                        'blur-sm': !inforToShare.pnlAmount,
                    }
                )}
            >
                (+2.53 USDT)
            </span>
        )
    }, [inforToShare.pnlAmount])

    const renderPrice = useCallback(() => {
        return (
            <div className='mt-3 font-medium text-sm'>
                <div className='mb-2'>
                    <span className='mr-6'>Entry Price</span>
                    <span
                        className={classNames('duration-75 transition-all', {
                            'blur-sm': !inforToShare.price,
                        })}
                    >
                        42,848.94 USDT
                    </span>
                </div>
                <div>
                    <span className='mr-6'>Mark Price</span>
                    <span
                        className={classNames('duration-75 transition-all', {
                            'blur-sm': !inforToShare.price,
                        })}
                    >
                        42,848.94 USDT
                    </span>
                </div>
            </div>
        )
    }, [inforToShare.price])

    return (
        <Modal
            isVisible={isVisible}
            containerClassName='p-0 w-[596px] rounded-[4px] overflow-hidden'
        >
            <div
                ref={ref}
                style={{ fontFamily: 'Barlow' }}
                className='p-[32px] pb-5 bg-dominant rounded-[4px]'
            >
                <img
                    src='/images/logo/nami_exchange_white_2.png'
                    alt='Nami.Futures'
                    className='w-[120px] h-auto'
                />
                <div className='mt-6 flex'>
                    <div className='w-2/3'>
                        <div className='mb-3 font-medium text-sm'>
                            <span>Long</span>
                            {renderLeverage()}
                            <span className='mx-3'>|</span>
                            <span>BTCUSDT Perpetual</span>
                        </div>
                        <div className='font-bold text-[42px]'>
                            +12.35% {renderPnlAmount()}
                        </div>
                        {renderPrice()}
                        <div className='mt-10 font-medium text-xs'>
                            <span className='font-bold'>Time Stamp:</span>{' '}
                            2022-02-07 10:23
                        </div>
                    </div>
                    <div className='w-1/3 rounded-qr-canvas'>
                        {renderReferQrCode()}
                    </div>
                </div>
            </div>
            <div className='-mt-1 px-[32px] py-6 bg-bgPrimary dark:bg-bgPrimary-dark'>
                <div className='flex items-center font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                    <div className='mr-[67px]'>
                        Optional Information to share
                    </div>
                    <div className='flex'>
                        <CheckBox
                            label='Leverage'
                            className='mr-6'
                            active={!!inforToShare?.leverage}
                            onChange={() => onSelectShareInfo('leverage')}
                        />
                        <CheckBox
                            label='PNL Amount'
                            className='mr-6'
                            active={!!inforToShare?.pnlAmount}
                            onChange={() => onSelectShareInfo('pnlAmount')}
                        />
                        <CheckBox
                            label='Price'
                            active={!!inforToShare?.price}
                            onChange={() => onSelectShareInfo('price')}
                        />
                    </div>
                </div>
                <div className='mt-5 flex'>
                    <Button
                        title='Cancel'
                        componentType='button'
                        className='!rounded-[12px] !h-[50px]'
                    />
                    <Button
                        title='Download'
                        type='primary'
                        onClick={onDownload}
                        componentType='button'
                        className='ml-[22px] !rounded-[12px] !h-[50px]'
                    />
                </div>
            </div>
        </Modal>
    )
}

export default FuturesProfitEarned
