import AssetLogo from 'src/components/wallet/AssetLogo';
import Skeletor from 'src/components/common/Skeletor';
import Link from 'next/link';
import colors from 'styles/colors';

import { useCallback, useEffect, useState } from 'react';
import { initMarketWatchItem, sparkLineBuilder } from 'src/utils';
import { formatPrice, render24hChange } from 'redux/actions/utils';
import { getMarketWatch } from 'redux/actions/market';
import { orderBy } from 'lodash';
import { Trans, useTranslation } from 'next-i18next';

const SwapIntroduce = () => {
    const [state, set] = useState({
        loading: false,
        swapTrend: null
    })
    const setState = state => set(prevState => ({...prevState, ...state}))

    const { t } = useTranslation()

    // * Helper
    const getSwapTrending = async () => {
        !state.swapTrend && setState({ loading: true })
        try {
            const origin = await getMarketWatch()
            if (origin) {
                const swapTrend = orderBy(origin, 'vq', 'desc')
                                ?.filter(o => o.lbl === 'top_view')
                                ?.slice(0, 3)
                swapTrend && setState({ swapTrend })
            }
        } catch (e) {
            console.log(`Cant get swap trending `, e)
        } finally {
            setState({ loading: false })
        }
    }

    // * Render Handler
    const renderSwapTrend = useCallback(() => {

        if (!state.swapTrend) {
            const loader = []
            for (let i = 0; i < 3; ++i) {
                loader.push(
                    <div key={`swap_trend___${i}`} className="min-w-[131px] mt-3 mr-3 py-3 px-2 rounded-md bg-bgContainer dark:bg-bgContainer-dark drop-shadow-common dark:drop-shadow-none">
                        <div className="flex items-center">
                            <Skeletor circle width={24} height={24}
                                      containerClassName="avatar-skeleton"/>
                            <div className="ml-[8px] text-[14px] font-medium">
                                <Skeletor width={50}/>
                            </div>
                        </div>
                        <div className="mt-[12px] flex items-end">
                            <div>
                                <div className="font-medium">
                                    <Skeletor width={50}/>
                                </div>
                                <div className="text-[12px] font-normal text-txtSecondary dark:text-txtSecondary-dark">
                                    <Skeletor width={50}/>
                                </div>
                            </div>
                            <div className="mb-2 ml-[12px] w-[45px] h-[16px]">
                                <Skeletor width={50}/>
                            </div>
                        </div>
                    </div>
                )
            }
            return loader
        }

        return state.swapTrend.map(sw => {
            const _ = initMarketWatchItem(sw)
            return (
                <Link key={`swap_trend___${_?.baseAsset}${_?.quoteAsset}`}
                      href={`/trade/${_?.baseAsset}-${_?.quoteAsset}`}>
                    <a>
                        <div className="min-w-[131px] mt-3 mr-3 py-3 px-2 rounded-md bg-bgContainer dark:bg-bgContainer-dark drop-shadow-common dark:drop-shadow-none cursor-pointer border border-transparent hover:border-dominant">
                            <div className="flex items-center">
                                <AssetLogo assetCode={_?.baseAsset} size={24}/>
                                <div className="ml-[8px] text-[14px] font-medium">
                                    {_?.baseAsset}
                                    <span className="font-normal text-txtSecondary dark:text-txtSecondary-dark">
                                        /{_?.quoteAsset}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-[12px] flex items-end">
                                <div>
                                    <div className="font-medium">
                                        {render24hChange(sw)}
                                    </div>
                                    <div className="text-[12px] font-normal text-txtSecondary dark:text-txtSecondary-dark">
                                        {_?.lastPrice ? formatPrice(_?.lastPrice) : '--'}
                                    </div>
                                </div>
                                <div className="mb-2 ml-[12px] w-[45px] h-[16px] ">
                                    <img src={sparkLineBuilder(_?.symbol, _?.up ? colors.teal : colors.red2)}  alt="Nami Exchange"/>
                                </div>
                            </div>
                        </div>
                    </a>
                </Link>
            )
        })
    }, [state.swapTrend])

    useEffect(() => {
        getSwapTrending()
        const interval = setInterval(() => getSwapTrending(), 5000)
        return () => clearInterval(interval)
    }, [])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: Watch changing ___ ', state.swapTrend)
    // }, [state.swapTrend])


    return (
        <div className="hidden lg:block pt-[38px] xl:pt-[72px]">
            <div className="text-[32px] xl:text-[46px] leading-[42px] xl:leading-[52px] text-txtPrimary dark:text-txtPrimary-dark dark font-bold">
                <div>
                    {t('convert:title_1')}
                </div>
                <div className="text-dominant">
                    {t('convert:title_2')}
                </div>
            </div>
            <div className="mt-[20px] text-[14px] xl:text-[16px] text-txtSecondary dark:text-txtSecondary-dark font-medium">
                <Trans>
                    {t('convert:description')}
                </Trans>
            </div>
            <div className="mt-[52px]">
                <div className="text-[14px] xl:text-[16px] font-medium text-txtPrimary dark:text-txtPrimary-dark">
                    {t('convert:current_price')}
                </div>
            </div>
            <div className="flex items-center">
                {renderSwapTrend()}
            </div>
        </div>
    )
}

// const SWAP_TREND = ['BTC', 'VNDC', 'USDT']

export default SwapIntroduce
