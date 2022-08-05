import Div100vh from 'react-div-100vh';
import NumberFormat from 'react-number-format';
import { formatNumber, scrollFocusInput } from 'redux/actions/utils';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';

import classNames from 'classnames';
import { X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import axios from 'axios';
import { API_VNDC_FUTURES_CHANGE_MARGIN } from 'redux/actions/apis';
import { DefaultFuturesFee } from 'redux/actions/const';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { IconLoading } from 'components/common/Icons';
import WarningCircle from 'components/svg/WarningCircle';
import floor from 'lodash/floor'
import Modal from "components/common/ReModal";
import { reFetchOrderListInterval } from 'redux/actions/futures';
import { find } from 'lodash'
import { createSelector } from 'reselect';

const getPairConfig = createSelector(
    [
        state => state?.futures?.pairConfigs,
        (utils, params) => params
    ],
    (pairConfigs, params) => {
        return find(pairConfigs, { ...params })
    }
);

const getAsset = createSelector(
    [
        state => state?.utils?.assetConfig,
        (utils, params) => params
    ],
    (assetConfig, params) => {
        return find(assetConfig, { ...params })
    }
);

const getWallet = createSelector(
    [
        state => state?.wallet?.FUTURES,
        (utils, params) => params
    ],
    (wallet, params) => {
        return wallet[params]
    }
);

const ADJUST_TYPE = {
    ADD: 'ADD',
    REMOVE: 'REMOVE'
}

const VNDC_ID = 72

const CONFIG_MIN_PROFIT = [
    { leverage: [-Infinity, 1], minMarginRatio: .2 },
    { leverage: [1, 5], minMarginRatio: .25 },
    { leverage: [5, 10], minMarginRatio: .3 },
    { leverage: [10, 15], minMarginRatio: .4 },
    { leverage: [15, 25], minMarginRatio: .5 },
    { leverage: [25, Infinity], minMarginRatio: null },
]

const calMinProfitAllow = (leverage) => {
    const { minMarginRatio } = CONFIG_MIN_PROFIT.find(c => {
        const [start, end] = c.leverage
        return leverage > start && leverage <= end
    })
    return minMarginRatio
}

const calLiqPrice = (side, quantity, open_price, margin, fee) => {
    const size = (side === VndcFutureOrderType.Side.SELL ? -quantity : quantity)
    const number = (side === VndcFutureOrderType.Side.SELL ? -1 : 1);
    return (size * open_price + fee - margin) / (quantity * (number - DefaultFuturesFee.NamiFrameOnus))
}

const AdjustPositionMargin = ({ order, pairPrice, onClose, forceFetchOrder }) => {
    const [adjustType, setAdjustType] = useState(ADJUST_TYPE.ADD)
    const [amount, setAmount] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const dispatch = useDispatch()

    const _setAdjustType = (type) => {
        setAdjustType(type)
        setAmount('')
    }

    const pairConfig = useSelector(state => getPairConfig(state, { symbol: order?.symbol }));
    const assetConfig = useSelector(state => getAsset(state, { id: pairConfig?.quoteAssetId }));
    const futuresBalance = useSelector(state => getWallet(state, pairConfig?.quoteAssetId));
    const alertContext = useContext(AlertContext);

    const { available } = useMemo(() => {
        if (!assetConfig || !futuresBalance) return {}
        return {
            available: Math.max(futuresBalance.value, 0) - Math.max(futuresBalance.locked_value, 0)
        }
    }, [assetConfig, futuresBalance])

    const { t } = useTranslation()

    const lastPrice = order?.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask
    const profit = getProfitVndc(order, lastPrice)

    const { newMargin = 0, newLiqPrice = 0, minMarginRatio, initMargin = 0, maxRemovable = 0 } = useMemo(() => {
        if (!order) return {}
        const profit = getProfitVndc(order, lastPrice, true)
        const initMargin = +order.order_value / +order.leverage
        const minMarginRatio = calMinProfitAllow(order.leverage)
        // const maxRemovable = initMargin * (1 - minMarginRatio + Math.min(profit / initMargin, 0)) - (initMargin - order.margin)
        let maxRemovable = order.margin - initMargin * minMarginRatio + Math.min(profit, 0)
        if (!minMarginRatio) {
            maxRemovable = 0
        }

        const newMargin = +order?.margin + (adjustType === ADJUST_TYPE.REMOVE ? -amount : +amount)
        return {
            newMargin,
            newLiqPrice: calLiqPrice(order.side, order.quantity, order.open_price, newMargin, order.fee),
            minMarginRatio,
            initMargin,
            maxRemovable: maxRemovable * .9 // Minus 10% to ensure valid in server
        }
    }, [order, amount, adjustType, lastPrice])

    const percent = formatNumber(((profit / newMargin) * 100), 2, 0, true);

    const error = useMemo(() => {
        if (+amount > available && adjustType === ADJUST_TYPE.ADD) {
            return t('futures:maximum_price') + formatNumber(available, assetConfig?.assetDigit)
        }

    }, [amount, available, assetConfig, adjustType, percent])

    const handleSetMaxAmount = () => {
        switch (adjustType) {
            case ADJUST_TYPE.ADD:
                setAmount(floor(available))
                break;
            case ADJUST_TYPE.REMOVE:
                setAmount(floor(maxRemovable))
                break;
        }
    }

    const errorProfit = useMemo(() => {
        if (adjustType === ADJUST_TYPE.REMOVE) {
            return t('futures:mobile:adjust_margin:temp_future')
        }
        if (adjustType === ADJUST_TYPE.REMOVE) {
            if (minMarginRatio === null) {
                return t('futures:mobile:adjust_margin:not_allow_change_margin')
            } else if (+amount > maxRemovable) {
                return t(`futures:mobile:adjust_margin:max_removable`, { max: formatNumber(maxRemovable, assetConfig?.assetDigit || 0) })
            }
        }
    }, [adjustType, amount, maxRemovable, minMarginRatio, assetConfig])

    const handleConfirm = async () => {
        setSubmitting(true)
        const { data, status } = await axios.put(API_VNDC_FUTURES_CHANGE_MARGIN, {
            displaying_id: order?.displaying_id,
            margin_change: amount,
            type: adjustType
        }).catch(err => {
            console.error(err)
            return { data: { status: err.message === 'Network Error' ? 'NETWORK_ERROR' : 'UNKNOWN' } }
        })
        dispatch(reFetchOrderListInterval(2, 5000))
        setSubmitting(false)

        if (forceFetchOrder) forceFetchOrder()

        if (data.status === 'ok') {
            const message = t(`futures:mobile:adjust_margin:${{
                [ADJUST_TYPE.ADD]: 'add_success',
                [ADJUST_TYPE.REMOVE]: 'remove_success'
            }[adjustType]
                }`)
            alertContext.alert.show('success', t('common:success'), message, null, null, onClose)
        } else {
            const requestId = data?.data?.requestId && `(${data?.data?.requestId.substring(0, 8)})`
            alertContext.alert.show('error', t('common:failed'), t(`error:futures:${data.status || 'UNKNOWN'}`), requestId)
        }
    }

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={() => !submitting && onClose()} onusClassName='px-0'>
            <div
                className='relative bg-onus-bgModal w-full rounded-t-2xl'>
                <div className='flex justify-between items-center px-4 pb-6'>
                    <span
                        className='text-lg text-onus-white font-bold leading-6'>{t('futures:mobile:adjust_margin:adjust_position_margin')}</span>
                </div>
                <div className='grid grid-cols-2 font-bold'>
                    <div
                        className={
                            classNames(
                                'px-2 py-1 text-center leading-[1.375rem]',
                                {
                                    'border-b border-onus-bg2 text-onus-textSecondary': adjustType === ADJUST_TYPE.REMOVE,
                                    'border-b-2 border-onus-base text-onus-base': adjustType === ADJUST_TYPE.ADD,
                                }
                            )
                        }
                        onClick={() => _setAdjustType(ADJUST_TYPE.ADD)}
                    >
                        {t('futures:mobile:adjust_margin:add')}
                    </div>
                    <div
                        className={
                            classNames(
                                'px-2 py-1 text-center leading-[1.375rem]',
                                {
                                    'border-b border-onus-bg2 text-onus-textSecondary': adjustType === ADJUST_TYPE.ADD,
                                    'border-b-2 border-onus-base text-onus-base': adjustType === ADJUST_TYPE.REMOVE,
                                }
                            )
                        }
                        onClick={() => _setAdjustType(ADJUST_TYPE.REMOVE)}
                    >
                        {t('futures:mobile:adjust_margin:remove')}
                    </div>
                </div>
                <div className='px-4 pt-6'>
                    <div className='uppercase text-xs text-onus-textSecondary leading-[1.125rem] pb-2'>
                        {t('futures:mobile:adjust_margin:amount')}
                    </div>
                    <ErrorToolTip message={!errorProfit ? error : ''}>
                        <div
                            className='flex justify-between items-center pl-4 bg-onus-input2 text-sm rounded-md h-11'>
                            <NumberFormat
                                thousandSeparator
                                allowNegative={false}
                                className='outline-none font-medium flex-1 py-2'
                                value={amount}
                                onValueChange={({ value }) => setAmount(value)}
                                decimalScale={assetConfig?.assetDigit}
                                inputMode='decimal'
                                allowedDecimalSeparators={[',', '.']}
                                placeholder={t('futures:mobile:adjust_margin:amount_placeholder')}
                                onFocus={scrollFocusInput}
                            />
                            <div
                                className='flex items-center'
                                onClick={handleSetMaxAmount}
                            >
                                <span className='px-4 py-2 text-onus-base font-semibold'>
                                    {t('futures:mobile:adjust_margin:max')}
                                </span>
                                <div
                                    className='h-full leading-[2.75rem] bg-onus-grey2 w-16 text-onus-grey font-medium rounded-r-md text-center'>
                                    {assetConfig?.assetCode}
                                </div>
                            </div>
                        </div>
                    </ErrorToolTip>
                    <div className='mt-4 space-y-2'>
                        <div className='text-xs leading-[1.125rem]'>
                            <span
                                className='text-onus-textSecondary mr-1'>{t('futures:mobile:adjust_margin:assigned_margin')}</span>
                            <span className='text-onus-white font-medium'>
                                {formatNumber(order?.margin, assetConfig?.assetDigit)}
                                <span className='ml-1'>{assetConfig?.assetCode}</span>
                            </span>
                        </div>
                        <div className='text-xs leading-[1.125rem]'>
                            <span
                                className='text-onus-textSecondary mr-1'>{t('futures:mobile:adjust_margin:available')}</span>
                            <span className='text-onus-white font-medium'>
                                {formatNumber(floor(+available, assetConfig?.assetDigit), assetConfig?.assetDigit)}
                                <span className='ml-1'>{assetConfig?.assetCode}</span>
                            </span>
                        </div>
                        <div className='text-xs leading-[1.125rem]'>
                            <span
                                className='text-onus-textSecondary mr-1'>{t('futures:mobile:adjust_margin:new_liq_price')}</span>
                            <span className='text-onus-white font-medium'>
                                {newLiqPrice > 0 ? formatNumber(newLiqPrice, assetConfig?.assetDigit, 0, true) : '0'}
                                <span className='ml-1'>{assetConfig?.assetCode}</span>
                            </span>
                        </div>
                        <div className='text-xs leading-[1.125rem]'>
                            <span
                                className='text-onus-textSecondary mr-1'>{t('futures:mobile:adjust_margin:profit_ratio')}</span>
                            <span className={classNames('font-medium', {
                                'text-onus-green': percent >= 0,
                                'text-onus-red': percent < 0
                            })}>
                                {(percent > 0 ? '+' : '') + percent + '%'}
                            </span>
                        </div>
                    </div>
                    {errorProfit &&
                        <div className='mt-6 leading-3'>
                            <div className='flex items-start'>
                                <WarningCircle className='flex-none mr-2' />
                                <span className='text-xs text-[#FF9F1A]'>{errorProfit}</span>
                            </div>
                        </div>
                    }
                    <div
                        className={classNames('flex justify-center items-center bg-onus-base align-middle h-12 text-onus-white rounded-md font-bold mt-6', {
                            '!bg-onus-base opacity-30': !!error || !+amount || !!errorProfit
                        })}
                        onClick={() => {
                            if (!error && !errorProfit && !!+amount && !submitting) {
                                handleConfirm()
                            }
                        }}
                    >
                        {
                            submitting
                                ? <IconLoading color='#FFFFFF' />
                                : <span>{t('futures:mobile:adjust_margin:confirm_btn')}</span>
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default AdjustPositionMargin

const ErrorToolTip = ({ children, message }) => {
    return <div className='relative'>
        <div className={classNames('absolute -top-1 -translate-y-full z-50 flex flex-col items-center', {
            hidden: !message
        })}>
            <div className='px-2 py-1.5 rounded-md bg-darkBlue-4 text-xs'>
                {message}
            </div>
            <div
                className='w-[8px] h-[6px] bg-darkBlue-4'
                style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
            />
        </div>
        {children}
    </div>
}
