import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFuturesFavoritePairs, mergeFuturesFavoritePairs } from 'redux/actions/futures';
import { API_GET_FUTURES_MARKET_WATCH } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';

import FuturesFavoritePairItem from 'components/screens/Futures/FavoritePairs/FavoritePairItem';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import InfoSlider from 'components/markets/InfoSlider';
import colors from 'styles/colors';
import axios from 'axios';
import Star from 'components/svg/Star';

const FuturesFavoritePairs = memo(({ favoritePairLayout }) => {
    const [loading, setLoading] = useState(false)
    const [refreshMarketWatch, setRefreshMarketWatch] = useState(null)
    const dispatch = useDispatch();
    const favoritePairs = useSelector((state) => state.futures.favoritePairs)
    const publicSocket = useSelector((state) => state.socket.publicSocket)
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs)

    const fetchMarketWatch = async (isRefresh = false) => {
        !isRefresh && setLoading(true)
        try {
            const { data } = await axios.get(API_GET_FUTURES_MARKET_WATCH)
            if (data?.status === ApiStatus.SUCCESS) {
                setRefreshMarketWatch(data?.data)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const renderPairItems = useCallback(() => {
        const marketWatch = refreshMarketWatch?.map((o) => {
            const quoteAsset = allPairConfigs.find(i => i.pair === o.s)?.quoteAsset
            return FuturesMarketWatch.create(o, quoteAsset)
        })
        const pairs = mergeFuturesFavoritePairs(favoritePairs, marketWatch)?.filter(i => i?.quoteAsset !== 'USDT')
        return pairs?.map((pair) => (
            <FuturesFavoritePairItem key={pair?.symbol} pair={pair} />
        ))
    }, [favoritePairs, refreshMarketWatch])

    useEffect(() => {
        // Init
        fetchMarketWatch()
        dispatch(getFuturesFavoritePairs())
    }, [])

    if (!favoritePairs) return null

    return (
        <div className='h-full flex items-center pr-3'>
            <div className='flex items-center pl-5 pr-[10px] h-full dragHandleArea'>
                <Star size={16} fill={colors.yellow} />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <InfoSlider
                    gutter={18}
                    forceUpdateState={favoritePairLayout?.h}
                >
                    {renderPairItems()}
                </InfoSlider>
            )}
        </div>
    )
})

export default FuturesFavoritePairs
