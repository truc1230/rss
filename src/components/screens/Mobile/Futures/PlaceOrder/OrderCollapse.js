import React, { memo, useContext, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { emitWebViewEvent, formatCurrency, formatNumber, getS3Url } from 'redux/actions/utils';
import OrderBalance from 'components/screens/Mobile/Futures/TabOrders/OrderBalance';
import TradingLabel from 'components/trade/TradingLabel';
import { useSelector } from 'react-redux';
import { placeFuturesOrder } from 'redux/actions/futures';
import { AlertContext } from 'components/common/layouts/LayoutMobile';

const OrderCollapse = ({ pairConfig, size, pairPrice, decimals, leverage, isAuth, marginAndValue, availableAsset, quoteQty, isError }) => {
    const { t } = useTranslation();
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const context = useContext(AlertContext);
    const [disabled, setDisabled] = useState(false)

    const onOrder = (side, price) => {
        if (disabled || isError) return;
        setDisabled(true);
        const sl = price - ((side === VndcFutureOrderType.Side.BUY ? price : -price) * 0.05)
        const tp = price + ((side === VndcFutureOrderType.Side.SELL ? -price : price) * 0.05)
        const params = {
            symbol: pairConfig?.symbol,
            type: VndcFutureOrderType.Type.MARKET,
            side: side,
            quantity: size,
            price,
            leverage,
            sl: +sl.toFixed(decimals.decimalScalePrice),
            tp: +tp.toFixed(decimals.decimalScalePrice),
            quoteQty,
            useQuoteQty: true
        };
        placeFuturesOrder(params, { alert: context?.alert }, t, () => {
            setDisabled(false)
        })
    }
    const openDeposit = () => {
        emitWebViewEvent('deposit')
    }

    const style = () => {
        const el = document.querySelector('.order-collapse .diff-price')
        return { width: el && el?.clientWidth ? `calc(100% - ${el.clientWidth / 2}px)` : '100%' }
    }

    const disabledClass = isError || disabled || !isAuth;
    const className = disabledClass ? 'opacity-[0.3] cursor-not-allowed' : '';
    const _quoteQty = String(quoteQty).length > 7 ? formatCurrency(quoteQty) : formatNumber(
        quoteQty,
        decimals.decimalScaleQtyLimit
    )
    return (
        <div className="w-full">
            <div className="relative flex w-full h-[56px] text-sm order-collapse">
                <Side className={`bg-onus-green rounded-l-[6px] text-white ${className} ${disabledClass ? 'border-[1px] border-onus-green' : ''}`}
                    onClick={() => onOrder(VndcFutureOrderType.Side.BUY, pairPrice?.ask)}>
                    <div className={`truncate`} style={style()}>{t('common:buy')}&nbsp;
                        {_quoteQty}&nbsp;{pairConfig?.quoteAsset ?? ''}
                    </div>
                    <span>{formatNumber(pairPrice?.ask, decimals.decimalScalePrice, 0, true)}</span>
                </Side>
                <Text className={`diff-price ${disabledClass ? 'bg-onus-bg2 !text-onus-grey' : ''}`}>
                    {formatNumber(pairPrice?.ask - pairPrice?.bid, decimals.decimalScalePrice, 0, true)}
                </Text>
                <Side className={`bg-onus-red rounded-r-[6px] text-white items-end ${className} ${disabledClass ? 'border-[1px] border-onus-red' : ''}`}
                    onClick={() => onOrder(VndcFutureOrderType.Side.SELL, pairPrice?.bid)}>
                    <div className={`truncate text-right`} style={style()}>{t('common:sell')}&nbsp;
                        {_quoteQty}&nbsp;{pairConfig?.quoteAsset ?? ''}</div>
                    <span>{formatNumber(pairPrice?.bid, decimals.decimalScalePrice, 0, true)}</span>
                </Side>
            </div>
            {ordersList.length > 0 ?
                <OrderBalance mode={'collapse'} ordersList={ordersList} visible={true} />
                :
                <div className="flex pt-[10px]">
                    <TradingLabel
                        label={t('futures:margin')}
                        value={`${marginAndValue?.marginLength > 7 ? formatCurrency(marginAndValue?.margin) : formatNumber(
                            marginAndValue?.margin,
                            pairConfig?.pricePrecision || 2
                        )}`}
                        containerClassName='text-xs flex justify-between w-1/2 pb-[5px]'
                    />
                    <TradingLabel
                        label={t('futures:mobile:available')}
                        value={<div className="flex items-center">{formatNumber(availableAsset ?? 0, 0)}&nbsp;&nbsp;<img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' onClick={openDeposit} /></div>}
                        containerClassName={`text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]`}
                    />
                </div>
            }
        </div>
    );
};

// const Equity = memo(({ ordersList }) => {
//     const { t } = useTranslation();
//     return (
//         <div className="flex pt-[10px]">
//             <TradingLabel
//                 label={t('futures:mobile:pnl')}
//                 value={<Balance ordersList={ordersList} mode='pnl' />}
//                 containerClassName={`text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]`}
//             />
//             <TradingLabel
//                 label={t('futures:mobile:equity')}
//                 value={<Balance ordersList={ordersList} mode='equity' />}
//                 containerClassName='text-xs flex justify-between w-1/2 pb-[5px]'
//             />
//         </div>
//     )
// })

const Side = styled.div.attrs({
    className: 'w-1/2 px-[16px] flex justify-center flex-col font-medium'
})`
`

const Text = styled.div.attrs({
    className: 'absolute font-medium bg-onus-input text-onus-white text-xs rounded-[6px] px-[15px] py-[4px] left-[50%] top-[50%] z-[10]'
})`
transform:translate(-50%, -50%)
`

export default OrderCollapse;
