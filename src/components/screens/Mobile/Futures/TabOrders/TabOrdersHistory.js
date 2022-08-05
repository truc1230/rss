import React, { useEffect, useMemo, useRef, useState } from 'react';
import fetchApi from 'utils/fetch-api';
import { API_GET_FUTURES_ORDER_HISTORY } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import TableNoData from 'components/common/table.old/TableNoData';
import OrderItemMobile from './OrderItemMobile';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getShareModalData } from './ShareFutureMobile';
import { useTranslation } from 'next-i18next';
import Skeletor from 'components/common/Skeletor';
import { emitWebViewEvent, countDecimals } from 'redux/actions/utils';
import { IconLoading } from 'src/components/common/Icons';
import colors from 'styles/colors'

const TabOrdersHistory = ({ isDark, scrollSnap, pair, isVndcFutures, active, onShowDetail }) => {
    const { t } = useTranslation();
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const timestamp = useSelector((state) => state.heath.timestamp);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const filter = useRef({
        page: 0
    })
    const hasMore = useRef(true);
    const rowData = useRef(null);
    const [openShareModal, setOpenShareModal] = useState(false);
    const isLoading = useRef(true);
    const [loadMore, setLoadMore] = useState(false);
    const assetConfig = useSelector(state => state.utils.assetConfig);

    useEffect(() => {
        if (active) {
            filter.current.page = 0;
            setLoading(true);
            getOrders(true);
        } else {
            isLoading.current = true;
            setDataSource([])
        }
    }, [active, timestamp])

    const onShowModal = (item, key) => {
        rowData.current = item;
        if (!openShareModal) {
            const shareModalData = getShareModalData({ order: rowData.current, pairPrice: pairConfigDetail })
            emitWebViewEvent(JSON.stringify(shareModalData))
        }
        // setOpenShareModal(!openShareModal)
    }

    const getOrders = async (isFirstLoad) => {
        try {
            const { status, data } = await fetchApi({
                url: API_GET_FUTURES_ORDER_HISTORY,
                options: { method: 'GET' },
                params: {
                    ...filter.current,
                    status: 1,
                },
            })
            if (status === ApiStatus.SUCCESS) {
                hasMore.current = data.hasNext;
                const _dataSource = isFirstLoad ? data?.orders || [] : [...dataSource].concat(data?.orders);
                setDataSource(_dataSource)
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(e)
        } finally {
            isLoading.current = false;
            setLoading(false);
            setLoadMore(false)
        }
    }

    const onNext = () => {
        filter.current.page = filter.current.page + 1;
        setLoadMore(true);
        getOrders();
    }


    const pairConfigDetail = useMemo(() => {
        return allPairConfigs.find(rs => rs.symbol === rowData.current?.symbol)
    }, [rowData.current, openShareModal])

    const Loading = () => (
        <div className="py-[10px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <div className="flex">
                            <Skeletor onusMode width={100} height={21} />
                        </div>
                        <div className="flex">
                            <Skeletor onusMode width={50} height={10} />&nbsp;&nbsp;
                            <Skeletor onusMode width={50} height={10} />
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div>
                        <Skeletor onusMode width={80} height={8} />
                        <Skeletor onusMode width={80} height={8} />
                    </div>
                    <div className="ml-[16px]"><Skeletor onusMode width={30} height={30} /></div>
                </div>
            </div>
            <div className="flex items-center justify-between flex-wrap mt-[5px]">
                <div className="w-[48%]"><Skeletor onusMode width={'100%'} height={10} /></div>
                <div className="w-[48%]"><Skeletor onusMode width={'100%'} height={10} /></div>
                <div className="w-[48%]"><Skeletor onusMode width={'100%'} height={10} /></div>
                <div className="w-[48%]"><Skeletor onusMode width={'100%'} height={10} /></div>
                <div className="w-[48%]"><Skeletor onusMode width={'100%'} height={10} /></div>
                <div className="w-[48%]"><Skeletor onusMode width={'100%'} height={10} /></div>
                <div className="w-[48%]"><Skeletor onusMode width={'100%'} height={10} /></div>
                <div className="w-[48%]"><Skeletor onusMode width={'100%'} height={10} /></div>
            </div>
            <div className="h-[1px]"><Skeletor onusMode width={'100%'} height={1} className="mt-[15px]" /></div>
        </div>
    )

    const getLoading = () => {
        let rs = [];
        for (let i = 1; i <= 5; i++) {
            rs.push(<Loading key={i} />)
        }
        return rs;
    }

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find(rs => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize)
    }

    if (loading && isLoading.current) return (<div className="min-h-screen px-[10px]">{getLoading()}</div>)
    if (dataSource.length <= 0 && !loading) return <TableNoData isMobile
        title={t('futures:order_table:no_history_order')}
        className="h-full min-h-screen" />

    return (
        <div className="min-h-screen">
            <div className={scrollSnap ? 'h-[calc(100vh-42px)] overflow-y-auto' : ''}>
                <div className="px-[16px]">
                    {dataSource?.map((order, i) => {
                        const symbol = allPairConfigs.find(rs => rs.symbol === order.symbol);
                        const decimalSymbol = assetConfig.find(rs => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
                        const decimalScalePrice = getDecimalPrice(symbol);
                        const isVndcFutures = symbol?.quoteAsset === 'VNDC';
                        return (
                            <OrderItemMobile key={i} order={order} mode="history"
                                isDark={isDark} onShowDetail={onShowDetail} symbol={symbol}
                                onShowModal={onShowModal} decimalSymbol={decimalSymbol} decimalScalePrice={decimalScalePrice}
                                isVndcFutures={isVndcFutures}
                            />
                        )
                    })}
                    {active && hasMore.current && <div
                        className='flex items-center justify-center text-center h-12 text-sm font-semibold mb-4'
                        onClick={onNext}
                    >{loadMore ? <IconLoading color={colors.onus.white} /> : <span>{t('futures:load_more')}</span>}
                    </div>}
                </div>
            </div>
            {/* <InfiniteScroll
                dataLength={dataSource.length}
                next={onNext}
                hasMore={active && hasMore.current}
                {...scrollSnap ? { height: 'calc(100vh - 42px)' } : { scrollableTarget: "futures-mobile" }}
            // loader={loading ? loader() : null}
            >

            </InfiniteScroll> */}
        </div>
    );
};

export default TabOrdersHistory;
