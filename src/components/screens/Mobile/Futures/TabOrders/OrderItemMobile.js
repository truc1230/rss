import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import { useTranslation } from 'next-i18next';
import {
    getProfitVndc,
    renderCellTable,
    VndcFutureOrderType
} from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import Big from 'big.js';
import { DefaultFuturesFee, FuturesOrderEnum } from 'redux/actions/const';
import { FUTURES_RECORD_CODE } from 'components/screens/Futures/TradeRecord/RecordTableTab';

const OrderItemMobile = ({
    order,
    isBuy,
    dataMarketWatch,
    onShowModal,
    mode,
    isDark,
    onShowDetail,
    symbol,
    allowButton,
    tab,
    decimalSymbol = 0,
    decimalScalePrice = 0,
    isVndcFutures
}) => {
    const { t } = useTranslation();
    const isTabHistory = mode === 'history';
    const isTabOpen = tab === FUTURES_RECORD_CODE.openOrders;

    const getOpenPrice = (row, pairPrice) => {
        let text = row?.price ? formatNumber(row?.price, 8, 0, true) : 0;
        switch (row.status) {
            case VndcFutureOrderType.Status.PENDING:
                let bias = null;
                const value = row['price'];
                if (!pairPrice) return null
                const openPrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.ask : pairPrice?.bid;
                const closePrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask;
                if (pairPrice?.lastPrice > 0 && value > 0) {
                    let biasValue = +Big(value).minus(openPrice);
                    const formatedBias = formatNumber(biasValue, 8, 0, true);
                    bias =
                        biasValue > 0 ? (
                            <span>
                                (<span className="text-onus-green">+{formatedBias}</span>)
                            </span>
                        ) : (
                            <span>
                                (<span className="text-onus-red">{formatedBias}</span>)
                            </span>
                        );
                }
                text = row.price ? formatNumber(row.price, 8) : '';
                return <div className="flex items-center text-right ">
                    <div>{text}</div>
                </div>;
            case VndcFutureOrderType.Status.ACTIVE:
                text = row.open_price ? formatNumber(row.open_price, 8) : '';
                return <div>{text}</div>;
            case VndcFutureOrderType.Status.CLOSED:
                text = row.close_price ? formatNumber(row.close_price, 8) : '';
                return <div>{text}</div>;
            default:
                return <div>{text}</div>;

        }
    }

    const renderLiqPrice = (row) => {
        const size = (row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity)
        const number = (row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1);
        const liqPrice = (size * row?.open_price + row?.fee - row?.margin) / (row?.quantity * (number - DefaultFuturesFee.NamiFrameOnus))
        return row?.status === VndcFutureOrderType.Status.ACTIVE && liqPrice > 0 ? formatNumber(liqPrice, decimalScalePrice, 0, false) : '-'
    }

    const renderReasonClose = (row) => {
        switch (row?.reason_close_code) {
            case 0:
                return t('futures:order_history:normal')
            case 1:
                return t('futures:order_history:hit_sl')
            case 2:
                return t('futures:order_history:hit_tp')
            case 3:
                return t('futures:order_history:liquidate')
            default:
                return '';
        }
    }

    const renderSlTp = (value) => {
        if (value) {
            return formatNumber(value)
        }
        return t('futures:not_set')
    }


    const isModal = useRef(false);

    const actions = (action, key) => {
        if (action === 'modal') {
            isModal.current = true;
            const shareData = {}
            onShowModal(order, key)
        }
        if (action === 'delete') {
            isModal.current = true;
            onShowModal(order, 'delete')
        }
        if (action === 'detail' && order?.status !== VndcFutureOrderType.Status.REQUESTING) {
            if (isModal.current) {
                isModal.current = false;
                return;
            }
            onShowDetail(order, isTabHistory)
        }

    }

    let profit = 0
    let marginRatio = 0
    if (isTabHistory) {
        profit = order?.profit
        marginRatio = (profit / order?.margin) * 100;
    } else {
        if (order && dataMarketWatch) {
            profit = getProfitVndc(order, order?.side === VndcFutureOrderType.Side.BUY ? dataMarketWatch?.bid : dataMarketWatch?.ask);
            marginRatio = (profit / order?.margin) * 100;
        }
    }

    const renderColorMarginRatio = () => {
        const _marginRatio = Math.abs(marginRatio);
        return marginRatio < 0 && `text-onus-${_marginRatio <= 20 ? 'green' : _marginRatio > 20 && _marginRatio <= 60 ? 'orange' : 'red'}`
    }

    const renderQuoteprice = () => {
        const value = order?.side === VndcFutureOrderType.Side.BUY ? dataMarketWatch?.bid : dataMarketWatch?.ask;
        return formatNumber(value, decimalScalePrice)
    }

    const orderStatus = useMemo(() => {
        const cancelled = isTabHistory && (order.status === VndcFutureOrderType.Status.PENDING ||
            (order.status === VndcFutureOrderType.Status.CLOSED && !order?.close_price && order?.type !== VndcFutureOrderType.Type.MARKET));
        const pending = !isTabHistory && order.status === VndcFutureOrderType.Status.PENDING || order.status === VndcFutureOrderType.Status.REQUESTING;
        return { cancelled, pending }
    }, [order])
    // const profit = isTabHistory ? order?.profit : dataMarketWatch && getProfitVndc(order, dataMarketWatch?.lastPrice)

    return (
        <div className="flex flex-col mx-[-16px] p-[16px] border-b-[1px] border-onus-line"
            onClick={() => onShowDetail && actions('detail')}
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[2px]">
                    {/* <SideComponent isDark={isDark} isBuy={order.side === VndcFutureOrderType.Side.BUY}>{renderCellTable('side', order)}</SideComponent> */}
                    <div className="flex items-center">
                        <div className="font-semibold leading-[1.375rem] mr-[5px]">{(symbol?.baseAsset ?? '-') + '/' + (symbol?.quoteAsset ?? '-')}</div>
                        <div className="text-onus-white bg-onus-bg3 text-[10px] font-medium leading-3 py-[2px] px-[10px] rounded-[2px]">{order?.leverage}x
                        </div>
                        {profit ?
                            <img className="ml-2"
                                onClick={() => actions('modal', 'share')}
                                src={getS3Url("/images/icon/ic_share_onus.png")} height={20} width={20} />
                            : null
                        }
                    </div>
                    <div
                        className={`text-xs font-medium ${order.side === FuturesOrderEnum.Side.BUY ? 'text-onus-green' : 'text-onus-red'}`}>
                        <span>{renderCellTable('side', order)}</span>&nbsp;/&nbsp;
                        <span>{renderCellTable('type', order)}</span>
                    </div>

                </div>
                <div className="flex items-center">
                    {orderStatus.cancelled || orderStatus.pending ?
                        <div className={`bg-onus-bg3 py-[5px] px-4 rounded-[100px] font-semibold text-xs ${orderStatus.cancelled ? 'text-onus-grey' : 'text-onus-orange bg-onus-orange/[0.1]'}`}>
                            {t(`futures:mobile:${orderStatus.cancelled ? 'cancelled_order' : 'pending_order'}`)}
                        </div>
                        :
                        <>
                            <div className="text-xs text-right" onClick={() => profit && actions('modal', 'share')}>
                                <div className="text-xs font-medium text-onus-green float-right">
                                    <OrderProfit onusMode={true} className="flex flex-col"
                                        order={order} pairPrice={dataMarketWatch} isTabHistory={isTabHistory}
                                        isMobile decimal={isVndcFutures ? decimalSymbol : decimalSymbol + 2} />
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="mt-2 flex items-center text-[10px] font-medium text-onus-grey mb-3 opacity-[0.6] leading-[1.125rem]">
                <div>ID #{order?.displaying_id}</div>
                <div className="bg-[#535D6D] h-[2px] w-[2px] rounded-[50%] mx-1.5"></div>
                <div>{formatTime(order?.created_at, 'yyyy-MM-dd HH:mm:ss')}</div>
            </div>
            <div>
                {isTabOpen &&
                    <div className="flex items-center justify-between mb-2">
                        <OrderItem
                            className="flex flex-col gap-[2px]"
                            valueClassName='!text-left !text-sm'
                            label={t('futures:mobile:quote_price')}
                            value={renderQuoteprice()}
                        />
                        <OrderItem
                            className="flex flex-col gap-[2px]"
                            label={t('futures:order_table:open_price')}
                            valueClassName='!text-left !text-sm'
                            value={isTabHistory ? order?.open_price ? formatNumber(order?.open_price, decimalScalePrice, 0, false) : '-' : getOpenPrice(order, dataMarketWatch)}
                        />
                    </div>
                }
                <div className="flex flex-wrap w-full">
                    <OrderItem label={t('futures:order_table:volume')}
                        value={order?.order_value ? formatNumber(order?.order_value, decimalSymbol, 0, true) : '-'} />
                    {isTabOpen ?
                        <OrderItem
                            label={t(isTabHistory ? 'futures:mobile:reason_close' : `futures:mobile:liq_price`)}
                            value={isTabHistory ? renderReasonClose(order) : renderLiqPrice(order)}
                        />
                        :
                        <OrderItem
                            label={t('futures:order_table:open_price')}
                            value={isTabHistory ? order?.open_price ? formatNumber(order?.open_price, 8, 0, false) : '-' : getOpenPrice(order, dataMarketWatch)}
                        />
                    }
                    <OrderItem
                        label={t('futures:margin')}
                        value={order?.margin ? formatNumber(order?.margin, decimalSymbol, 0, false) : '-'}
                    />
                    {!isTabOpen &&
                        <OrderItem
                            label={t(isTabHistory ? 'futures:mobile:reason_close' : `futures:mobile:liq_price`)}
                            value={isTabHistory ? renderReasonClose(order) : renderLiqPrice(order)}
                        />
                    }
                    {!isTabOpen && (isTabHistory ?
                        <OrderItem
                            label={t('futures:mobile:margin_ratio')}
                            value={marginRatio >= 0 ? '-' : formatNumber(marginRatio, 2, 0, true).replace('-', '') + '%'}
                            valueClassName={renderColorMarginRatio()}
                        />
                        :
                        <OrderItem
                            label={t('futures:mobile:quote_price')}
                            value={renderQuoteprice()}
                        />
                    )}
                    <OrderItem
                        label={t('futures:stop_loss')}
                        value={renderSlTp(order?.sl)}
                        valueClassName={order?.sl > 0 ? 'text-onus-red' : 'text-onus-white'}
                    />
                    <OrderItem
                        label={isTabHistory ? t(`futures:order_table:close_price`) : t('common:last_price')}
                        value={isTabHistory ? (order?.close_price ? formatNumber(isTabHistory ? order?.close_price : dataMarketWatch?.lastPrice) : '-') : formatNumber(isTabHistory ? order?.close_price : dataMarketWatch?.lastPrice)}
                    />
                    <OrderItem
                        label={t('futures:take_profit')}
                        value={renderSlTp(order?.tp)}
                        valueClassName={order?.tp > 0 ? 'text-onus-green' : 'text-onus-white'}
                    />
                </div>
            </div>
            {allowButton &&
                <div className="flex items-center justify-between space-x-2 mt-4">
                    {
                        order.status === VndcFutureOrderType.Status.ACTIVE &&
                        <Button
                            className="bg-onus-bg3 text-onus-gray !h-[36px]"
                            onClick={() => actions('modal', 'edit-margin')}> {t('futures:mobile.adjust_margin.button_title')}</Button>
                    }
                    <Button
                        className="bg-onus-bg3 text-onus-gray !h-[36px]"
                        onClick={() => actions('modal', 'edit')}> {t('futures:tp_sl:modify_tpsl')}</Button>
                    <Button
                        className="bg-onus-bg3 text-onus-gray !h-[36px]"
                        onClick={() => actions('delete')}>{t('common:close')}</Button>
                </div>
            }
        </div>
    );
};

export const SideComponent = styled.div.attrs(({ isBuy }) => ({
    className: `flex items-center justify-center font-medium mr-[12px]`
}))`
    width: 38px;
    height: 38px;
    border-radius: 2px;
    background-color: ${({ isBuy, isDark }) => isBuy ? (isDark ? '#00c8bc1a' : colors.lightTeal) : colors.lightRed2};
    color: ${({ isBuy }) => isBuy ? colors.teal : colors.red2};
    font-size: 10px
`
const Row = styled.div.attrs({
    className: `flex mb-1 justify-between mr-[10px]`
})`
    width: calc(50% - 5px);

    :nth-child(2n+2) {
        margin: 0
    }

    :nth-last-child(2) {
        margin-bottom: 0
    }
`

const Label = styled.div.attrs({
    className: `text-xs text-onus-grey min-w-[50px] leading-[1.25rem]`
})``

const Button = styled.div.attrs({
    className: `text-onus-grey bg-gray-4 rounded-[4px] h-[30px] flex items-center justify-center text-xs font-semibold`
})`
    width: calc(50% - 4px)
`

export const OrderItem = ({ label, value, className = '', valueClassName = '' }) => {
    return (
        <Row className={`${className} justify-between`}>
            <Label>{label}</Label>
            <div className={`leading-[1.25rem] text-xs font-medium text-right ${valueClassName}`}>{value}</div>
        </Row>
    )
}

export default OrderItemMobile;
