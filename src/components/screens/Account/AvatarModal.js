import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { SET_USER_AVATAR, USER_AVATAR_PRESET } from 'redux/actions/apis';
import { BREAK_POINTS } from 'constants/constants';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { ApiStatus } from 'redux/actions/const';
import { isMobile } from 'react-device-detect';
import { Share } from 'react-feather';
import { getMe } from 'redux/actions/user';

import useWindowSize from 'hooks/useWindowSize';
import CheckSuccess from 'components/svg/CheckSuccess';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import Dropzone from 'react-dropzone';
import Skeletor from 'components/common/Skeletor';
import ReModal, { REMODAL_BUTTON_GROUP, REMODAL_POSITION } from 'components/common/ReModalOld';
import colors from 'styles/colors';
import Axios from 'axios';

const UPLOAD_TIMEOUT = 4000

const AVATAR_KEY = 'avatar_index_'

const AVATAR_SIZE_LIMIT = 2e6

const AVATAR_TYPE = {
    CURRENT: 'current',
    CUSTOM: 'custom',
    PRESET: 'preset'
}

const UPLOADING_STATUS = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    RE_INITIALIZING: 're_initializing',
    DONE: 'done',
    FAILURE: 'failure'
}


const INITIAL_STATE = {
    avatar: { type: AVATAR_TYPE.CURRENT },
    avatarIssues: null,
    avatarPreset: null,
    loadingAvatarPreset: false,
    uploading: UPLOADING_STATUS.IDLE,
    uploadingPercent: 0,
    completeFlag: null,
    showUpload: false,
    notice: {},

    //
}

const AvatarModal = ({ isVisible, onCloseModal }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    // Rdx
    const user = useSelector(state => state.auth?.user)
    const dispatch = useDispatch()

    // Use hooks
    const { t, i18n: { language } } = useTranslation()
    const [currentTheme, ] = useDarkMode()
    const { width } = useWindowSize()

    // Data Helper
    const getAvatarPreset = async () => {
        !state.avatarPreset && setState({ loadingAvatarPreset: true })

        try {
            const { data: { status, data: avatarPreset } } = await Axios.get(USER_AVATAR_PRESET)
            if (status === ApiStatus.SUCCESS && avatarPreset) {
                setState({ avatarPreset })
            }
        } catch (e) {
            console.log(`Cant't get avatar preset`)
        } finally {
            setState({ loadingAvatarPreset: false })
        }
    }

    const setAvatarPreset = async (image) => {
        setState({ uploading: UPLOADING_STATUS.UPLOADING })

        try {
            const { data } = await Axios.post(USER_AVATAR_PRESET, { image }, {
                onUploadProgress: (event) => setState({ uploadingPercent: Math.round((event?.loaded * 100) / event?.total) })
            })
            if (data?.status === ApiStatus.SUCCESS) {
                setState({ completeFlag: data?.status, uploading: UPLOADING_STATUS.RE_INITIALIZING })
                await dispatch(getMe())
                setTimeout(() => {
                    setState({
                        uploading: UPLOADING_STATUS.DONE,
                        notice: { message: t('profile:updated_avatar'), style: '!visible text-dominant' },
                        avatar: { source: data?.data?.avatar, type: AVATAR_TYPE.CURRENT }
                    })
                }, 1800)
                setTimeout(() => {
                    setState({ uploading: UPLOADING_STATUS.IDLE })
                }, UPLOAD_TIMEOUT)
            }
        } catch (e) {
            console.log(`Can't set preset avatar ${image} `, e)
            setState({
               completeFlag: null,
               uploading: UPLOADING_STATUS.FAILURE,
               notice: { message: t('common:uploader.failure'), style: '!visible text-red' }
            })
        }
    }

    const setCustomAvatar = async (image) => {
        setState({ uploading: true })

        if (!(image || image?.length)) {
            return
        }

        try {
            const formData = new FormData()
            formData.append('image', image[0])

            const { data } = await Axios.post(SET_USER_AVATAR, formData, {
                onUploadProgress: (event) => setState({ uploadingPercent: Math.round((event?.loaded * 100) / event?.total) })
            })

            if (data?.status === ApiStatus.SUCCESS) {
                setState({ completeFlag: data?.status, uploading: UPLOADING_STATUS.RE_INITIALIZING })
                await dispatch(getMe())
                setTimeout(() => {
                    setState({
                        uploading: UPLOADING_STATUS.DONE,
                        notice: { message: t('profile:updated_avatar'), style: '!visible text-dominant' },
                        avatar: { source: data?.data?.avatar, type: AVATAR_TYPE.CURRENT }
                    })
                }, 1800)
                setTimeout(() => {
                    setState({ uploading: UPLOADING_STATUS.IDLE })
                }, UPLOAD_TIMEOUT)
            }
        } catch (e) {
            console.log(`Can't set custom avatar `, e)
            setState({
                completeFlag: null,
                uploading: UPLOADING_STATUS.FAILURE,
                notice: { message: t('common:uploader.failure'), style: '!visible text-red' }
            })
        }
    }

    // Utilities
    const customAvatarTips = useMemo(() => {
        let text1, text2

        if (language === LANGUAGE_TAG.VI) {
            text1 = <>
                Kéo thả hình ảnh vào đây hoặc <span className="text-dominant">{isMobile ? 'chạm' : 'click'} để duyệt</span>
            </>
            text2 = <>
                Nhấn "Lưu" để cập nhật ảnh đại diện này hoặc "Đặt lại" để hoàn tác.
            </>
        } else {
            text1 = <>
                Drag your image here, or <span className="text-dominant">{isMobile ? 'touch' : 'click'} to browse</span>
            </>
            text2 = <>
                Press "Save" to use this avatar or "Reset" to undo.
            </>
        }

        return { text1, text2 }
    }, [language])

    const currentAvatarType = useMemo(() => {
        switch (state.avatar?.type) {
            case AVATAR_TYPE.PRESET:
                return `${t('profile:using_avatar_preset')} ${+state.avatar?.presetId + 1}`
            case AVATAR_TYPE.CUSTOM:
                return t('profile:set_custom_avatar')
            default:
                return t('profile:your_avatar')

    }
    }, [state.avatar?.type, state.avatar?.presetId])

    const buttonGroupStatus = useMemo(() => {
        let status

        if (state.avatar?.source === user?.avatar || !state.avatar?.source) {
            status = REMODAL_BUTTON_GROUP.ALERT
        } else {
             status = REMODAL_BUTTON_GROUP.SINGLE_CONFIRM
        }

        return status
    }, [state.avatar?.source, user?.avatar])

    const reModalClassName = useMemo(() => {
        let className = ''

        if (width >= BREAK_POINTS.lg) {
            className = 'min-w-[800px] min-h-[545px] pt-4 pb-10'
        }

        if (width >= BREAK_POINTS.xl) {
            className = 'min-w-[979px] min-h-[595px] pt-4 pb-10'
        }

        return className
    }, [width])

    const setAvatar = (payload) => {

        if (payload?.type === AVATAR_TYPE.CUSTOM) {
            setCustomAvatar(payload?.raw)
        }

        if (payload?.type === AVATAR_TYPE.PRESET) {
            setAvatarPreset(payload?.source)
        }
    }

    const onSetCustomAvatar = () => setState({ showUpload: true, notice: {}, avatarIssues: null, avatar: { source: null, type: AVATAR_TYPE.CUSTOM } })

    const onClearAvatar = () => setState({ showUpload: false, notice: {}, avatarIssues: null, avatar: { source: user?.avatar, type: AVATAR_TYPE.CURRENT } })

    const onUsePresetAvatar = (index, url) => {
        setState({
            showUpload: false,
            avatar: {
                [`${AVATAR_KEY}${index}`]: true,
                presetId: index,
                type: AVATAR_TYPE.PRESET,
                source: url
            },
            avatarIssues: null,
            notice: {}
        })
    }

    const onDropCustomAvatar = (images) => {
        if (!images || !images?.length) return
        let file = images[0]
        const reader = new FileReader()

        // Set preview data
        reader.onload = (event) => setState({
            uploadedSrc: event?.target?.result ,
            avatar: {
                raw: images, // Init file to upload
                source: event?.target?.result,
                type: AVATAR_TYPE.CUSTOM
            },
            showUpload: false
        })
        reader.readAsDataURL(file)
    }

    const onValidatingAvatarSize = ({ size }) => {
        if (!size) return
        if (size > AVATAR_SIZE_LIMIT) {
            setState({ avatarIssues: t('common:uploader.not_over', { limit: `${AVATAR_SIZE_LIMIT / 1e6} MB` }) })
        } else {
            setState({ avatarIssues: null })
        }
    }

    const onLeaveModal = () => {
        setState({
            avatar: { type: AVATAR_TYPE.CURRENT },
            showUpload: false,
            completeFlag: null,
            uploading: UPLOADING_STATUS.IDLE,
            uploadingPercent: 0,
            avatarPreset: null,
            notice: {},
            avatarIssues: null,
        })
        onCloseModal()
    }

    // Render handler
    const renderCurrentAvatar = useCallback(() => {
        const isCustom = state.avatar?.type === AVATAR_TYPE.CUSTOM
        const isCurrent = state.avatar?.type === AVATAR_TYPE.CURRENT
        const isPreset = state.avatar?.type === AVATAR_TYPE.PRESET

        return (
            <div className="mt-5 lg:mt-8 flex flex-col items-center justify-center lg:justify-between">
                <div className="w-[132px] h-[132px] md:w-[180px] md:h-[180px] lg:w-[138px] lg:h-[138px] xl:w-[180px] xl:h-[180px] xl:mt-3 drop-shadow-common dark:drop-shadow-none dark:border-[2px] dark:border-dominant rounded-full overflow-hidden">
                    {state.uploading === UPLOADING_STATUS.UPLOADING ?
                    <Skeletor circle width={132} height={132} />
                    : <img src={!isCurrent ? state.avatar?.source : user?.avatar} className="m-auto w-full h-full" alt={null}/>}
                </div>
                <div className={!isCustom ? 'm-2 px-5 lg:mt-3.5 lg:mb-0 text-center text-xs sm:text-sm font-medium invisible hidden' : 'mt-2 px-5 lg:mt-3.5 lg:mb-0 text-center text-xs sm:text-sm font-medium block '}>
                    {customAvatarTips?.text2}
                </div>
                <div className={isCustom ? 'mt-4 md:mt-8 lg:mt-2.5 flex items-center justify-center' : 'mt-4 md:mt-8 lg:mt-8 flex items-center justify-center'}>
                    {(isCurrent || isPreset) &&
                    <div className="py-2 px-3.5 min-w-[90px] sm:min-w-[100px] md:min-w-[120px] font-medium text-center text-xs sm:text-sm text-white bg-dominant hover:opacity-80 cursor-pointer select-none rounded-lg"
                         onClick={onSetCustomAvatar}>
                        {t('profile:set_custom_avatar')}
                    </div>}
                    {(isCustom || isPreset) &&
                    <div className="ml-3 py-2 px-3.5 min-w-[90px] sm:min-w-[100px] md:min-w-[120px] font-medium text-center text-xs sm:text-sm text-white bg-red hover:opacity-80 cursor-pointer select-none rounded-lg"
                         onClick={onClearAvatar}>
                        {t('common:reset')}
                    </div>}
                </div>
            </div>
        )
    }, [user?.avatar, state.avatar?.source, state.avatar?.type, state.uploading])

    const renderUploadAvatar = useCallback(() => {
        return (
            <Dropzone onDrop={onDropCustomAvatar}
                      validator={onValidatingAvatarSize}
                      maxFiles={1}
                      maxSize={AVATAR_SIZE_LIMIT}
                      multiple={false}
                      accept="image/jpeg, image/png"
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className="mt-3 lg:mt-8 xl:mt-10 py-8 flex flex-col justify-center items-center rounded-xl border border-dashed border-dominant cursor-pointer">
                            <Share className="text-dominant"/>
                            <div className="mt-3.5 font-medium text-center text-sm lg:text-[16px] xl:text-[18px] lg:px-10">
                                {customAvatarTips?.text1}
                            </div>
                            <div className="mt-2 text-xs lg:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                                {t('common:support_type', { types: 'JPG, PNG' })}
                            </div>
                            {state.avatarIssues &&
                            <div className="mt-2.5 text-xs sm:text-sm text-red">
                                {state.avatarIssues}
                            </div>}
                        </div>
                    </div>
                )}
            </Dropzone>
        )
    }, [state.uploading, state.uploadingPercent, state.avatarIssues, customAvatarTips, currentTheme])

    const renderAvatarPreset = useCallback(() => {
        if (!state.avatarPreset || state.loadingAvatarPreset) {
            const skeleton = []
            for (let i = 0; i < 12; ++i) {
                skeleton.push(
                    <div key={`avatar_list__${i}`} className="relative w-1/4 sm:w-1/6 lg:w-1/4 p-2 xl:p-2.5 flex items-center justify-center">
                        <Skeletor circle className="!w-[58px] !h-[58px] sm:!w-[78px] sm:!h-[78px]" />
                    </div>
                )
            }
            return skeleton
        } else {
            return state.avatarPreset?.map((avt, index) => (
                <div key={`avatar_list__${index}`} className="relative w-1/4 sm:w-1/6 lg:w-1/4 p-2 xl:p-2.5 cursor-pointer hover:opacity-80 cursor-pointer">
                    <img className={state.avatar?.[`${AVATAR_KEY}${index}`] ? 'rounded-full border border-dominant' : 'rounded-full border border-transparent'}
                         onClick={() => onUsePresetAvatar(index, avt)}
                         src={avt}
                         alt={null}/>
                    {avt === user?.avatar &&
                    <CheckSuccess className="absolute bottom-[12.5%] right-[12.5%]" size={width >= BREAK_POINTS.sm ? 16 : 14}/>}
                </div>
            ))
        }
    }, [state.avatar, state.avatarPreset, state.loadingAvatarPreset, user?.avatar, width])

    const renderUploadControl = useCallback(() => {
        const DEFAULT = 'absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 max-w-[88%] sm:max-w-[400px] w-full font-medium rounded-xl bg-teal-lightTeal dark:bg-darkBlue-3 max-h-[0px] invisible opacity-0 transition-all duration-200 '
        let className
        let uploadingStatus
        let statusStyles = ''
        let color

        if (state.uploading !== UPLOADING_STATUS.IDLE) {
            className = DEFAULT + 'mt-3.5 lg:mt-6 py-2.5 !visible !opacity-100 !max-h-[100px]'
        } else {
            className = DEFAULT
        }

        switch (state.uploading) {
            case UPLOADING_STATUS.RE_INITIALIZING:
                uploadingStatus = t('profile:initializing_avatar')
                statusStyles = 'text-dominant'
                color = colors.teal
                break
            case UPLOADING_STATUS.DONE:
                uploadingStatus = t('common:success')
                statusStyles = 'text-dominant'
                break
            case UPLOADING_STATUS.FAILURE:
                uploadingStatus = t('common:failed')
                statusStyles = 'text-red'
                break
            case UPLOADING_STATUS.UPLOADING:
            default:
                uploadingStatus = t('common:uploader.uploading')
                statusStyles = ''
                color = currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey1
                break
        }

        return (
            <div className="px-4">
                <div className={className}>
                <span className="text-sm flex items-end">
                    <span className={statusStyles}>{uploadingStatus}</span>
                    {(state.uploading !== UPLOADING_STATUS.DONE && state.uploading !== UPLOADING_STATUS.FAILURE)
                    && <PulseLoader size={2.2} color={color}/>}
                </span>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">
                        {state.uploadingPercent}% - {t('common:uploader.time_remain', { time: 0 })}
                    </div>
                    <div className="mt-1 relative w-full h-[2px] bg-gray-3 dark:bg-darkBlue-5">
                        <div style={{ width: `${state.uploadingPercent}%` }}
                             className="absolute transition-all duration-200 h-full left-0 top-0 bg-dominant"/>
                    </div>
                </div>
            </div>
        )
    }, [state.uploading, state.uploadingPercent, currentTheme])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: => ', state)
    // }, [state])

    useEffect(() => {
        isVisible && getAvatarPreset()
    }, [isVisible])

    return (
        <ReModal useOverlay
                 useCrossButton
                 useButtonGroup={buttonGroupStatus}
                 buttonGroupWrapper="max-w-[350px] m-auto lg:mt-8"
                 position={
                     width >= BREAK_POINTS.lg ?
                         REMODAL_POSITION.CENTER
                         : {
                             mode: REMODAL_POSITION.FULLSCREEN.MODE,
                             from: REMODAL_POSITION.FULLSCREEN.FROM.RIGHT,
                         }
                 }
                 isVisible={!!isVisible}
                 className={reModalClassName + ' overflow-hidden'}
                 onNegativeCb={onLeaveModal}
                 onBackdropCb={() => state.uploading !== UPLOADING_STATUS.UPLOADING && state.uploading !== UPLOADING_STATUS.RE_INITIALIZING && onLeaveModal()}
                 onPositiveCb={() => setAvatar(state.avatar)}
                 title={t('profile:set_avatar_title')}
                 positiveLabel={t('common:save')}
                 message={state.notice?.message}
                 messageWrapper={state.notice?.style}
        >
            <div className={`absolute z-20 top-0 left-0 w-full h-full bg-darkBlue dark:bg-gray-1 opacity-0 invisible transition-200 ease-in ${state.uploading !== UPLOADING_STATUS.IDLE ? '!visible !opacity-80' : ''}`}/>
            {renderUploadControl()}
            <div className="relative z-10 pt-5 h-full min-h-[540px] lg:min-h-[0px] lg:mt-10 lg:pb-4 lg:px-10 xl:px-16 flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 lg:pr-8 lg:min-h-[287px] xl:min-h-[336px]">
                    <div className="font-medium text-center text-dominant text-sm md:text-[16px] xl:text-[18px]">
                        {currentAvatarType}
                    </div>
                    {!state.showUpload && renderCurrentAvatar()}
                    {state.showUpload && renderUploadAvatar()}
                </div>
                <div className="mt-8 md:mt-10 lg:mt-0 pb-5 lg:pb-0 lg:pl-4 w-full lg:w-1/2">
                    <div className="pb-3 font-medium text-center text-dominant text-sm md:text-[16px] xl:text-[18px]">
                        {t('profile:nami_default_avatar')}
                    </div>
                    <div className="flex flex-wrap select-none md:mt-2 overflow-x-hidden lg:max-h-[220px] lg:max-h-[250px] xl:max-h-[270px]">
                        {renderAvatarPreset()}
                    </div>
                </div>
            </div>
        </ReModal>
    )
}

export default AvatarModal
