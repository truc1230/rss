import DefaultMobileView from 'src/components/common/DefaultMobileView';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import PlaceOrderForm from 'src/components/trade/PlaceOrderForm';
import SimplePlaceOrderForm from 'src/components/trade/SimplePlaceOrderForm';
import SymbolDetail from 'src/components/trade/SymbolDetail';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { SPOT_LAYOUT_MODE } from 'redux/actions/const';
import Chart from 'src/components/trade/Chart';
import OrderBook from 'src/components/trade/OrderBook';
import SpotHead from 'src/components/trade/SpotHead';
import SpotOrderList from 'src/components/trade/SpotOrderList';
import SymbolList from 'src/components/trade/SymbolList';
import Trades from 'src/components/trade/Trades';
import { PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { getMarketWatch, postSymbolViews } from 'src/redux/actions/market';
import { getSymbolString } from 'src/redux/actions/utils';
import { useWindowSize } from 'utils/customHooks';
import find from 'lodash/find';
import useDarkMode from 'hooks/useDarkMode';

const ReactGridLayout = WidthProvider(RGL);

const layoutChartFullScreen = [
    {
        i: 'chart',
        x: 0,
        y: 0,
        w: 16,
        h: 30,
        isDraggable: false,
        isResizable: false,
    },
];
const layoutSimple = [
    {
        i: 'symbolDetail',
        x: 0,
        y: 0,
        w: 13,
        h: 3,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'orderbook',
        x: 0,
        y: 3,
        w: 3,
        h: 34,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'chart',
        x: 3,
        y: 3,
        w: 10,
        h: 21,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'placeOrderForm',
        x: 3,
        y: 6,
        w: 10,
        h: 13,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'symbolList',
        x: 13,
        y: 3,
        w: 3,
        h: 17,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'trades',
        x: 13,
        y: 17,
        w: 3,
        h: 20,
        minW: 10,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'orderList',
        x: 0,
        y: 26,
        w: 30,
        h: 12,
        isDraggable: false,
        isResizable: false,
    },
];

const layoutPro = [
    {
        i: 'chart',
        x: 0,
        y: 4,
        w: 10,
        h: 24,
        isDraggable: true,
        isResizable: true,
        isDroppable: true,
    },
    {
        i: 'orderList',
        x: 0,
        y: 25,
        w: 10,
        h: 15,
        isDraggable: true,
        isResizable: true,
        isDroppable: true,
    },
    {
        i: 'symbolDetail',
        x: 0,
        y: 0,
        w: 10,
        h: 3,
        isDraggable: false,
        isResizable: false,
        isDroppable: false,
    },
    {
        i: 'orderbook',
        x: 10,
        y: 0,
        w: 3,
        h: 27,
        isDraggable: true,
        isResizable: true,
        isDroppable: true,
    },
    {
        i: 'trades',
        x: 10,
        y: 17,
        w: 3,
        h: 15,
        minW: 10,
        isDraggable: true,
        isResizable: true,
        isDroppable: true,
    },
    {
        i: 'placeOrderForm',
        x: 13,
        y: 0,
        w: 3,
        h: 42,
        isDraggable: true,
        isResizable: true,
        isDroppable: true,
    },
];

const initSpotComponent = {
    isShowChart: true,
    isShowSymbolDetail: true,
    isShowOrderBook: true,
    isShowTrades: true,
    isShowSymbolList: true,
    isShowOrderList: true,
    isShowPlaceOrderForm: true,
};

const SpotComp = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const {
        id,
        timeframe,
        indicator,
        layout,
    } = router.query;
    const [layoutConfig, setLayoutConfig] = useState(layout === SPOT_LAYOUT_MODE.PRO
        ? layoutPro
        : layoutSimple);
    const [layoutMode, setLayoutMode] = useState(
        layout === SPOT_LAYOUT_MODE.PRO
            ? SPOT_LAYOUT_MODE.PRO
            : SPOT_LAYOUT_MODE.SIMPLE,
    );
    const [currentTheme] = useDarkMode()
    // Check pattern
    let symbolFromUrl = null;
    if (typeof id === 'string' && id.length) {
        const [base, quote] = id.split('-');
        if (base && quote) {
            symbolFromUrl = {
                base,
                quote,
            };
        }
    }
    const [symbol, setSymbol] = useState(symbolFromUrl);
    const publicSocket = useSelector((state) => state.socket.publicSocket);

    // Spot layout
    const [lastSymbol, setLastSymbol] = useState(null);
    const [publicSocketStatus, setPublicSocketStatus] = useState(false);

    const [orderBookLayout, setOrderBookLayout] = useState({});
    const [tradesLayout, setTradesLayout] = useState({});

    const [initTimeFrame, setInitTimeFrame] = useState('');
    const [isResizingOrderList, setIsResizingOrderList] = useState(false);
    const [orderListWrapperHeight, setOrderListWrapperHeight] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);

    // compact state
    const [state, set] = useState({
        orderBook: null,
        ...initSpotComponent,
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const resetDefault = () => {
        setLayoutConfig(layout === SPOT_LAYOUT_MODE.PRO
            ? layoutPro
            : layoutSimple);
        setState({
            ...state,
            ...initSpotComponent,
        });
    };

    const user = useSelector((state) => state.auth.user) || null;
    const orderListWrapperRef = useRef(null);

    // console.log('orderListWrapperRef', orderListWrapperRef?.current);

    const updateOrderListHeight = () => {
        setOrderListWrapperHeight(orderListWrapperRef?.current?.clientHeight);
    };

    useEffect(() => {
        setTimeout(() => {
            updateOrderListHeight();
        }, 200);
        return () => clearTimeout(updateOrderListHeight());
    }, [orderListWrapperRef, isResizingOrderList]);
    const { width } = useWindowSize();

    useEffect(() => {
        if (timeframe) {
            setInitTimeFrame(timeframe);
        }
    }, [indicator, timeframe]);

    useEffect(() => {
        const initLayout = layoutConfig;
        const _orderbookLayout = find(initLayout, { i: 'orderbook' });
        const _tradesLayout = find(initLayout, { i: 'trades' });
        setOrderBookLayout(_orderbookLayout);
        setTradesLayout(_tradesLayout);
    }, []);

    // Spot Socket

    const subscribeExchangeSocket = (s) => {
        if (!publicSocket) {
            setPublicSocketStatus(!!publicSocket);
        } else {
            if (
                !lastSymbol ||
                lastSymbol !== s ||
                !!publicSocket !== publicSocketStatus
            ) {
                // Vao day subscrible thoi
                publicSocket.emit('subscribe:depth', s);
                publicSocket.emit('subscribe:recent_trade', s);
                publicSocket.emit('subscribe:ticker', s);
                publicSocket.emit('subscribe:mini_ticker', 'all');

                setPublicSocketStatus(!!publicSocket);
                setLastSymbol(symbol);
            }
        }
    };

    const unsubscribeExchangeSocket = (s) => {
        if (!publicSocket) return;
        publicSocket.emit('unsubscribe:all', s);
    };

    useEffect(() => {
        postSymbolViews(getSymbolString(symbol));
    }, [symbol]);

    useEffect(() => {
        if (
            symbolFromUrl?.quote !== symbol?.quote ||
            symbolFromUrl?.base !== symbol?.base
        ) {
            setSymbol(symbolFromUrl);
        }
    }, [symbolFromUrl]);

    useAsync(async () => {
        if (symbol) {
            const [newSymbolTicker] = await getMarketWatch(
                getSymbolString(symbol),
            );
            Emitter.emit(PublicSocketEvent.SPOT_TICKER_UPDATE, newSymbolTicker);
        }
    }, [symbol]);

    useEffect(() => {
        if (symbol) {
            subscribeExchangeSocket(getSymbolString(symbol));
        }

        return function cleanup() {
            if (symbol) {
                unsubscribeExchangeSocket(getSymbolString(symbol));
            }
        };
    }, [publicSocket, symbol]);

    const handleResize = (
        _layout,
        _oldItem,
        _newItem,
        _placeholder,
        _e,
        _element,
    ) => {
        if (_newItem?.i === 'orderbook') {
            setOrderBookLayout(_newItem);
        }
        if (_newItem?.i === 'trades') {
            setTradesLayout(_newItem);
        }
    };

    if (!symbol) return null;
    console.log(layoutMode === SPOT_LAYOUT_MODE.PRO
        ? layoutPro
        : layoutSimple)
    return (
        <MaldivesLayout
            hideFooter
            page="spot"
            changeLayoutCb={setLayoutMode}
            spotState={state}
            onChangeSpotState={setState}
            resetDefault={resetDefault}
        >
            <SpotHead symbol={symbol}/>
            <MobileView className="bg-white">
                <DefaultMobileView/>
            </MobileView>
            <BrowserView className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark">
                <div
                    className={
                        layoutMode === SPOT_LAYOUT_MODE.PRO
                            ? 'w-full'
                            : '2xl:container'
                    }
                >
                    <ReactGridLayout
                        className="layout"
                        layout={
                            layoutMode === SPOT_LAYOUT_MODE.PRO
                                ? layoutPro
                                : layoutSimple
                        }
                        // layout={layoutConfig}
                        // onLayoutChange={(_layout) => setLayoutConfig(_layout)}
                        breakpoints={{
                            xl: 1440,
                            lg: 2200,
                        }}
                        cols={16}
                        margin={[-1, -1]}
                        containerPadding={[0, 0]}
                        rowHeight={24}
                        onResize={handleResize}
                        draggableHandle=".dragHandleArea"
                        draggableCancel=".dragCancelArea"
                        // resizeHandle={()=> <span>Hello</span>}
                        resizeHandle={()=> <span className={`react-resizable-handle react-resizable-handle-se  ${currentTheme === 'dark' ? 'nami-react-resizable-handle--dark' : 'nami-react-resizable-handle' }`}></span>}
                    >
                        {!(!state.isShowSymbolList || layoutMode === SPOT_LAYOUT_MODE.PRO || fullScreen) && (
                            <div
                                key="symbolList"
                                className="border border-divider dark:border-divider-dark"
                            >
                                <SymbolList
                                    publicSocket={publicSocket}
                                    symbol={symbol}
                                />
                            </div>
                        )
                        }


                        <div
                            key="chart"
                            className={`border border-divider dark:border-divider-dark ${!state.isShowChart ? 'hidden' : ''}`}
                        >
                            <Chart
                                symbol={symbol}
                                initTimeFrame={initTimeFrame}
                            />
                        </div>
                        <div
                            key="symbolDetail"
                            className={`border border-divider dark:border-divider-dark ${!state.isShowSymbolDetail || fullScreen ? 'hidden' : ''}`}
                        >
                            <SymbolDetail
                                layoutMode={layoutMode}
                                symbol={symbol}
                                publicSocket={publicSocket}
                            />
                        </div>

                        <div
                            key="trades"
                            className={`border border-divider dark:border-divider-dark ${!state.isShowTrades || fullScreen ? 'hidden' : ''}`}
                        >
                            <Trades
                                symbol={symbol}
                                publicSocket={publicSocket}
                                layoutConfig={tradesLayout}
                            />
                        </div>
                        <div
                            key="placeOrderForm"
                            className={`border border-divider dark:border-divider-dark ${!state.isShowPlaceOrderForm || fullScreen ? 'hidden' : ''}`}
                        >
                            {layoutMode === SPOT_LAYOUT_MODE.SIMPLE ? (
                                <SimplePlaceOrderForm
                                    symbol={symbol}
                                    orderBook={state.orderBook}
                                />
                            ) : (
                                <PlaceOrderForm
                                    symbol={symbol}
                                    orderBook={state.orderBook}
                                />
                            )}
                        </div>
                        <div
                            key="orderList"
                            className={`border border-divider dark:border-divider-dark ${!state.isShowOrderList || fullScreen ? 'hidden' : ''}`}
                        >
                            <div ref={orderListWrapperRef} className="h-full">
                                <SpotOrderList
                                    orderListWrapperHeight={
                                        orderListWrapperHeight
                                    }
                                />
                            </div>
                        </div>
                        <div
                            key="orderbook"
                            className={`border border-divider dark:border-divider-dark ${!state.isShowOrderBook || fullScreen ? 'hidden' : ''}`}
                        >
                            <OrderBook symbol={symbol} parentState={setState} layoutConfig={orderBookLayout}/>
                        </div>

                    </ReactGridLayout>
                </div>
            </BrowserView>
        </MaldivesLayout>
    );
};

export default SpotComp;
