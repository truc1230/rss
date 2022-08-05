import AssetLogo from 'src/components/wallet/AssetLogo';
import colors from 'styles/colors';
import Axios from 'axios';

import { useCallback, useEffect, useState } from 'react';
import { API_GET_TRENDING } from 'redux/actions/apis';
import { useWindowSize } from 'utils/customHooks';
import { useSelector } from 'react-redux';
import { formatPrice, getExchange24hPercentageChange, render24hChange } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { initMarketWatchItem, sparkLineBuilder } from 'src/utils';

const HomeMarketTrend = () => {
    // * Initial State
    const [state, set] = useState({
        marketTabIndex: 0,
        trending: null,
        loadingTrend: false,
        publicSocketStatus: false,
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

    // * Use Hooks
    const { width } = useWindowSize(['home', 'table'])
    const { t } = useTranslation()

    const exchangeConfig = useSelector(state => state.utils.exchangeConfig)

    // * Helper
    const getTrending = async () => {
        setState({ loadingTrend: true })
        try {
            const { data } = await Axios.get(API_GET_TRENDING)
            if (data && data.status === 'ok') {
                setState({ trending: data?.data })
            }
        } catch (e) {
            console.log('Cant get top trending data: ', e)
        } finally {
            setState(({ loadingTrend: false }))
        }
    }

    // * Render Handler
    const renderTrendTab = useCallback(() => {
        return (
            <>
                <div className="homepage-markettrend__tab___item__wrapper">
                    <div className={`homepage-markettrend__tab___item
                                         ${state.marketTabIndex === 0 ? 'homepage-markettrend__tab___item__active' : ''}`}
                         onClick={() => setState({ marketTabIndex: 0 })}>
                        {t('home:markettrend.top_vol')}
                    </div>
                    {width >= 992 && <div className={`homepage-markettrend__tab__item___selector
                                                              ${state.marketTabIndex === 0 ?
                        'homepage-markettrend__tab__item___selector__active' : ''}`}/>}
                </div>
                <div className="homepage-markettrend__tab___item__wrapper">
                    <div className={`homepage-markettrend__tab___item
                                         ${state.marketTabIndex === 1 ? 'homepage-markettrend__tab___item__active' : ''}`}
                         onClick={() => setState({ marketTabIndex: 1 })}>
                        {t('home:markettrend.top_gainer')}
                    </div>
                    {width >= 992 && <div className={`homepage-markettrend__tab__item___selector
                                                              ${state.marketTabIndex === 1 ?
                        'homepage-markettrend__tab__item___selector__active' : ''}`}/>}
                </div>
                <div className="homepage-markettrend__tab___item__wrapper">
                    <div className={`homepage-markettrend__tab___item
                                         ${state.marketTabIndex === 2 ? 'homepage-markettrend__tab___item__active' : ''}`}
                         onClick={() => setState({ marketTabIndex: 2 })}>
                        {t('home:markettrend.top_loser')}
                    </div>
                    {width >= 992 && <div className={`homepage-markettrend__tab__item___selector
                                                              ${state.marketTabIndex === 2 ?
                        'homepage-markettrend__tab__item___selector__active' : ''}`}/>}
                </div>


                {width >= 992 && <a href="/trade" className="homepage-markettrend__market_table__explore">
                    {t('home:markettrend.explore_market')}
                </a>}
            </>
        )
    }, [width, state.marketTabIndex])

    const renderMarketHeader = useCallback(() => {
        return (
            <div className="homepage-markettrend__market_table__row">
                <div className="homepage-markettrend__market_table__row__col1">
                    {t('table:pair')}
                </div>
                <div className="homepage-markettrend__market_table__row__col2">
                    {t('table:last_price')}
                </div>
                <div className="homepage-markettrend__market_table__row__col3">
                    {t('table:change_24h')}
                </div>
                {width >= 576 &&
                <div className="homepage-markettrend__market_table__row__col4">
                    {t('table:mini_chart')}
                </div>}
            </div>
        )
    }, [width])

    const renderMarketBody = useCallback(() => {
        const data = state.trending && state.trending.length ? state.trending[state.marketTabIndex] : null
        if (!data) return
        const { pairs } = data

        return pairs.map(pair => {
            let sparkLineColor
            const _ = initMarketWatchItem(pair)
            const _24hChange = getExchange24hPercentageChange(pair)

            if (_24hChange) {
                if (_24hChange > 0) sparkLineColor = colors.teal
                if (_24hChange <= 0) sparkLineColor = colors.red2
            }

            const sparkLine = sparkLineBuilder(_?.symbol, sparkLineColor)
            // console.log('namidev-DEBUG: ___ ', _24hChange)

            return (
                <a href={`/trade/${_?.baseAsset}-${_?.quoteAsset}`} className="homepage-markettrend__market_table__row" key={`markettrend_${_?.symbol}__${state.marketTabIndex}`}>
                    <div className="homepage-markettrend__market_table__row__col1">
                        <div className="homepage-markettrend__market_table__coin">
                            <div className="homepage-markettrend__market_table__coin__icon">
                                <AssetLogo size={width >= 350 ? 30 : 26} assetCode={_?.baseAsset}/>
                            </div>
                            <div className="homepage-markettrend__market_table__coin__pair">
                                <span>{_?.baseAsset}</span>
                                <span>/{_?.quoteAsset}</span>
                            </div>
                        </div>
                    </div>
                    <div className="homepage-markettrend__market_table__row__col2">
                        <div className="homepage-markettrend__market_table__price">
                            {formatPrice(_?.lastPrice)}
                        </div>
                    </div>
                    <div className="homepage-markettrend__market_table__row__col3">
                        <div className={`homepage-markettrend__market_table__percent ${_?.up ? 'value-up' : 'value-down'}`}>
                            {render24hChange(pair)}
                        </div>
                    </div>
                    <div className="homepage-markettrend__market_table__row__col4">
                        <div className="homepage-markettrend__market_table__chart">
                            <img src={sparkLine} alt="Nami Exchange"/>
                        </div>
                    </div>
                </a>
            )
        })
    }, [width, state.trending, state.marketTabIndex, exchangeConfig])

    useEffect(() => {
        getTrending()
        const inverval = setInterval(() => getTrending(), 60000)
        return () => inverval && clearInterval(inverval)
    }, [])

    return (
        <section className="homepage-markettrend">
            <div className="homepage-markettrend__wrapper mal-container">

                <div className="homepage-markettrend__tab_and_title">
                    <div className="homepage-markettrend__title">
                        {t('home:markettrend.title')}
                    </div>
                    <div className="homepage-markettrend__tab">
                        {renderTrendTab()}
                    </div>
                </div>

                <div className="homepage-markettrend__market_table">
                    <div className="homepage-markettrend__market_table__wrapper">
                        <div className="homepage-markettrend__market_table__header">
                            {renderMarketHeader()}
                        </div>
                        <div className="homepage-markettrend__market_table__content">
                            {renderMarketBody()}
                        </div>
                    </div>
                    {width < 992 && <a href="/trade" className="homepage-markettrend__market_table__explore">
                        {t('home:markettrend.explore_market')}
                    </a>}
                </div>

            </div>
        </section>
    )
}

export default HomeMarketTrend
