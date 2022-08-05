import React, { useContext, useMemo, useRef, useState } from 'react';
import CheckBox from 'components/common/CheckBox';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TableNoData from 'components/common/table.old/TableNoData';
// import OrderClose from 'components/screens/Futures/PlaceOrder/Vndc/OrderClose';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import OrderItemMobile from './OrderItemMobile';
// import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc';
import { getShareModalData } from './ShareFutureMobile';
import { emitWebViewEvent, countDecimals } from 'redux/actions/utils';
import AdjustPositionMargin from 'components/screens/Mobile/Futures/AdjustPositionMargin';
import { find, countBy } from 'lodash';
import EditSLTPVndcMobile from '../EditSLTPVndcMobile';
import { reFetchOrderListInterval } from 'redux/actions/futures';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';

const TabOpenOrders = ({
    ordersList,
    pair,
    isAuth,
    isDark,
    pairConfig,
    onShowDetail,
    tab
}) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const [hideOther, setHideOther] = useState(false);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const dataFilter = useMemo(() => {
        return hideOther ? ordersList.filter(order => order?.symbol === pair) : ordersList;
    }, [hideOther, ordersList, pair]);
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const rowData = useRef(null);
    const [openCloseModal, setOpenCloseModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [orderEditMarginId, setOrderEditMarginId] = useState();
    const [disabled, setDisabled] = useState(false);
    const assetConfig = useSelector(state => state.utils.assetConfig);

    const dispatch = useDispatch()

    const orderEditMargin = useMemo(() => {
        if (!orderEditMarginId) return;
        return find(dataFilter, { displaying_id: orderEditMarginId });
    }, [orderEditMarginId, dataFilter]);


    const needShowHideOther = useMemo(() => {
        const totalSymbol = countBy(ordersList, 'symbol')
        return Object.keys(totalSymbol).length > 1
    }, [ordersList]);

    const onShowModal = (item, key) => {
        rowData.current = item;
        switch (key) {
            case 'delete':
                context.alert.show('warning',
                    t('futures:close_order:modal_title', { value: item?.displaying_id }),
                    t('futures:close_order:confirm_message', { value: item?.displaying_id }),
                    null,
                    () => {
                        onConfirmDelete(item);
                    }
                );
                // setOpenCloseModal(!openCloseModal);
                break;
            case 'edit':
                setOpenEditModal(!openEditModal);
                break;
            case 'edit-margin':
                setOrderEditMarginId(item.displaying_id);
                break;
            default:
                if (!openShareModal) {
                    const shareModalData = getShareModalData({
                        order: rowData.current,
                        pairPrice: marketWatch[rowData.current?.symbol]
                    });
                    emitWebViewEvent(JSON.stringify(shareModalData));
                }
                // setOpenShareModal(!openShareModal)
                break;
        }
    };

    const fetchOrder = async (method = 'DELETE', params, cb) => {
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
        } finally {
            setOpenCloseModal(false);
            setTimeout(() => {
                setDisabled(false)
            }, 1000);
        }
    };

    const onConfirmDelete = async (item) => {
        const id = item ? item.displaying_id : rowData.current.displaying_id;
        const params = {
            displaying_id: id,
            special_mode: 1
        };
        fetchOrder('DELETE', params, () => {
            context.alert.show('success', t('futures:close_order:modal_title', { value: id }), t('futures:close_order:request_successfully', { value: id }));
            dispatch(reFetchOrderListInterval(1, 10000))
        });
    };

    const onConfirmEdit = (params) => {
        setDisabled(true)
        fetchOrder('PUT', params, () => {
            localStorage.setItem('edited_id', params.displaying_id);
            context.alert.show('success', t('common:success'), t('futures:modify_order_success'));
            setOpenEditModal(false);
        });
    };

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find(rs => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize)
    }

    if (ordersList.length <= 0) {
        return <TableNoData
            isMobile
            title={t('futures:order_table:no_opening_order')}
            className="h-full min-h-[300px]" />;
    }

    return (
        <div className="px-[16px] pt-4 overflow-x-auto" style={{ height: 'calc(100% - 114px)' }}>
            {openEditModal &&
                <EditSLTPVndcMobile
                    onusMode={true}
                    isVisible={openEditModal}
                    order={rowData.current}
                    onClose={() => !disabled && setOpenEditModal(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirmEdit}
                    pairConfig={pairConfig}
                    pairTicker={marketWatch}
                    isMobile
                    disabled={disabled}
                />
            }
            {
                needShowHideOther
                &&
                <div
                    className="flex items-center text-sm font-medium select-none cursor-pointer"
                    onClick={() => setHideOther(!hideOther)}
                >
                    <CheckBox onusMode={true} active={hideOther} boxContainerClassName="rounded-[2px]" />
                    <span className="ml-3 whitespace-nowrap font-medium capitalize text-onus-grey text-xs">
                        {t('futures:hide_other_symbols')}
                    </span>
                </div>
            }

            <div className="min-h-[100px]">
                {dataFilter?.map((order, i) => {
                    const dataMarketWatch = marketWatch[order?.symbol];
                    const symbol = allPairConfigs.find(rs => rs.symbol === order.symbol);
                    const decimalSymbol = assetConfig.find(rs => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
                    const decimalScalePrice = getDecimalPrice(symbol);
                    const isVndcFutures = symbol?.quoteAsset === 'VNDC';
                    return (
                        <OrderItemMobile key={i} order={order} dataMarketWatch={dataMarketWatch}
                            onShowModal={onShowModal} allowButton isDark={isDark} symbol={symbol}
                            onShowDetail={onShowDetail} decimalSymbol={decimalSymbol} decimalScalePrice={decimalScalePrice}
                            tab={tab} isVndcFutures={isVndcFutures}
                        />
                    );
                })}
            </div>
            {
                orderEditMarginId &&
                <AdjustPositionMargin
                    order={orderEditMargin}
                    pairPrice={marketWatch[orderEditMargin?.symbol]}
                    onClose={() => setOrderEditMarginId()}
                />
            }
        </div>
    );
};

export default TabOpenOrders;
