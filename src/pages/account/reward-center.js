import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import RewardItem from 'components/screens/Account/RewardItem';
import useApp from 'hooks/useApp';
import SegmentTabs from 'components/common/SegmentTabs';

import { REWARD_STATUS, REWARD_TYPE } from 'components/screens/Account/_reward_data';
import Empty from 'components/common/Empty';
import ReModal, { REMODAL_BUTTON_GROUP, REMODAL_POSITION } from 'components/common/ReModalOld';
import useInView from 'react-cool-inview';
import { PATHS } from 'constants/paths';
import Axios from 'axios';
import { API_CLAIM_MISSION_REWARD, API_GET_MISSION } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import Types from 'components/screens/Account/types';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import Button from 'components/common/Button';
import { orderBy } from 'lodash';
import PortalPopup from 'components/common/Modal';
import { FacebookShareButton } from 'react-share';
import RewardEventModal from 'components/screens/Account/RewardEventModal'

export const REWARD_ROW_ID_KEY = 'reward_item_id_' // for identify reward will scrollTo after init
const REWARD_ID_QUERY_KEY = 'reward_id' // for query url
const REWARD_TYPE_QUERY_KEY = 'reward' // for query url

const shareUrlVi = "https://nami.io/insight-vi/nhan-loc-dau-nam-cung-chuong-trinh-li-xi-tet-tu-nami-exchange/"
const shareUrlEn = "https://nami.io/en/insight/nami-exchange-airdrop-lunar-new-years-lucky-money/"

const REWARD_TYPE_QUERY_VALUE = {
    ALL: 'all',
    PROMOTION: 'promotion',
    TRADING: 'trading'
}

const REWARD_TAB = {
    ALL: 0,
    PROMOTION: 1,
    TRADING: 2
}

const INITIAL_STATE = {
    tabIndex: REWARD_TAB.ALL,
    rewards: [],
    loadingReward: false,
    rewardExpand: {},
    popupMsg: null,
    showFixedAppSegment: false,
    isQueryDone: false,
    claim: null,
    claiming: false,
    lunarNewYear: null,
    event: null
}

const cateEvent = ['INVITE_FRIEND_KYC', 'LUCKY_ID', 'SPOT_TRADE', 'FUTURES_TRADE']

const RewardCenter = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    // Use Hooks
    const [currentTheme] = useDarkMode()
    const { t, i18n: { language } } = useTranslation()
    const router = useRouter()
    const isApp = useApp()

    const { observe } = useInView(
        {
            threshold: 0.25,
            onEnter: () => setState({ showFixedAppSegment: true }),
            onLeave: () => setState({ showFixedAppSegment: false })
        })

    // Helper
    const onClaim = async (id, payload) => {
        setState({ claiming: true })

        try {
            const { data } = await Axios.post(API_CLAIM_MISSION_REWARD, { id })
            if (data?.status === ApiStatus.SUCCESS) {
                let msg
                const { reward, category, assetConfig } = payload
                // console.log('namidev-DEBUG: reward => ', reward)
                if (cateEvent.includes(category)) {
                    setState({ event: data?.data })
                } else if (category === 'LUCKY_MONEY') {
                    setState({ lunarNewYear: data?.data })
                    // console.log('namidev-DEBUG: response => ', data)
                } else {
                    if (language === LANGUAGE_TAG.VI) {
                        msg = <>
                            Chúc mừng!<br/>Bạn đã nhận được <span className="ml-0.5 text-dominant">
                        {formatNumber(data?.data?.reward?.value || reward?.value, assetConfig?.assetDigit || 0)} {data?.data?.reward?.asset || assetConfig?.assetCode}
                        </span>
                        </>
                    } else {
                        msg = <>
                            Congratulation!<br/>You have successfully received <span className="ml-0.5 text-dominant">
                        {formatNumber(data?.data?.reward?.value || reward?.value, assetConfig?.assetDigit || 0)} {data?.data?.reward?.asset || assetConfig?.assetCode}
                        </span>
                        </>
                    }
                    const popupMsg = {
                        type: 'success',
                        msg
                    }
                    // console.log('namidev-DEBUG: => ', popupMsg, data?.data)
                    // re-fetch reward data
                    setState({ claim: data?.data, popupMsg })
                    // await getRewardData()
                }

            } else {
                switch (data?.status) {
                    case Types.CLAIM_RESULT.INVALID_MISSION:
                    case Types.CLAIM_RESULT.INVALID_USER:
                    case Types.CLAIM_RESULT.INVALID_TIME:
                        setState({ popupMsg: { type: 'error', msg: t(`reward-center:reward_error.${data?.status}`) } })
                        break
                    case Types.CLAIM_RESULT.INVALID_CLAIM_STATUS:
                    case Types.CLAIM_RESULT.INVALID_STATUS:
                    default:
                        setState({ popupMsg: { type: 'error', msg: t(`reward-center:reward_error.unknown`) } })
                        break
                }
            }
        } catch (e) {
            console.log(`Can't claim reward `, e)
        } finally {
            setState({ claiming: false })
            await getRewardData()
        }
    }

    const getRewardData = async (reFetch = false) => {
        (!state.loadingReward || reFetch) && setState({ loadingReward: true })
        try {
            const { data } = await Axios.get(API_GET_MISSION)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ rewards: orderBy(data.data, 'created_at', 'desc') })
            }
        } catch (e) {
            console.log(`Can't get mission data `, e)
        } finally {
            setState({ loadingReward: false })
        }
    }

    const closePopup = () => setState({ popupMsg: null })

    const showGuide = (event, guide) => {
        event?.stopPropagation()
        setState({ popupMsg: { title: t('reward-center:notice_title'), msg: guide } })
    }

    const scrollToReward = (elementId) => {
        const rewardElement = document.getElementById(elementId)
        rewardElement && rewardElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }

    // Memmoized
    const rewardAppStyles = useMemo(() => {
        let _className
        let _styles

        if (isApp) {
            _className = 'mt-4 h-full rounded-tl-[20px] rounded-tr-[20px] dark:bg-bgContainer-dark -mx-4 px-4 py-6 '

            if (currentTheme === THEME_MODE.LIGHT) {
                _styles = {
                    boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)',
                    backgroundColor: '#FCFCFC'
                }
            } else {
                _styles = {
                    // boxShadow: '0px -4px 30px rgba(245, 245, 245, 0.18)'
                }
            }
        } else {
            _className = ''
            _styles = {}
        }

        return {
            className: _className,
            styles: _styles
        }
    }, [isApp, currentTheme])

    const rewardListWrapperStyles = useMemo(() => {
        let style = {}

        if (currentTheme === THEME_MODE.LIGHT) {
            style = { boxShadow: '0px 4.09659px 13.4602px rgba(0, 0, 0, 0.05)' }
        } else {
            // style = { boxShadow: '0px 4.09659px 13.4602px rgba(245, 245, 245, 0.05)' }
        }

        return style
    }, [currentTheme])

    // Utilities
    const tabSeries = useMemo(() => {
        const counter = {}

        if (state.rewards?.length) {
            const rewardFiltered = state.rewards?.filter(o => o?.status !== REWARD_STATUS.NOT_AVAILABLE)
            counter.all = rewardFiltered?.length
            counter.promotion = rewardFiltered?.filter(o => o?.type === REWARD_TYPE.PROMOTION)?.length
            counter.trading = rewardFiltered?.filter(o => o?.type === REWARD_TYPE.TRADING)?.length
        }

        return [
            { key: 0, title: `${t('common:all')}${counter?.all ? ` (${counter.all})` : ''}` },
            { key: 1, title: `Promotion${counter?.promotion ? ` (${counter.promotion})` : ''}` }
            // { key: 2, title: `Trading${counter?.trading ? ` (${counter.trading})` : ''}` }
        ]
    }, [state.rewards])

    const onToggleReward = (rewardId, status) => {
        setState({ rewardExpand: { [rewardId]: status } })
        if (!state.isQueryDone) {
            router?.push(
                {
                    pathname: PATHS.ACCOUNT.REWARD_CENTER,
                    query: isApp ? { source: 'app' } : undefined
                },
                undefined,
                { shallow: true }
            )
            setState({ isQueryDone: true })
        }
    }

    const goToWallet = () => router.push('/wallet/exchange')

    // Render Handler
    const renderSegmentTabs = useCallback(() => {
        return null
        return (
            <SegmentTabs active={state.tabIndex}
                         onChange={(tabIndex) => setState({ tabIndex })}
                         tabSeries={tabSeries}
            />
        )
    }, [state.tabIndex, state.rewards, tabSeries, observe])

    const renderReward = useCallback(() => {
        if (state.loadingReward) {
            return (
                <>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                    <RewardItem data={null} loading={state.loadingReward}/>
                </>
            )
        }

        let rewardType = ''
        if (state.tabIndex === 1) rewardType = REWARD_TYPE.PROMOTION
        if (state.tabIndex === 2) rewardType = REWARD_TYPE.TRADING

        const data = state.rewards?.filter(o => o?.type?.includes(rewardType))

        if (!data?.length) {
            return (
                <div
                    className="min-h-[400px] xl:min-h-[520px] 2xl:min-h-[550px] h-full flex items-center justify-center dark:bg-darkBlue-2">
                    <Empty message={t('reward-center:no_promo')}
                           messageStyle="text-xs sm:text-sm"
                    />
                </div>
            )
        }

        return data?.map(reward => (
            <RewardItem
                key={reward?._id}
                data={reward}
                loading={state.loadingReward}
                active={state?.rewardExpand?.[reward?._id]}
                onToggleReward={(rewardId, status) => onToggleReward(rewardId, status)}
                showGuide={showGuide}
                claim={state.claim}
                claiming={state.claiming}
                onClaim={onClaim}
            />
        ))
    }, [state.tabIndex, state.rewards, state.loadingReward, state.rewardExpand, state.claim, state.claiming])

    const renderPopup = useCallback(() => {
        let useButtonGroup, positiveLabel

        switch (state.popupMsg?.type) {
            case 'error':
                useButtonGroup = REMODAL_BUTTON_GROUP.ALERT
                break
            case 'success':
                useButtonGroup = REMODAL_BUTTON_GROUP.NOT_USE
                positiveLabel = t('reward-center:go_to_wallet')
                break
            default:
                useButtonGroup = REMODAL_BUTTON_GROUP.SINGLE_CONFIRM
                positiveLabel = t('common:confirm')
                break
        }

        return (
            <ReModal
                useOverlay
                useButtonGroup={useButtonGroup}
                position={REMODAL_POSITION.CENTER}
                isVisible={!!state.popupMsg?.msg}
                title={state.popupMsg?.title}
                onBackdropCb={closePopup}
                onNegativeCb={closePopup}
                onPositiveCb={() => state.popupMsg?.type === 'success' ? goToWallet() : closePopup()}
                positiveLabel={positiveLabel}
                className="py-5"
                // buttonGroupWrapper="mx-auto"
            >
                {state.popupMsg?.type === 'error' && <div className="w-full">
                    <img className="m-auto w-[45px] h-[45px]" src={getS3Url('/images/icon/errors.png')} alt="ERRORS"/>
                </div>}
                {state.popupMsg?.type === 'success' &&
                <>
                    <img className="w-[28px] sm:w-[32px] h-auto" src={getS3Url('/images/logo/nami_maldives.png')}
                         alt=""/>
                    <div className="w-full">
                        <img className="m-auto w-[220px] h-[220px] md:w-[265px] md:h-[265px]"
                             src={getS3Url('/images/screen/reward/treasure.png')} alt="SUCCESS"/>
                    </div>
                </>}
                <div
                    className={state.popupMsg?.type ? 'mb-4 px-2 sm:px-4 md:px-8 lg:mb-5 leading-6 font-medium text-sm xl:text-[16px] text-center'
                        : 'mt-4 mb-4 lg:mb-5 font-medium text-sm text-center'}>
                    {state.popupMsg?.msg}
                </div>
                {state.popupMsg?.type === 'success' &&
                <div>
                    <Button title={t('reward-center:go_to_wallet')} href={PATHS.WALLET.EXCHANGE.DEFAULT}
                            type="primary"/>
                    <Button title={t('common:continue')} type="secondary" componentType="button" onClick={closePopup}
                            style={{ marginTop: 10 }}/>
                </div>}
            </ReModal>
        )
    }, [state.popupMsg])

    const renderFixedSegmentTabs = useCallback(() => {
        if (!isApp || state.rewards?.length === 1) return null

        return (
            <div className={state.showFixedAppSegment ?
                'p-4 w-full bg-bgContainer dark:bg-bgContainer-dark rounded-xl drop-shadow-onlyLight fixed z-50 top-0 left-0 !whitespace-nowrap opacity-0 transition-all ease-in-out duration-200 invisible'
                : 'p-4 w-full bg-bgContainer dark:bg-bgContainer-dark rounded-xl drop-shadow-onlyLight fixed z-50 top-0 left-0 !whitespace-nowrap transition-all ease-in-out duration-200 !visible !opacity-100'}>
                {renderSegmentTabs()}
            </div>
        )
    }, [state.showFixedAppSegment, state.rewards, isApp, renderSegmentTabs])

    const renderLunarPopup = useCallback(() => {
        const rwValue = state.lunarNewYear?.reward?.value?.toString()
        let imgSrc = `/images/reward-center/lucky-money/ny_${rwValue || '10'}_${language}.png`

        return (
            <PortalPopup noButton
                         isVisible={!!state.lunarNewYear}
                         onBackdropCb={() => setState({lunarNewYear: null})}
                         containerClassName="!bg-transparent"
            >
                <div className="relative min-w-[280px] sm:w-[380px] lg:w-[420px] max-w-[420px]">
                    <img className="relative z-10 rounded-[20px]"
                         src={getS3Url(imgSrc)}
                         alt={null}/>
                    <div className="absolute z-20 bottom-0 left-0 w-full flex items-center h-[50px] sm:h-[75px]">
                        <div className="w-1/2 h-full cursor-pointer" onClick={() => setState({ lunarNewYear: null })}/>
                        <div className="w-1/2 h-full cursor-pointer">
                            <FacebookShareButton
                                url={language === 'vi' ? shareUrlVi : shareUrlEn}
                                hashtag="#namiexchange#nami"
                                className="w-full h-full"
                                onShareWindowClose={() => setState({ lunarNewYear: null })}
                            />
                        </div>
                    </div>
                </div>
            </PortalPopup>
        )
    }, [state.lunarNewYear, language])

    useEffect(() => {
        getRewardData()
    }, [])

    useEffect(() => {
        const rewardQueryId = router?.query?.[REWARD_ID_QUERY_KEY]
        const rewardType = router?.query?.[REWARD_TYPE_QUERY_KEY]

        if (!state.loadingReward) {
            rewardQueryId && setState({ rewardExpand: { [rewardQueryId]: true } })
            if (rewardType) {
                switch (rewardType) {
                    case REWARD_TYPE_QUERY_VALUE.PROMOTION:
                        setState({ tabIndex: REWARD_TAB.PROMOTION })
                        break
                    case REWARD_TYPE_QUERY_VALUE.TRADING:
                        setState({ tabIndex: REWARD_TAB.PROMOTION })
                        break
                    case REWARD_TYPE_QUERY_VALUE.ALL:
                    default:
                        setState({ tabIndex: REWARD_TAB.ALL })
                        break
                }
            }
        }
    }, [router, state.loadingReward])

    useEffect(() => {
        const rewardQueryId = router?.query?.[REWARD_ID_QUERY_KEY]
        if (rewardQueryId && !state.isQueryDone && Object.keys(state.rewardExpand)?.length) {
            setTimeout(() => scrollToReward(REWARD_ROW_ID_KEY + rewardQueryId), 250)
        }
    }, [router, state.rewardExpand, state.isQueryDone])

    useEffect(() => {
        if (state.rewards?.length < 3) {
            setState({ rewardExpand: { [state.rewards?.[0]?._id]: true } })
        }
    }, [state.rewards])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: State => ', state.lunarNewYear)
    // }, [state.lunarNewYear])

    return (
        <>
            {/*{renderFixedSegmentTabs()}*/}
            <div className="h-full">
                {/*{!isApp && renderSegmentTabs()}*/}
                <div className="mt-8 t-common select-none">
                    {isApp ? t('reward-center:title') : t('reward-center:promotion')}
                </div>
                <div style={rewardAppStyles?.styles} className={rewardAppStyles?.className}>
                    {/*{isApp && <div ref={observe}>{renderSegmentTabs()}</div>}*/}
                    <div id="reward-center"
                         className="mt-6 overflow-hidden rounded-lg dark:border dark:border-divider-dark"
                         style={rewardListWrapperStyles}>
                        {renderReward()}
                    </div>
                </div>
            </div>
            {renderPopup()}
            {renderLunarPopup()}
            {state.event && <RewardEventModal data={state.event} onClose={() => setState({ event: false })} />}
        </>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'reward-center', 'identification'])
    }
})

export default withTabLayout(
    {
        routes: TAB_ROUTES.ACCOUNT,
        hideInApp: true
    })
(RewardCenter)
