import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ArrowRight, Copy } from 'react-feather';
import { renderCellTable, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import styled from 'styled-components';
import { countDecimals, emitWebViewEvent, formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import OrderOpenDetail from './OrderOpenDetail';
import Tooltip from 'components/common/Tooltip';
import { THEME_MODE } from 'hooks/useDarkMode';
import dynamic from 'next/dynamic';
import { listTimeFrame, MenuTime } from 'components/TVChartContainer/MobileTradingView/ChartOptions';
import { useRouter } from 'next/router';
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ApiStatus, ChartMode } from 'redux/actions/const';
import colors from 'styles/colors';
import SocketLayout from 'components/screens/Mobile/Futures/SocketLayout'
const MobileTradingView = dynamic(
    () => import('components/TVChartContainer/MobileTradingView').then(mode => mode.MobileTradingView),
    { ssr: false },
);

const getAssets = createSelector(
    [
        state => state.utils,
        (utils, params) => params
    ],
    (utils, params) => {
        const assets = {};
        return Object.keys(params)
            .reduce((newItem, item) => {
                const asset = utils.assetConfig.find(rs => rs.id === params[item].currency);
                if (asset) {
                    assets[item] = {
                        assetCode: asset?.assetCode,
                        assetDigit: asset?.assetDigit
                    };
                }
                return assets;
            }, {});
    }
);

const OrderDetail = ({
    order,
    pairConfig,
    pairParent,
    isTabHistory = false,
    isDark,
    getDetail,
    isModal,
    onClose,
    isVndcFutures
}) => {
    const router = useRouter();
    const { t } = useTranslation();
    const assetConfig = useSelector(state => getAssets(state, {
        ...order?.fee_metadata,
        swap: { currency: order?.margin_currency },
        order_value: { currency: order?.order_value_currency }
    }));
    const decimalSymbol = assetConfig?.['order_value']?.assetDigit ?? 0;
    const [resolution, setResolution] = useState('15');
    const [dataSource, setDataSource] = useState([])
    const [chartKey, setChartKey] = useState('nami-mobile-chart')

    const renderReasonClose = (row) => {
        switch (row?.reason_close_code) {
            case 0:
                return t('futures:order_history:normal');
            case 1:
                return t('futures:order_history:hit_sl');
            case 2:
                return t('futures:order_history:hit_tp');
            case 3:
                return t('futures:order_history:liquidate');
            default:
                return '-';
        }
    };

    const renderFee = (order, key) => {
        if (!order) return '-';
        const assetDigit = assetConfig ? assetConfig[key]?.assetDigit : 0
        const decimal = isVndcFutures ? assetDigit : assetDigit + 2;
        const assetCode = assetConfig ? assetConfig[key]?.assetCode : '';
        const data = order?.fee_metadata[key] ? order?.fee_metadata[key]['value'] : order[key];
        return data ? formatNumber(data, decimal) + ' ' + assetCode : '-';
    };

    const getValue = (number) => {
        if (number) {
            return formatNumber(number, decimalSymbol, 0, true);
        } else {
            return t('futures:not_set')
        }
    };
    const renderSlTp = (value) => {
        if (value) {
            return formatNumber(value)
        }
        return t('futures:not_set')
    }

    const getColor = (key, value) => {
        if (key === 'tp') {
            return value > 0 ? '' : '!text-onus-white'
        } else {
            return value > 0 ? '' : '!text-onus-white'
        }
    }


    const renderModify = (metadata, key) => {
        let value = null;
        switch (key) {
            case 'price':
                value = metadata?.modify_price ?
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_price?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right"> {getValue(metadata?.modify_price?.after)}</div>
                    </div> : getValue(metadata?.price);
                return value;
            case 'take_profit':
                value = metadata?.modify_tp ?
                    <div className="flex items-center justify-between">
                        <div className={`text-left ${getColor('tp', metadata?.modify_tp?.before)}`}>
                            {getValue(metadata?.modify_tp?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className={`text-right ${getColor('tp', metadata?.modify_tp?.after)}`}>
                            {getValue(metadata?.modify_tp?.after)}</div>
                    </div> : null;
                return value;
            case 'stop_loss':
                value = metadata?.modify_sl ?
                    <div className="flex items-center justify-between">
                        <div className={`text-left ${getColor('sl', metadata?.modify_sl?.before)}`}>
                            {getValue(metadata?.modify_sl?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className={`text-right ${getColor('sl', metadata?.modify_sl?.after)}`}>
                            {getValue(metadata?.modify_sl?.after)} </div>
                    </div> : null;
                return value;
            case 'margin':
                value = metadata?.modify_margin ?
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_margin?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right">{getValue(metadata?.modify_margin?.after)} </div>
                    </div> : null;
                return value;

            default:
                return value;
        }
    };

    const decimalPrice = useMemo(() => {
        const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
        return countDecimals(decimalScalePrice?.tickSize) ?? 0;
    }, [pairConfig]);

    const forceFetchOrder = (data) => {
        if (!isModal) {
            getDetail();
        }
    };

    useEffect(() => {
        if (isModal) {
            getAdjustmentDetail();
        } else {
            emitWebViewEvent('order_detail')
        }
    }, [])

    const oldOrder = useRef(null);
    useEffect(() => {
        if (!isModal) {
            setDataSource(order?.futuresorderlogs ?? [])
        } else {
            if (JSON.stringify(oldOrder.current) === JSON.stringify(order)) return;
            oldOrder.current = order;
            getAdjustmentDetail();
        }
    }, [order, isModal])

    const getAdjustmentDetail = async () => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_ORDER_DETAIL,
                options: { method: 'GET' },
                params: {
                    orderId: order.displaying_id
                },
            })
            if (status === ApiStatus.SUCCESS) {
                setDataSource(data?.futuresorderlogs ?? [])
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const resolutionLabel = useMemo(() => {
        return listTimeFrame.find(item => item.value === resolution)?.text;
    }, [resolution]);

    const orderList = useMemo(() => [order], [order])
    const classNameSide = order?.side === VndcFutureOrderType.Side.BUY ? 'text-onus-green' : 'text-onus-red';
    const decimalUsdt = assetConfig?.swap?.assetDigit ?? 0;
    return (
        <div className={'bg-onus overflow-hidden'} >
            <div className="relative overflow-auto h-full overflow-x-hidden">
                <div
                    className="relative w-full bg-onus z-[10] flex items-center justify-between min-h-[50px] px-[16px]"
                >
                    <div className="flex items-center" onClick={() => onClose && onClose()}>
                        {/* <ChevronLeft size={24} /> */}
                        {/* <span className="font-medium text-sm">{t('common:back')}</span> */}
                    </div>
                    <div
                        className="flex flex-col justify-center items-center mt-[10px] absolute translate-x-[-50%] left-1/2">
                        <span className="font-semibold">{pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}</span>
                        <span
                            className={`text-xs font-medium ${classNameSide}`}>{renderCellTable('side', order)} / {renderCellTable('type', order)}</span>
                    </div>
                    <MenuTime
                        value={resolution}
                        onChange={setResolution}
                        keyValue="value"
                        displayValue="text"
                        options={listTimeFrame}
                        classNameButton="pl-2 py-2"
                        classNamePanel="rounded-md right-0"
                        label={<div
                            className="text-sm text-onus-grey font-medium">{resolutionLabel}</div>}
                    />
                </div>

                <div className="shadow-order_detail py-[10px] bg-onus h-full">
                    <div className="min-h-[350px] spot-chart max-w-full" style={{ height: `calc(var(--vh, 1vh) * 100 - 300px)` }}>
                        <MobileTradingView
                            t={t}
                            key={chartKey}
                            containerId="nami-mobile-detail-tv"
                            symbol={order.symbol}
                            pairConfig={pairConfig}
                            initTimeFrame={resolution}
                            onIntervalChange={setResolution}
                            isVndcFutures={true}
                            ordersList={orderList}
                            theme={THEME_MODE.DARK}
                            mode={ChartMode.FUTURES}
                            showSymbol={false}
                            showIconGuide={false}
                            showTimeFrame={false}
                            // classNameChart="!h-[350px]"
                            styleChart={{ height: `calc(100% - 40px)` }}
                            renderProfit={order.status === VndcFutureOrderType.Status.CLOSED}
                            reNewComponentKey={() => setChartKey(Math.random().toString())} // Change component key will remount component
                        />
                    </div>
                    <div className="px-[16px] bg-onus">
                        {!isTabHistory &&
                            <SocketLayout pair={pairParent} pairConfig={pairConfig}>
                                <OrderOpenDetail order={order} decimalPrice={decimalPrice} isDark={isDark}
                                    pairConfig={pairConfig} onClose={onClose} decimalSymbol={decimalSymbol}
                                    forceFetchOrder={forceFetchOrder} isTabHistory={isTabHistory} isVndcFutures={isVndcFutures}
                                />
                            </SocketLayout>
                        }
                        <div className="pt-5">
                            <div className="font-semibold mb-4">{t('futures:mobile:order_detail')}</div>
                            <div className='bg-onus-bg3 px-3 rounded-lg'>
                                <Row>
                                    <Label>ID</Label>
                                    <Span className="flex items-center" onClick={() => navigator.clipboard.writeText(order?.displaying_id)}>
                                        {order?.displaying_id}
                                        <Copy color={colors.onus.grey} size={16} className="ml-2 " />
                                    </Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:leverage:leverage')}</Label>
                                    <Span className="text-onus-green">{order?.leverage}x</Span>
                                </Row>
                                {
                                    isTabHistory
                                    &&
                                    <Row>
                                        <Label>{t('futures:mobile:realized_pnl')}</Label>
                                        <Span className={+order?.profit > 0 ? 'text-onus-green' : 'text-onus-red'}>
                                            {formatNumber(order?.profit, isVndcFutures ? decimalUsdt : decimalUsdt + 2, 0, true)} ({formatNumber(order?.profit / order?.margin * 100, 2, 0, true)}%)</Span>
                                    </Row>}
                                <Row>
                                    <Label>{t('futures:order_table:volume')}</Label>
                                    <Span>{`${formatNumber(order?.order_value, assetConfig?.order_value?.assetDigit ?? 0)} (${formatNumber(order?.quantity, 6)} ${pairConfig?.baseAsset})`}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:margin')}</Label>
                                    <Span>{formatNumber(order?.margin, assetConfig?.swap?.assetDigit ?? 0)}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:mobile:open_time')}</Label>
                                    <Span>{formatTime(order?.opened_at, 'yyyy-MM-dd HH:mm:ss')}</Span>
                                </Row>
                                {order?.type !== VndcFutureOrderType.Type.MARKET && order.status === VndcFutureOrderType.Status.CLOSED && !order.open_price &&
                                    <Row>
                                        <Label>{t(`futures:${order?.type === VndcFutureOrderType.Type.LIMIT ? 'limit_price' : 'stop_price'}`)}</Label>
                                        <Span>{formatNumber(order?.price, decimalSymbol)}</Span>
                                    </Row>
                                }
                                <Row>
                                    <Label>{t('futures:order_table:open_price')}</Label>
                                    <Span>{order?.open_price ? formatNumber(order?.open_price, decimalSymbol) : '-'}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:mobile:close_time')}</Label>
                                    <Span>{order?.closed_at ? formatTime(order?.closed_at, 'yyyy-MM-dd HH:mm:ss') : '-'}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:order_table:close_price')}</Label>
                                    <Span>{order?.close_price ? formatNumber(order?.close_price, decimalSymbol) : '-'}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:mobile:reason_close')}</Label>
                                    <Span>{renderReasonClose(order)}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:take_profit')}</Label>
                                    <Span className={order?.tp > 0 ? 'text-onus-green' : 'text-onus-white'}>{renderSlTp(order?.tp)}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:stop_loss')}</Label>
                                    <Span className={order?.sl > 0 ? 'text-onus-red' : 'text-onus-white'}>{renderSlTp(order?.sl)}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:mobile:open_fee')}</Label>
                                    <Span>{renderFee(order, 'place_order')}</Span>
                                </Row>
                                <Row>
                                    <Label>{t('futures:mobile:close_fee')}</Label>
                                    <Span>{renderFee(order, 'close_order')}</Span>
                                </Row>
                                <Tooltip id="liquidate-fee" place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                                    className="!mx-7 !-mt-2 !px-3 !py-5 !bg-onus-bg2 !opacity-100 !rounded-lg after:!border-t-onus-bg2 after:!left-[30%]"
                                    overridePosition={(e) => ({
                                        left: 0,
                                        top: e.top
                                    })}
                                >
                                    <div>
                                        <label className="text-sm font-semibold">{t('futures:mobile:liquidate_fee')}</label>
                                        <div className="text-sm mt-3">{t('futures:mobile:info_liquidate_fee')}</div>
                                    </div>
                                </Tooltip>
                                <Row>
                                    <Label className="flex">
                                        {t('futures:mobile:liquidate_fee')}
                                        <div className="px-2" data-tip="" data-for="liquidate-fee" id="tooltip-liquidate-fee">
                                            <img src={getS3Url('/images/icon/ic_help.png')} height={20} width={20} />
                                        </div>
                                    </Label>
                                    <Span>{renderFee(order, 'liquidate_order')}</Span>
                                </Row>
                                <Tooltip id="swap-fee" place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                                    className="!mx-7 !-mt-2 !px-3 !py-5 !bg-onus-bg2 !opacity-100 !rounded-lg after:!border-t-onus-bg2 after:!left-[30%]"
                                    overridePosition={(e) => ({
                                        left: 0,
                                        top: e.top
                                    })}
                                >
                                    <div>
                                        <label className="text-sm font-semibold">{t('futures:mobile:swap_fee')}</label>
                                        <div className="text-sm mt-3">{t('futures:mobile:info_swap_fee')}</div>
                                    </div>
                                </Tooltip>
                                <Row>
                                    <Label className="flex">
                                        {t('futures:mobile:swap_fee')}
                                        <div className="px-2" data-tip="" data-for="swap-fee" id="tooltip-swap-fee">
                                            <img src={getS3Url('/images/icon/ic_help.png')} height={20} width={20} />
                                        </div>
                                    </Label>
                                    <Span>{renderFee(order, 'swap')}</Span>
                                </Row>
                            </div>
                        </div>
                        {dataSource.length > 0 &&
                            <div className="pb-2.5 pt-8">
                                <div className="font-semibold mb-4 text-lg">{t('futures:order_history:adjustment_history')}</div>
                                {dataSource.map((item, index) => (
                                    <div key={index}
                                        className="bg-onus-bg3 px-3 rounded-lg mb-3">
                                        <Row>
                                            <Label>{t('common:time')}</Label>
                                            <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss')}</Span>
                                        </Row>
                                        {item?.metadata?.modify_tp &&
                                            <Row>
                                                <Label>{t('futures:take_profit')}</Label>
                                                <Span className="text-onus-green">{renderModify(item?.metadata, 'take_profit')}</Span>
                                            </Row>
                                        }
                                        {item?.metadata?.modify_sl &&
                                            <Row>
                                                <Label>{t('futures:stop_loss')}</Label>
                                                <Span className="text-onus-red">{renderModify(item?.metadata, 'stop_loss')}</Span>
                                            </Row>
                                        }
                                        {item?.metadata?.modify_price &&
                                            <Row>
                                                <Label>{t('futures:price')}</Label>
                                                <Span>{renderModify(item?.metadata, 'price')}</Span>
                                            </Row>
                                        }
                                        {item?.metadata?.modify_margin &&
                                            <Row>
                                                <Label>{t('futures:margin')}</Label>
                                                <Span>{renderModify(item?.metadata, 'margin')}</Span>
                                            </Row>
                                        }
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const Row = styled.div.attrs({
    className: 'flex items-center justify-between py-3 border-b border-onus-input2 last:border-0'
})``;

const Label = styled.div.attrs(({ isTabOpen }) => ({
    className: `text-gray-1 text-left text-onus-grey ${isTabOpen ? 'text-xs' : 'text-sm'} font-normal`
}))``;

const Span = styled.div.attrs(({ isTabOpen }) => ({
    className: `text-sm text-right font-medium ${isTabOpen ? 'text-xs' : 'text-sm'}`
}))``;

export default OrderDetail;
