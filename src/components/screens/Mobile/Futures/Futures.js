import React, {useEffect, useMemo, useRef, useState} from 'react';
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle';
import {useDispatch, useSelector} from 'react-redux';
import {FUTURES_DEFAULT_SYMBOL} from 'pages/futures';
import {PATHS} from 'constants/paths';
import {useRouter} from 'next/router';
import {UserSocketEvent} from 'redux/actions/const';
import {LOCAL_STORAGE_KEY} from 'constants/constants';
import LayoutMobile from 'components/common/layouts/LayoutMobile';
import TabOrders from 'components/screens/Mobile/Futures/TabOrders/TabOrders';
import {getOrdersList, updateSymbolView,removeItemMarketWatch} from 'redux/actions/futures';
import {VndcFutureOrderType} from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import PlaceOrderMobile from 'components/screens/Mobile/Futures/PlaceOrder/PlaceOrderMobile';
import SocketLayout from 'components/screens/Mobile/Futures/SocketLayout';
import ChartMobile from 'components/screens/Mobile/Futures/Chart/ChartMobile';
import styled from 'styled-components';
import {countDecimals, emitWebViewEvent} from 'redux/actions/utils';
import EventModalMobile from './EventModalMobile';
import {API_FUTURES_CAMPAIGN_STATUS} from 'redux/actions/apis';
import {ApiStatus} from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import {PromotionStatus} from 'components/screens/Mobile/Futures/onboardingType';
import _ from 'lodash';
import {bunchUpdateFuturesMarketPrice} from 'redux/actions/publicSocket';

const INITIAL_STATE = {
    loading: false,
    pair: null,
    isVndcFutures: false,
};

const FuturesMobile = () => {
    const [state, set] = useState(INITIAL_STATE);
    const dispatch = useDispatch();
    const setState = (state) => set((prevState) => ({...prevState, ...state}));
    const userSocket = useSelector((state) => state.socket.userSocket);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const auth = useSelector((state) => state.auth?.user);
    const userSettings = useSelector((state) => state.futures?.userSettings);
    const timestamp = useSelector((state) => state.heath.timestamp);
    const router = useRouter();
    const [side, setSide] = useState(VndcFutureOrderType.Side.BUY);
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES);
    const [availableAsset, setAvailableAsset] = useState(null);
    const [collapse, setCollapse] = useState(false);
    const [scrollSnap, setScrollSnap] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [showOnBoardingModal, setShowOnBoardingModal] = useState(false)
    const assetConfig = useSelector(state => state?.utils?.assetConfig)
    const campaign = useRef(null)

    const pairConfig = useMemo(
        () => allPairConfigs?.find((o) => o.pair === state.pair),
        [allPairConfigs, state.pair]
    );

    const asset = useMemo(() => {
        return assetConfig.find(rs => rs.id === pairConfig?.quoteAssetId);
    }, [assetConfig, pairConfig])

    useEffect(() => {
        if (!router?.query?.pair) return;
        const pairConfig = allPairConfigs?.find((o) => o.pair === router?.query?.pair)
        if (!pairConfig && allPairConfigs?.length > 0) {
            const newPair = allPairConfigs?.find(o => o.pair === FUTURES_DEFAULT_SYMBOL)?.pair || allPairConfigs[0].pair
            router.push(
                `/mobile${PATHS.FUTURES_V2.DEFAULT}/${newPair}`,
                undefined,
                {shallow: true}
            );
        }
    }, [router?.query?.pair, allPairConfigs])

    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1;

    // Re-load Previous Pair
    useEffect(() => {
        if (router?.query?.pair) {
            // if (router.query.pair.indexOf('USDT') !== -1) {
            //     router.push(
            //         `/mobile${PATHS.FUTURES_V2.DEFAULT}/${FUTURES_DEFAULT_SYMBOL}`,
            //         undefined,
            //         {shallow: true}
            //     );
            //     return;
            // }
            setState({pair: router.query.pair});
            localStorage.setItem(
                LOCAL_STORAGE_KEY.PreviousFuturesPair,
                router.query.pair
            );
            dispatch(updateSymbolView({symbol: router.query.pair}))
        }
    }, [router]);

    const getCampaignStatus = async () => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_FUTURES_CAMPAIGN_STATUS,
                options: { method: 'GET' },
            });
            if (status === ApiStatus.SUCCESS) {
                campaign.current = data.filter(rs => rs.status === PromotionStatus.PENDING);
                if (Array.isArray(campaign.current) && campaign.current.length > 0) {
                    setShowOnBoardingModal(true);
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
        }

    }

    useEffect(() => {
        getCampaignStatus();
        emitWebViewEvent('nami_futures');
    }, [])

    useEffect(() => {
        setState({isVndcFutures: pairConfig?.quoteAsset === 'VNDC'});
    }, [pairConfig, userSettings, state.layouts]);

    useEffect(() => {
        if (auth && timestamp) getOrders();
    }, [auth, timestamp, publicSocket]);

    const oldPairs = useRef([]);
    const getOrders = () => {
        if (auth) dispatch(getOrdersList((orders)=>{
            // if (!publicSocket) return;
            // const pairs = _.unionBy(orders, 'symbol').map(rs => rs.symbol);
            // if (JSON.stringify(oldPairs.current) !== JSON.stringify(pairs)) {
            //     const addPairs = pairs.filter(p => !oldPairs.current.find(e => e === p))
            //     const removePairs= oldPairs.current.filter(p => !pairs.find(e => e === p))
            //     if (addPairs.length > 0) {
            //         addPairs.map(pair => {
            //             publicSocket.emit('subscribe:futures:mini_ticker', pair)
            //         })
            //     }
            //     if (removePairs.length > 0) {
            //         removePairs.map(pair => {
            //             publicSocket.emit('unsubscribe:futures:mini_ticker', pair)
            //             delete bunchUpdateFuturesMarketPrice[pair];
            //             dispatch(removeItemMarketWatch(pair)) 
            //         })
            //     }
            // }
            // oldPairs.current = pairs;
        }));
    };

    // useEffect(() => {
    //     return () => {
    //         publicSocket && oldPairs.current.map(pair => {
    //             publicSocket.emit('unsubscribe:futures:mini_ticker', pair)
    //         })
    //     };
    // }, [publicSocket]);

    // useEffect(() => {
    //     const isset = oldPairs.current.find(pair => pair === state?.pair)
    //     publicSocket && state?.pair && !isset && publicSocket.emit('subscribe:futures:mini_ticker', state?.pair)
    //     return () => {
    //         const _isset = oldPairs.current.find(pair => pair === state?.pair)
    //         publicSocket && !_isset && state?.pair && publicSocket.emit('unsubscribe:futures:mini_ticker', state?.pair)
    //     }
    // }, [publicSocket, state?.pair]);

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
            }
        };
    }, [userSocket]);

    const decimals = useMemo(() => {
        const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
        const decimalScaleQtyLimit = pairConfig?.filters.find(rs => rs.filterType === 'LOT_SIZE');
        const decimalScaleQtyMarket = pairConfig?.filters.find(rs => rs.filterType === 'MARKET_LOT_SIZE');
        return {
            decimalScalePrice: countDecimals(decimalScalePrice?.tickSize),
            decimalScaleQtyLimit: countDecimals(decimalScaleQtyLimit?.stepSize),
            decimalScaleQtyMarket: countDecimals(decimalScaleQtyMarket?.stepSize)
        };
    }, [pairConfig]);

    useEffect(() => {
        if (avlbAsset) {
            const _avlb = avlbAsset?.[pairConfig?.quoteAssetId];
            setAvailableAsset(Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0));
        }
    }, [avlbAsset, pairConfig]);

    const futuresScreen = useMemo(() => {
        if (typeof window !== "undefined") {
            setScrollSnap(false);
            const vh = window.innerHeight * 0.01;
            const el = document.querySelector('#futures-mobile .form-order');
            if (el) {
                const scrollSnap = el.clientHeight <= vh * 100;
                if (scrollSnap) {
                    setScrollSnap(true);
                    return {isFullScreen: true, style: {height: vh * 100, scrollSnapAlign: 'start'}}
                }
                return {isFullScreen: false, style: {height: 'max-content'}}
            }
            return {isFullScreen: false, style: {height: 'max-content'}}
        } else {
            return {isFullScreen: false, style: {height: 'max-content'}}
        }
    }, [state.pair, typeof window])

    const onBlurInput = () => {
        const offset = document.activeElement.getBoundingClientRect()
        if (offset && offset?.top < 10) {
            document.activeElement.blur();
        }
    }

    const onScroll = (e) => {
        onBlurInput();
    }

    return (
        <>
            <FuturesPageTitle
                pair={state.pair}
                pricePrecision={pairConfig?.pricePrecision}
                pairConfig={pairConfig}
            />
            <LayoutMobile>
                {showOnBoardingModal && <EventModalMobile campaign={campaign.current} onClose={() => setShowOnBoardingModal(false)}/>}
                <Container id="futures-mobile" onScroll={onScroll}>
                    <Section className="form-order bg-onus"
                             style={{...futuresScreen.style}}>
                        <ChartMobile
                            pair={state.pair} pairConfig={pairConfig}
                            isVndcFutures={isVndcFutures}
                            setCollapse={setCollapse} collapse={collapse}
                            forceRender={forceRender}
                            isFullScreen={futuresScreen.isFullScreen}
                            decimals={decimals}
                        />
                        <SocketLayout miniTicker pair={state.pair} pairConfig={pairConfig}>
                            <PlaceOrderMobile
                                setSide={setSide}
                                decimals={decimals} side={side}
                                pair={state.pair} isAuth={!!auth} availableAsset={availableAsset}
                                pairConfig={pairConfig} isVndcFutures={isVndcFutures}
                                collapse={collapse} onBlurInput={onBlurInput}
                                decimalSymbol={asset?.assetDigit ?? 0}
                            />
                        </SocketLayout>
                    </Section>
                    <Section className="bg-onus" style={{...futuresScreen.style}}>
                        <TabOrders scrollSnap={scrollSnap} isVndcFutures={isVndcFutures}
                                   pair={state.pair} pairConfig={pairConfig} isAuth={!!auth}
                                   setForceRender={setForceRender} forceRender={forceRender}
                                   isFullScreen={futuresScreen.isFullScreen}
                        />
                    </Section>
                </Container>
            </LayoutMobile>
        </>
    );
};
const Container = styled.div`
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: calc(var(--vh, 1vh) * 100);
`

const Section = styled.div`
    width: 100%;
    height: unset;
${'' /* height:calc(var(--vh, 1vh) * 100); */}
${'' /* scroll-snap-align:start */}
`

export default FuturesMobile;
