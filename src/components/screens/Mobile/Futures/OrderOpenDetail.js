import React, { useContext, useMemo, useRef, useState, useEffect } from 'react';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import { OrderItem } from './TabOrders/OrderItemMobile';
import { useSelector } from 'react-redux';
import {
    getProfitVndc,
    renderCellTable,
    VndcFutureOrderType
} from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
// import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc';
import { emitWebViewEvent, formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import Button from 'components/common/Button';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { ApiStatus, DefaultFuturesFee, FuturesOrderEnum } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { getShareModalData } from 'components/screens/Mobile/Futures/TabOrders/ShareFutureMobile';
import AdjustPositionMargin from 'components/screens/Mobile/Futures/AdjustPositionMargin';
import EditSLTPVndcMobile from './EditSLTPVndcMobile';

const OrderOpenDetail = ({
    order,
    isDark,
    pairConfig,
    decimalPrice = 0,
    onClose,
    forceFetchOrder,
    isTabHistory,
    decimalSymbol = 0,
    isVndcFutures
}) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const status = order?.status;
    const isTabOpen = status === 0 || status === 3;
    const oldOrder = useRef(order);
    const [data, setData] = useState({
        displaying_id: order?.displaying_id,
        price: +(status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price),
        sl: +order?.sl,
        tp: +order?.tp,
    });
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const dataMarketWatch = marketWatch[order?.symbol];
    const profit = dataMarketWatch && getProfitVndc(order, order?.side === VndcFutureOrderType.Side.BUY ? dataMarketWatch?.bid : dataMarketWatch?.ask);
    const marginRatio = (profit / order?.margin) * 100;
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const [showEditMargin, setShowEditMargin] = useState(false);
    const rowData = useRef(null);
    const [loading, setLoading] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const checkSocket = useRef(false);

    useEffect(() => {
        if (!pairConfig || !publicSocket) return;
        publicSocket.emit('subscribe:futures:mini_ticker', pairConfig?.symbol)
        return () => {
            pairConfig?.symbol && publicSocket.emit('unsubscribe:futures:mini_ticker', pairConfig?.symbol)
        }
    }, [pairConfig, publicSocket])

    const onConfirmSLTP = (e) => {
        // setData(e);
        setDisabled(true);
        fetchOrder('PUT', e, () => {
            localStorage.setItem('edited_id', e.displaying_id);
            context.alert.show('success', t('common:success'), t('futures:modify_order_success'));
            setShowEditSLTP(!showEditSLTP);
            forceFetchOrder();
        });
    };

    const onOpenModify = () => {
        rowData.current = {
            ...order,
            quoteAsset: pairConfig?.quoteAsset
        };
        // rowData.current = { ...oldOrder.current, ...data, quoteAsset: pairConfig?.quoteAsset };
        setShowEditSLTP(!showEditSLTP);
    };

    const onActions = (isDiff) => {
        if (!isDiff) {
            context.alert.show('warning',
                t('futures:close_order:modal_title', { value: order?.displaying_id }),
                t('futures:close_order:confirm_message', { value: order?.displaying_id }),
                null,
                () => {
                    const params = {
                        displaying_id: order?.displaying_id,
                        special_mode: 1
                    };
                    fetchOrder('DELETE', params, () => {
                        context.alert.show('success', t('common:success'),
                            t('futures:close_order:request_successfully', { value: order?.displaying_id }),
                            undefined,
                            undefined,
                            () => {
                                if (onClose) onClose();
                            }
                        );
                    });
                }
            );
        } else {
            fetchOrder('PUT', data, () => {
                oldOrder.current = { ...oldOrder.current, ...data };
                forceFetchOrder();
                localStorage.setItem('edited_id', data.displaying_id);
                context.alert.show('success', t('common:success'), t('futures:modify_order_success'));
            });
        }
    };

    const fetchOrder = async (method = 'DELETE', params, cb) => {
        setLoading(true);
        try {
            const {
                status,
                data,
                message
            } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method },
                params: params,
            });
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data?.orders);
            } else {
                const requestId = data?.data?.requestId && `(${data?.data?.requestId.substring(0, 8)})`
                context.alert.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`), requestId);
            }
        } catch (e) {
            if (e.message === 'Network Error' || !navigator?.onLine) {
                context.alert.show('error', t('common:failed'), t('error:futures:NETWORK_ERROR'));
            }
            console.log(e);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setDisabled(false)
            }, 1000);
        }
    };

    const renderLiqPrice = (row, returnNumber) => {
        const size = (row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity);
        const number = (row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1);
        const liqPrice = (size * row?.open_price + row?.fee - row?.margin) / (row?.quantity * (number - DefaultFuturesFee.NamiFrameOnus));
        if (returnNumber) row?.status === VndcFutureOrderType.Status.ACTIVE ? liqPrice : 0;
        return row?.status === VndcFutureOrderType.Status.ACTIVE && liqPrice > 0 ? formatNumber(liqPrice, decimalPrice, 0, true) : '-';
    };

    const renderSlTp = (value) => {
        if (value) {
            return formatNumber(value);
        }
        return t('futures:not_set');
    };

    // const isDiff = useMemo(() => {
    //     return oldOrder.current?.sl !== data.sl || oldOrder.current?.tp !== data.tp || (status === VndcFutureOrderType.Status.PENDING && oldOrder.current?.price !== data.price)
    // }, [data, oldOrder.current])

    const price = useMemo(() => {
        return +(status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price);
    }, [order]);

    const openShare = () => {
        if (!profit) return null;
        const emitData = getShareModalData({ order, pairPrice: dataMarketWatch })
        emitWebViewEvent(JSON.stringify(emitData))
    }


    const renderColorMarginRatio = () => {
        const _marginRatio = Math.abs(marginRatio);
        return marginRatio < 0 && `text-onus-${_marginRatio <= 20 ? 'green' : _marginRatio > 20 && _marginRatio <= 60 ? 'orange' : 'red'}`
    }

    const renderQuoteprice = () => {
        const value = order?.side === VndcFutureOrderType.Side.BUY ? dataMarketWatch?.bid : dataMarketWatch?.ask;
        return formatNumber(value)
    }

    const orderStatus = useMemo(() => {
        const pending = !isTabHistory && order.status === VndcFutureOrderType.Status.PENDING || order.status === VndcFutureOrderType.Status.REQUESTING;
        return { pending }
    }, [order])

    return (
        <div className="p-6 py-5 mx-[-24px] border-b border-onus-line">
            {showEditSLTP &&
                <EditSLTPVndcMobile
                    onusMode={true}
                    isVisible={showEditSLTP}
                    order={rowData.current}
                    onClose={() => !disabled && setShowEditSLTP(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirmSLTP}
                    lastPrice={dataMarketWatch?.lastPrice}
                    isMobile
                    disabled={disabled}
                />
            }
            {
                showEditMargin &&
                <AdjustPositionMargin
                    order={order}
                    pairPrice={dataMarketWatch}
                    onClose={() => setShowEditMargin(false)}
                    forceFetchOrder={forceFetchOrder}
                />
            }
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[2px]">
                    {/* <SideComponent isDark={isDark} isBuy={order.side === VndcFutureOrderType.Side.BUY}>{renderCellTable('side', order)}</SideComponent> */}
                    <div className="flex items-center">
                        <div className="font-semibold leading-[1.375rem] mr-[5px]">{(pairConfig?.baseAsset ?? '-') + '/' + (pairConfig?.quoteAsset ?? '-')}</div>
                        <div className="text-onus-white bg-onus-bg3 text-[10px] font-medium leading-3 py-[2px] px-[10px] rounded-[2px]">{order?.leverage}x
                        </div>
                        {profit ?
                            <img className="ml-2"
                                onClick={openShare} src={getS3Url("/images/icon/ic_share_onus.png")} height={20} width={20} />
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
                    {orderStatus.pending ?
                        <div className={`bg-onus-bg3 py-[5px] px-4 rounded-[100px] font-semibold text-xs ${orderStatus.cancelled ? 'text-onus-grey' : 'text-onus-orange bg-onus-orange/[0.1]'}`}>
                            {t(`futures:mobile:${orderStatus.cancelled ? 'cancelled_order' : 'pending_order'}`)}
                        </div>
                        :
                        <div className="text-xs text-right" onClick={openShare}>
                            <div className="text-xs font-medium text-onus-green float-right">
                                <OrderProfit onusMode={true} className="flex flex-col text-right" decimal={isVndcFutures ? decimalSymbol : decimalSymbol + 2}
                                    order={order} pairPrice={dataMarketWatch} isTabHistory={false} isMobile />
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="mt-2 flex items-center text-[10px] font-medium text-onus-grey mb-3 opacity-[0.6] leading-[1.125rem]">
                <div>ID #{order?.displaying_id}</div>
                <div className="bg-[#535D6D] h-[2px] w-[2px] rounded-[50%] mx-1.5"></div>
                <div>{formatTime(order?.created_at, 'yyyy-MM-dd HH:mm:ss')}</div>
            </div>
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
                        value={formatNumber(price, decimalPrice, 0, true)}
                    />
                </div>
            }
            <div className="flex flex-wrap w-full">
                <OrderItem label={t('futures:order_table:volume')}
                    value={formatNumber(order?.order_value, decimalSymbol, 0, true)} />
                {!isTabOpen ?
                    <OrderItem label={t('futures:order_table:open_price')} value={formatNumber(price, decimalPrice, 0, true)} />
                    :
                    <OrderItem label={t('futures:calulator:liq_price')} value={renderLiqPrice(order)} />
                }
                <OrderItem
                    label={t('futures:margin')}
                    value={order?.margin ? formatNumber(order?.margin, decimalSymbol, 0, false) : '-'}
                />
                {!isTabOpen && <>
                    <OrderItem label={t('futures:calulator:liq_price')} value={renderLiqPrice(order)} />
                    <OrderItem
                        label={t('futures:mobile:quote_price')}
                        value={renderQuoteprice()}
                    />
                </>
                }
                <OrderItem label={t('futures:stop_loss')} valueClassName={order?.sl > 0 ? 'text-onus-red' : 'text-onus-white'} value={renderSlTp(order?.sl)} />
                <OrderItem label={t('common:last_price')}
                    value={formatNumber(dataMarketWatch?.lastPrice, decimalPrice, 0, true)} />
                <OrderItem label={t('futures:take_profit')} valueClassName={order?.tp > 0 ? 'text-onus-green' : 'text-onus-white'}
                    value={renderSlTp(order?.tp)} />
            </div>
            <div className="flex w-full mt-4 space-x-2">
                {
                    order.status === VndcFutureOrderType.Status.ACTIVE &&
                    <div className="w-full">
                        <Button
                            title={t('futures:mobile.adjust_margin.button_title')}
                            className="!h-[36px] bg-onus-bg3 !text-onus-grey !font-semibold"
                            componentType="button"
                            type="primary"
                            onClick={() => setShowEditMargin(true)}
                        />
                    </div>
                }
                <div className="w-full">
                    <Button
                        title={t('futures:tp_sl:modify_tpsl')}
                        className="!h-[36px] bg-onus-bg3 !text-onus-grey !font-semibold"
                        componentType="button"
                        type="primary"
                        onClick={onOpenModify}
                    />
                </div>
                <div className="w-full">
                    <Button
                        title={t(`common:close`)}
                        className="!h-[36px] bg-onus-bg3 !text-onus-grey !font-semibold"
                        componentType="button"
                        type="primary"
                        onClick={() => onActions()}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderOpenDetail;
