import { useCallback, useEffect, useRef, useState } from 'react';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { Trans, useTranslation } from 'next-i18next';
import { getMarketWatch } from 'redux/actions/market';
import { useWindowSize } from 'utils/customHooks';
import { PulseLoader } from 'react-spinners';
import { useAsync } from 'react-use';

import colors from 'styles/colors';
import CountUp from 'react-countup';
import Link from 'next/link';

const HomeIntroduce = ({ parentState }) => {
    const [state, set] = useState({
        pairsLength: null,
        loading: false,
        makedData: null,
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    // Use Hooks
    const { width } = useWindowSize()
    const { t } = useTranslation(['home'])

    const animRef = useRef()

    const renderIntroduce = useCallback(() => {
        return (
            <section className="homepage-introduce">
                <div className="homepage-introduce___wrapper mal-container">
                    <div className="homepage-introduce___wrapper__left">
                        <div className="homepage-introduce___nami_exchange">NAMI EXCHANGE</div>
                        <div className="homepage-introduce___title">
                            {width < 576 ? <>{t('home:introduce.title_mobile')}</>
                                : <>{t('home:introduce.title_desktop1')}<br/>{t('home:introduce.title_desktop2')}</>
                            }
                        </div>
                        <div className="homepage-introduce___description">
                            <Trans>{t('home:introduce.description')}</Trans>
                        </div>
                        <div className="homepage-introduce___download">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a className="homepage-introduce___download__item" target="_blank">
                                    <img src={getS3Url('/images/download_app_store.png')} alt="Nami Exchange"/>
                                </a>
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                <a className="homepage-introduce___download__item" target="_blank">
                                    <img src={getS3Url("/images/download_play_store.png")} alt="Nami Exchange"/>
                                </a>
                            </Link>
                            <div className="homepage-introduce___download__item"
                                 onClick={() => parentState({ showQR: true })}>
                                <img src={getS3Url("/images/icon/ic_qr.png")} alt="Nami Exchange"/>
                            </div>
                        </div>
                    </div>
                    <div className="homepage-introduce___wrapper__right">
                        <div ref={animRef} className="homepage-introduce___graphics">
                            <div className="homepage-introduce___graphics__anim__wrapper">
                                <img src={getS3Url("/images/screen/homepage/banner_graphics.png")} alt="Nami Exchange"/>
                            </div>
                        </div>
                        {/*{width >= 1024 &&*/}
                        {/*<div className="homepage-introduce___graphics__backward">*/}
                        {/*    <img src={getS3Url("/images/screen/homepage/electric_pattern.png")} alt="Nami Exchange"/>*/}
                        {/*</div>}*/}
                    </div>
                    <div className="homepage-introduce___statitics">
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                {state.loading && !state.makedData ?
                                    <PulseLoader size={5} color={colors.teal}/>
                                    : <>
                                        $<CountUp start={0}
                                                  end={COUNT.VOLUME_24H + state.makedData?.volume24h}
                                                  duration={2.75}
                                                  prefix="$"
                                                  formattingFn={(value) => formatNumber(value, 0)}
                                                  delay={0}
                                                  useEasing
                                    >
                                        {({ countUpRef }) => <span ref={countUpRef}/>}
                                    </CountUp>
                                    </>}
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                {t('home:introduce.total_order_paid')}
                            </div>
                        </div>
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                {state.loading && !state.makedData ?
                                    <PulseLoader size={5} color={colors.teal}/>
                                    : <CountUp start={0}
                                         end={COUNT.MEMBER}
                                         duration={2.75}
                                         formattingFn={(value) => formatNumber(value, 0)}
                                         delay={0}
                                         useEasing
                                >
                                    {({ countUpRef }) => <span ref={countUpRef}/>}
                                </CountUp>} +
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                {t('home:introduce.total_user')}
                            </div>
                        </div>
                        <div className="homepage-introduce___statitics____item">
                            <div className="homepage-introduce___statitics____item___value">
                                {state.loading ?
                                    <PulseLoader size={5} color={colors.teal}/>
                                    : <CountUp start={0}
                                               end={state.pairsLength}
                                               duration={2.75}
                                               formattingFn={(value) => formatNumber(value, 0)}
                                               delay={0}
                                               useEasing
                                    >
                                        {({ countUpRef }) => <span ref={countUpRef}/>}
                                    </CountUp>}
                                <div className="bott-line"/>
                            </div>
                            <div className="homepage-introduce___statitics____item___description">
                                {t('home:introduce.total_pairs')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }, [width, state.loading, state.pairsLength, state.makedData])

    useAsync(async () => {
        setState({ loading: true })
        const pairs = await getMarketWatch()
        if (pairs && pairs.length) {
            setState({ pairsLength: pairs.length })
        }
        setState({ loading: false })
    })

    useEffect(() => {
        const makedData = makeData()
        if (Object.keys(makedData).length) {
            setState({ makedData })
        }
    }, [])

    return renderIntroduce()
}

const COUNT = {
    VOLUME_24H: 7e6,
    MEMBER: 200000,
}

// const TIME_FLAG = 1638856917 // 200,000 Member at this time
// const current = Date.now()

const makeData = () => {
    const volume24h = Math.floor(Math.random() * (VOLUME_24H_RANGE[1] - VOLUME_24H_RANGE[0] + 1) + VOLUME_24H_RANGE[0])
    return {
        volume24h
    }
}

// const MEMBER_RANGE = [5, 20]
const VOLUME_24H_RANGE = [1e5, 9e5]

export default HomeIntroduce
