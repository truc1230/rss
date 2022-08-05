import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ChevronRight } from 'react-feather';
import { useSelector } from 'react-redux';
import { formatNumber } from 'redux/actions/utils';
import { BREAK_POINTS } from 'constants/constants';
import AssetName from 'components/wallet/AssetName';
import RewardType from 'components/screens/Account/RewardType';
import DashedProgressLine from 'components/screens/Account/DashedProgressLine';
import useWindowSize from 'hooks/useWindowSize';
import Types from './types';
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect';

const INITIAL_STATE = {
    rewardItemExpand: {},
    // ...
}

const RewardListItem = ({ data, loading, showGuide, claim, claiming, onClaim }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))
    const router = useRouter();
    // Rdx
    const configs = useSelector(state => state.utils?.assetConfig)
    const auth = useSelector(state => state.auth?.user) || null

    // Use Hooks
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize()
    // Render Handler
    const renderList = useCallback(() => {
        return data?.map((task, index) => {
            const { _id, title, condition, reward: { assetId, value }, icon_url, description } = task

            let assetConfig

            if (condition === Types.TASK_CONDITION.SINGLE_MISSION) {
                assetConfig = configs?.find(o => o?.id === assetId)
            } else if (condition === Types.TASK_CONDITION.PROGRESS) {
                assetConfig = configs?.find(o => o?.id === task?.metadata?.assetId)
            }

            const isActive = state.rewardItemExpand?.[`${_id}`]
            const isLastedItem = data?.length === index + 1

            const originClass = 'relative flex items-stretch transition-all duration-200 ease-in-out max-h-[0px] invisible opacity-0 '
            let activeRewardList

            if (isActive) {
                activeRewardList = originClass + '!max-h-[800px] !visible !opacity-100'
            } else {
                activeRewardList = originClass
            }
            const _value = value[language];
            return (
                <div key={_id} className="relative pb-4 md:pb-5 lg:flex lg:items-center">
                    <div className="pt-4 md:pt-5 flex items-stretch lg:w-2/5">
                        <div className="relative flex items-center justify-center">
                            <div className="relative z-30 w-[40px] h-[40px] bg-bgContainer dark:bg-bgContainer-dark flex items-center justify-center overflow-hidden">
                                <img src={icon_url} className="w-[24px] h-[24px] md:w-[32px] md:h-[32px]" alt="" />
                                {isLastedItem &&
                                    <div className="w-[40px] h-[250%] absolute z-20 bg-bgContainer dark:bg-bgContainer-dark top-full left-0" />}
                            </div>
                            {!isLastedItem &&
                                <div style={{ height: `calc(100% + ${isActive ? 90 : 42}px)`, top: '50%' }}
                                    className="absolute z-10 left-1/2 -translate-x-1/2">
                                    <DashedProgressLine dashedSize={width >= BREAK_POINTS.md ? 5 : 3} offset={3}
                                        completed={true} // !TODO: Set to True if this task is claim success
                                        progressLineClass="!duration-500"
                                        isMore={isActive} />
                                </div>}
                        </div>

                        {/*Reward list item info*/}
                        <div style={{ width: 'calc(100% - 40px)' }}
                            className="ml-3.5 lg:ml-6 pr-4 lg:border-r lg:border-divider lg:dark:border-divider-dark">
                            <div className="relative w-full cursor-pointer lg:cursor-auto"
                                onClick={() => width < BREAK_POINTS.lg &&
                                    setState({ rewardItemExpand: { ...state.rewardItemExpand, [_id]: !state.rewardItemExpand?.[`${_id}`] } })}>
                                <div className="font-bold text-sm md:text-[16px] lg:text-[18px] max-w-[80%] lg:max-w-none">
                                    {title?.[language]} {/*{index === 1 ? 'ipsum nonstop lorem ipsum nonstop lorem i' : 'ipsum nonstop lorem ipsum nonstop lorem ipsum nonstop'}*/}
                                </div>
                                {width < BREAK_POINTS.lg &&
                                    <ChevronRight size={16} strokeWidth={1.5}
                                        className={isActive ?
                                            'absolute top-[2px] right-0 text-txtSecondary dark:text-txtSecondary-dark transition-all duration-200 ease-in rotate-90'
                                            : 'absolute top-[2px] right-0 text-txtSecondary dark:text-txtSecondary-dark transition-all duration-200 ease-in'} />}
                            </div>
                            <div className="pt-2.5 md:pt-3 flex flex-wrap items-center justify-between lg:justify-start font-medium text-xs md:text-sm">
                                <div className="lg:mr-4">
                                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('reward-center:reward')}:</span>
                                    <span className="mx-0.5 text-dominant">
                                        {
                                            typeof _value === 'string' ?
                                                _value :
                                                formatNumber(_value, assetConfig?.assetDigit)
                                        }
                                    </span>
                                    {
                                        typeof _value !== 'string' && <AssetName assetId={assetId} />
                                    }

                                </div>
                                {(isActive || width >= BREAK_POINTS.lg) &&
                                    <div>
                                        {description?.type === 'url' ?
                                            !isMobile ?
                                                <a href={description?.url?.[language]} target={'_blank'}
                                                    className="text-dominant text-xs md:text-sm !underline hover:!underline hover:opacity-80"
                                                    onClick={e => e?.stopPropagation()}
                                                >
                                                    {t('reward-center:guide')}
                                                </a>
                                                :
                                                null
                                            : <div className="text-dominant text-xs md:text-sm !underline hover:opacity-80 cursor-pointer"
                                                onClick={(e) => showGuide(e, description?.data?.[language])}>
                                                {t('reward-center:guide')}
                                            </div>
                                        }
                                    </div>}
                            </div>
                        </div>
                    </div>

                    {/*Reward list item dropdown*/}
                    {width < BREAK_POINTS.lg &&
                        <div className={activeRewardList}>

                            <div className="flex items-center justify-center">
                                <div className="w-[40px] h-[40px] max-w-[40px] flex items-center justify-center">
                                    {/*Leave this block empty*/}
                                </div>
                            </div>

                            {/*Reward content base on Task type*/}
                            <div style={{ width: 'calc(100% - 40px)' }} className="ml-3.5 pr-4">
                                <RewardType
                                    data={task}
                                    active={isActive}
                                    assetConfig={assetConfig}
                                    claim={claim}
                                    claiming={claiming}
                                    onClaim={onClaim}
                                />
                            </div>
                        </div>}

                    {/*Reward list item dropdown WideScreen*/}
                    {width >= BREAK_POINTS.lg &&
                        <div className="flex items-center justify-between w-3/5 px-8 xl:pr-10 pt-5">
                            <RewardType
                                data={task}
                                active={width >= BREAK_POINTS.lg ? true : isActive}
                                assetConfig={assetConfig}
                                claim={claim}
                                claiming={claiming}
                                onClaim={onClaim}
                            />
                        </div>
                    }


                    {!isLastedItem && <div style={{ width: 'calc(100% - 40px)' }} className="absolute bottom-0 -right-3.5 h-[1px] bg-divider dark:bg-divider-dark" />}
                    {isActive && isLastedItem &&
                        <div style={{ width: 'calc(100% - 40px)' }} className="absolute bottom-0 -right-3.5 h-[1px] bg-divider dark:bg-divider-dark" />}
                </div>
            )
        })
    }, [state.rewardItemExpand, data?.task_list, loading, claiming, claim, onClaim, configs, language, width, isMobile])

    // const renderClaimAllBtn = useCallback(() => {
    //     if (width >= BREAK_POINTS.lg) return  null
    //
    //     let status
    //     const isClaimableAll = data?.filter(o => o?.user_metadata?.status !== Types.TASK_HISTORY_STATUS.PENDING)?.length > 0
    //     const isClaimedAll = data?.filter(o => o?.user_metadata?.status === Types.TASK_HISTORY_STATUS.CLAIMED)?.length === data?.length
    //
    //     if (isClaimableAll) {
    //         status = REWARD_BUTTON_STATUS.AVAILABLE
    //     }
    //
    //     if (isClaimedAll) {
    //         status = REWARD_BUTTON_STATUS.NOT_AVAILABLE
    //     }
    //
    //     return (
    //         <div className="mt-3.5 flex justify-center">
    //             {auth && <RewardButton title={t('reward-center:claim_all')}
    //                                    status={status}
    //                                    onClick={() => alert(`should Claim all Reward !`)}
    //                                    buttonStyles="mt-2 mb-7 md:min-w-[150px]"
    //             />}
    //         </div>
    //     )
    // }, [data, width, auth])

    useEffect(() => {
        let rewardItemExpand = {}
        if (data?.length) {
            data?.forEach(o => {
                if (o?.user_metadata?.claim_status === Types.TASK_HISTORY_CLAIM_STATUS.PENDING &&
                    o?.user_metadata?.status === Types.TASK_HISTORY_STATUS.FINISHED) {
                    rewardItemExpand = { ...rewardItemExpand, [o?._id]: true }
                }
            })
        }
        if (Object.keys(rewardItemExpand)?.length) setState({ rewardItemExpand })
    }, [data])

    return (
        <div>
            <div className="pl-8 sm:pl-10 sm:pb-5">
                {renderList()}
            </div>
            {/*{renderClaimAllBtn()}*/}
        </div>
    )
}

export default RewardListItem
