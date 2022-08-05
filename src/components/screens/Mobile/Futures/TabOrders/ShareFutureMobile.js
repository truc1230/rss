import React from 'react';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber, formatTime } from 'redux/actions/utils';

const { PENDING, ACTIVE, CLOSED } = VndcFutureOrderType.Status
const APP_URL = process.env.APP_URL || 'https://nami.exchange'

export const getShareModalData = ({ order, pairPrice }) => {

    if (!order) return {}

    let profit = 0
    let closePrice = 0
    let price = {
        [PENDING]: order?.price,
        [ACTIVE]: order?.open_price,
        [CLOSED]: order?.close_price,
    }[order?.status]

    const status = {
        [PENDING]: 'opening',
        [ACTIVE]: 'opening',
        [CLOSED]: 'closed',
    }[order?.status]


    const isClosePrice = order?.status === CLOSED
    if (isClosePrice) {
        price = order?.open_price
    } else {
        closePrice = order?.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask
        profit = getProfitVndc(order, closePrice)
    }
    const _percent = ((isClosePrice ? order?.profit : profit) / order?.margin) * 100;
    const shareData = {
        leverage: order?.leverage,
        profit: formatNumber(isClosePrice ? order?.profit : profit, 0, 0, true),
        percent: (_percent > 0 ? '+' : '') + formatNumber(_percent, 2, 0, true) + '%',
        price: formatNumber(price, 8),
        markPrice: formatNumber(closePrice, 8),
        closePrice: formatNumber(order?.close_price, 8),
        symbol: order?.symbol,
        side: order?.side,
        time: formatTime(order?.created_at),
        quoteAsset: pairPrice?.quoteAsset ?? '',
        bg: _percent > 0 ? 'green' : 'red',
        status,
        id: order?.displaying_id,
        type: 'share'
    }
    return shareData
}

