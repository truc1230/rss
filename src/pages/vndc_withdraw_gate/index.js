import { useCallback, useEffect, useState } from 'react';
import {
    DIM,
    EWHeader,
    EWHeaderTool,
    EWHeaderUser,
    EWHeaderUserAvatar,
    EWHeaderUserId,
    EWHeaderUserInfo,
    EWHeaderUserName,
    EWModal,
    EWSectionSubTitle,
    EWSectionTitle,
    EWWalletItem,
    EWWalletTokenAlias,
    EWWalletTokenBalance,
    EWWalletTokenDescription,
    EWWalletTokenIcon,
    EWWalletTokenInfo,
    EWWalletTokenInner,
    EWWalletTokenLabel,
    EWWalletWrapper,
    ExternalWdlRoot,
    MoreToken,
    NoticePopup,
} from 'components/screens/OnusWithdrawGate/styledExternalWdl';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Coffee, Download, Key, Moon, Sun, X } from 'react-feather';

import { sortBy } from 'lodash';
import { PulseLoader, ScaleLoader } from 'react-spinners';
import NumberFormat from 'react-number-format';
import { roundToDown } from 'round-to';
import Axios from 'axios';
import InputRange from 'react-input-range';
// import WithdrawSuccessIMG from '../../../public/images/icon/wdl_success.png';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useLanguage from 'hooks/useLanguage';
import {
    buildNamiExchangeAppLink,
    currencyToText,
    getAvailableToken,
    getCurrencyDescription,
    getTimeStampRange,
    handleLogin,
    WalletCurrency,
} from 'components/screens/OnusWithdrawGate/helper';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AssetLogo from 'components/wallet/AssetLogo';

import 'react-input-range/lib/css/index.css';
import classNames from 'classnames';
import { DIRECT_WITHDRAW_VNDC } from 'redux/actions/apis';

const WDL_LIST = [
    // WalletCurrency.USDT,
    WalletCurrency.ATS,
    // WalletCurrency.BAMI,
    WalletCurrency.KAI,
    WalletCurrency.ONUS,
    // WalletCurrency.BTC,
    // WalletCurrency.ETH,
    WalletCurrency.WHC,
    // WalletCurrency.SFO
];

const MIN_WITHDRAWAL = {
    [WalletCurrency.VNDC]: 300e3,

    [WalletCurrency.ONUS]: 0.1,
    [WalletCurrency.KAI]: 200,
    [WalletCurrency.NAC]: 1000,
    [WalletCurrency.ATS]: 125,
    [WalletCurrency.WHC]: 0.1,
    [WalletCurrency.SFO]: 2e5
};
const MAX_WITHDRAWAL = {
    [WalletCurrency.VNDC]: 500e6,
    [WalletCurrency.ONUS]: 5000,
    [WalletCurrency.KAI]: 10000,
    [WalletCurrency.NAC]: 100000,
    [WalletCurrency.ATS]: 100000,
    [WalletCurrency.WHC]: 100000,
    [WalletCurrency.SFO]: 100e6
};
const VNDC_WITHDRAWAL_FEE = {
    [WalletCurrency.VNDC]: 1e3,
    [WalletCurrency.ONUS]: 0.1,
    [WalletCurrency.KAI]: 1,
    [WalletCurrency.NAC]: 1,
    [WalletCurrency.ATS]: 1,
    [WalletCurrency.WHC]: 0.1,
    [WalletCurrency.SFO]: 2e3
};
const DECIMAL_SCALES = {
    [WalletCurrency.VNDC]: 0,
    [WalletCurrency.ONUS]: 1,
    [WalletCurrency.KAI]: 1,
    [WalletCurrency.NAC]: 2,
    [WalletCurrency.ATS]: 2,
    [WalletCurrency.WHC]: 2,
    [WalletCurrency.SFO]: 8
};
const WDL_STATUS = {
    UNKNOWN: "UNKNOWN",
    MINIMUM_WITHDRAW_NOT_MET: "MINIMUM_WITHDRAW_NOT_MET",
    LOGGED_OUT: "LOGGED_OUT",
    INVALID_INPUT: "INVALID_INPUT",
    NOT_ENOUGH_BASE_CURRENCY: "NOT_ENOUGH_BASE_CURRENCY",
    NOT_ENOUGH_EXCHANGE_CURRENCY: "NOT_ENOUGH_EXCHANGE_CURRENCY",
    not_in_range: "not_in_range"
};
const VNDC_MAINTAINANCE = false
const MAINTAIN = true

const ExternalWithdrawal = (props) => {
    // initial state
    const [currentCurr, setCurrentCurr] = useState(null)
    const [tokenAvailable, setTokenAvailable] = useState(null)
    const [isLimit] = useState(true)
    const [walletArr, setWalletArr] = useState(null)
    const [amount, setAmount] = useState('init')
    const [modal, setModal] = useState({
        isWithdrawModal: false,
        isSuccessModal: false,
        isNotice: false,
    })
    const [state, setState] = useState({
        onFocusAmountInput: false,
        onSlidingRate: false,
    })
    const [sliderRate, setSliderRate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [onSubmit, setOnSubmit] = useState(false)
    const [wdlResult, setWdlResult] = useState(null)
    const [error, setError] = useState(null)

    // map state from redux
    const user = useSelector((state) => state.auth.user) || null
    const balance = useSelector((state) => state.wallet.SPOT) || null

    // use hooks
    const [activeLanguage, onChangeLanguage] = useLanguage()
    const { t } = useTranslation()
    const [theme] = useDarkMode()
    const isDark = true

    // helper
    const handleModal = (key, value = null) =>
        setModal({ ...modal, [key]: value })

    const handleTool = (key, value = false) =>
        setState({ ...state, [key]: value })

    const cookingWallet = (balance) => {
        if (!balance) return null
        let arr = []
        let cloner = []
        WDL_LIST.forEach((item) => {
            arr.push({
                currency: item,
                alias: currencyToText(item),
                des: getCurrencyDescription(item),
                available: getAvailableToken(item, balance),
            })
        })

        cloner = sortBy(arr, 'available', 'currency')
        cloner.push({
            currency: WalletCurrency.VNDC,
            alias: currencyToText(WalletCurrency.VNDC),
            des: getCurrencyDescription(WalletCurrency.VNDC),
            available: getAvailableToken(WalletCurrency.VNDC, balance),
        })
        cloner.push({
            currency: WalletCurrency.NAC,
            alias: currencyToText(WalletCurrency.NAC),
            des: getCurrencyDescription(WalletCurrency.NAC),
            available: getAvailableToken(WalletCurrency.NAC, balance),
        })

        // console.log('>>> setWalletArr ', cloner)

        setWalletArr(cloner.reverse())
    }

    const openWdlModal = (currency, balance, user) => {
        if (!user) {
            handleModal('isNotice', true)
        } else {
            handleModal('isWithdrawModal', true)
            setTokenAvailable(balance)
            setCurrentCurr(currency)
        }
    }

    const onCloseWdlModal = (key, value) => {
        setAmount('init')
        setError(null)
        setSliderRate(null)
        handleModal(key, value)
    }

    const onAllDone = () => {
        setState({ onFocusAmountInput: false, onSlidingRate: false })
        setModal({ isWithdrawModal: false, isSuccessModal: false })
        setAmount('init')
        setCurrentCurr(null)
        setWdlResult(null)
        setError(null)
        setTokenAvailable(null)
        setSliderRate(null)
    }

    const getAmountByRate = (rate, tokenAvailable, currency) => {
        setSliderRate(rate)
        setAmount(
            (rate / 100) * roundToDown(tokenAvailable, DECIMAL_SCALES[currency])
        )
    }

    const onWdl = async (amount, currency, balance) => {
        // console.log('namidev-DEBUG: RE-CHECK__ ', amount, currency)

        try {
            setOnSubmit(true)
            setError(null)
            const { data } = await Axios.post(DIRECT_WITHDRAW_VNDC, {
                amount,
                currency,
            })
            // let data = { status: 'ok', message: 'PHA_KE_DATA' }
            if (data && data.status === 'ok') {
                const res = (data.hasOwnProperty('data') && data.data) || {}
                setWdlResult(res) // get withdraw result
                handleModal('isSuccessModal', true)
            } else {
                // console.log('namidev-DEBUG: ERROR_OCCURED____ ', data)
                const status = data ? data.status : WDL_STATUS.UNKNOWN
                // console.log('namidev-DEBUG: STATUS__ ', status)
                // Axios.post(
                //     'https://webhook.site/85a6b4da-96b2-41d4-95cb-f20684503ce4',
                //     {
                //         name: 'onWithdraw Result',
                //         data,
                //     }
                // )

                // handle problem
                switch (status) {
                    case WDL_STATUS.MINIMUM_WITHDRAW_NOT_MET:
                        setError(t('ext_gate:err.min_wdl_not_met'))
                        break
                    case WDL_STATUS.INVALID_INPUT:
                        setError(t('ext_gate:err.invalid_input'))
                        break
                    case WDL_STATUS.LOGGED_OUT:
                        setError(t('ext_gate:err.logged_out'))
                        break
                    case WDL_STATUS.NOT_ENOUGH_BASE_CURRENCY:
                    case WDL_STATUS.NOT_ENOUGH_EXCHANGE_CURRENCY:
                        setError(t('ext_gate:err.insufficient'))
                        break
                    case WDL_STATUS.not_in_range:
                        setError(t('ext_gate:err.not_in_range'))
                        break
                    default:
                        setError(t('ext_gate:err.unknown'))
                        break
                }
            }
        } catch (e) {
            console.log('Notice: ', e)
        } finally {
            setOnSubmit(false)
        }
    }

    // render handler
    const renderUserPanel = useCallback(() => {
        const { avatar, username, code, email } = user || {}
        const alt_username = (email && email.split('@')) || []
        const who = username || alt_username[0] || t('ext_gate:guest')

        return (
            <EWHeader className='bg-gray-4 dark:bg-darkBlue'>
                <EWHeaderUser>
                    <EWHeaderUserAvatar
                        src={avatar || '/images/default-user-avatar.png'}
                        alt=''
                    />
                    <EWHeaderUserInfo>
                        <EWHeaderUserName>
                            {t('ext_gate:hi_user', { who })}
                        </EWHeaderUserName>
                        <EWHeaderUserId isDark={isDark}>
                            {code || t('ext_gate:suggest_nami')}
                        </EWHeaderUserId>
                    </EWHeaderUserInfo>
                </EWHeaderUser>
                <EWHeaderTool>
                    <span onClick={onChangeLanguage}>
                        {activeLanguage === 'vi' ? 'VI' : 'EN'}
                    </span>
                </EWHeaderTool>
            </EWHeader>
        )
    }, [user, activeLanguage, isDark])

    const renderWallet = useCallback(() => {
        if (!walletArr) return null
        const range = !isLimit ? 5 : walletArr.length

        // console.log('>> walletArr ', walletArr)
        return walletArr.slice(0, range).map((item) => {
            const { currency, alias, des, available } = item
            // console.log('>>> ', item)
            const availableRounded = roundToDown(
                available,
                DECIMAL_SCALES[currency]
            )
            // console.log('>>> ', availableRounded, DECIMAL_SCALES[currency])
            const converted = formatNumber(availableRounded)

            // handle loading
            let bridgeValue = converted === '0' ? '0.0000' : converted
            if (converted === '0') bridgeValue = '0.0000'
            if (loading) bridgeValue = <PulseLoader size={3} color='#03BBCC' />

            return (
                <EWWalletItem
                    key={currency}
                    onClick={() => openWdlModal(currency, available, user)}
                    isDark={isDark}
                >
                    <EWWalletTokenIcon>
                        <AssetLogo assetCode={currencyToText(currency)} />
                    </EWWalletTokenIcon>
                    <EWWalletTokenInfo>
                        <EWWalletTokenInner>
                            <EWWalletTokenAlias>{alias}</EWWalletTokenAlias>
                            <EWWalletTokenLabel isDark={isDark}>
                                <svg
                                    width='18'
                                    height='18'
                                    viewBox='0 0 18 18'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M6.75 15L3 12L6.75 9V11.25H16.5V12.75H6.75V15ZM11.25 9V6.75H1.5V5.25H11.25V3L15 6L11.25 9Z'
                                        fill='#00B6C7'
                                    />
                                </svg>
                                <span>{t('ext_gate:wdl')}</span>
                            </EWWalletTokenLabel>
                        </EWWalletTokenInner>
                        <EWWalletTokenInner>
                            <EWWalletTokenDescription
                                isDark={isDark}
                                ellipsis={converted.length < 10}
                            >
                                {des}
                            </EWWalletTokenDescription>
                            <EWWalletTokenBalance>
                                {!user ? '---' : bridgeValue}
                            </EWWalletTokenBalance>
                        </EWWalletTokenInner>
                    </EWWalletTokenInfo>
                </EWWalletItem>
            )
        })
    }, [currentCurr, balance, isLimit, walletArr, loading, user, isDark])

    const renderWithdrawModal = useCallback(() => {
        const fee = formatNumber(
            VNDC_WITHDRAWAL_FEE[currentCurr],
            DECIMAL_SCALES[currentCurr]
        )
        const minWdl = MIN_WITHDRAWAL[currentCurr] + VNDC_WITHDRAWAL_FEE[currentCurr]
        const maxWdl = MAX_WITHDRAWAL[currentCurr]
        const scale = DECIMAL_SCALES[currentCurr]
        const maxVal = tokenAvailable ? roundToDown(tokenAvailable, scale) : 0
        const shouldDisableWdl =
            amount === 'init' ||
            !amount ||
            amount === '' ||
            +amount < minWdl ||
            +amount > maxWdl ||
            +amount > tokenAvailable ||
            onSubmit ||
            amount === '.' ||
            (currentCurr === WalletCurrency.VNDC && VNDC_MAINTAINANCE)

        let msg
        if (amount === 'init') msg = null
        if (amount !== 'init' && +amount < minWdl){
            msg = t('ext_gate:min_notice', {
                minVal: formatNumber(minWdl, 7, 0, false),
            })
        }
        if (amount !== 'init'){
            if(tokenAvailable < maxWdl){
                if (+amount > tokenAvailable) msg = t('ext_gate:insufficient')
            }else {
                if (+amount > tokenAvailable)  msg = t('ext_gate:max_notice', {
                    maxVal: formatNumber(maxWdl, 7, 0, false),
                })
            }
        }
        if (amount !== 'init' && +amount >= minWdl && +amount <= tokenAvailable)
            msg = <Check size={14} color='#03BBCC' />

        return (
            <EWModal
                active={modal.isWithdrawModal}
                onFocus={state.onFocusAmountInput}
                isError={error}
                shouldHideSliderLabel={!state.onSlidingRate}
                shouldDisableWdl={shouldDisableWdl}
                isDark={isDark}
            >
                <div className='Tool'>
                    <X
                        onClick={() =>
                            onCloseWdlModal('isWithdrawModal', false)
                        }
                    />
                </div>
                <div className='Content'>
                    <div className='Content__Title'>
                        {t('ext_gate:wdl')} {currencyToText(currentCurr)}{' '}
                        <AssetLogo assetCode={currencyToText(currentCurr)} />
                    </div>
                    <div className='Content__subtitle'>
                        {t('ext_gate:available')}
                    </div>
                    <div className='Content__TokenAvailable'>
                        <span>
                            {!tokenAvailable ? '0.0000' : formatNumber(maxVal)}
                        </span>
                        <span>{currencyToText(currentCurr)}</span>
                    </div>
                    <div className='Content__subtitle'>
                        <span>{t('ext_gate:amount')}</span>
                        <span>{msg}</span>
                    </div>
                    <div className='Input__wrapper border border-divider dark:border-divider-dark'>
                        <NumberFormat
                            allowNegative={false}
                            thousandSeparator
                            type={scale === 0 ? 'tel' : 'text'}
                            decimalScale={scale}
                            placeholder={t('ext_gate:amount_hint')}
                            value={amount}
                            onValueChange={({ value }) =>
                                setAmount(value.trim())
                            }
                            // onFocus={() =>
                            //     handleTool('onFocusAmountInput', true)
                            // }
                            // onBlur={() => handleTool('onFocusAmountInput')}
                        />
                        <div
                            className='Max_otp bg-lightTeal dark:bg-teal-opacity'
                            onClick={() => setAmount(Math.min(maxVal, maxWdl))}
                        >
                            {t('ext_gate:max_opt')}
                        </div>
                        <div className='Token__unit'>
                            {currencyToText(currentCurr)}
                        </div>
                    </div>
                    <div className='Content__SliderAmount'>
                        <InputRange
                            onChange={(value) =>
                                getAmountByRate(
                                    value,
                                    tokenAvailable,
                                    currentCurr
                                )
                            }
                            onChangeStart={() =>
                                handleTool('onSlidingRate', true)
                            }
                            onChangeComplete={() =>
                                handleTool('onSlidingRate', false)
                            }
                            maxValue={100}
                            minValue={0}
                            name={`Ext_WDL__${currentCurr}`}
                            value={sliderRate ? sliderRate : 0}
                        />
                    </div>
                    <div className='Content__AdditionalInfo'>
                        <span>{t('ext_gate:trans_fee')}</span>
                        <span>
                            {fee} {currencyToText(currentCurr)}
                        </span>
                    </div>
                    {currentCurr === WalletCurrency.VNDC && VNDC_MAINTAINANCE && (
                        <div
                            className='Error__'
                            style={{
                                height: 50,
                                visibility: 'visible',
                                opacity: 1,
                            }}
                        >
                            {t('ext_gate:err.vndc_maintain')}
                        </div>
                    )}
                    <div className='Error__'>{error}</div>
                </div>
                <div
                    className='Wdl__Button'
                    onClick={() =>
                        !shouldDisableWdl &&
                        onWdl(+amount, currentCurr, balance)
                    }
                >
                    <a
                        href='#'
                        className={classNames('!bg-dominant', {
                            '!bg-gray-1 dark:!bg-darkBlue-4': shouldDisableWdl,
                        })}
                    >
                        {onSubmit ? (
                            <ScaleLoader color='#FFF' size={8} />
                        ) : (
                            <>
                                {t('ext_gate:wdl_btn')}{' '}
                                <Download size={15} color='#FFF' />
                            </>
                        )}
                    </a>
                </div>
            </EWModal>
        )
    }, [
        currentCurr,
        amount,
        tokenAvailable,
        sliderRate,
        onSubmit,
        error,
        balance,
        modal.isWithdrawModal,
        state.onFocusAmountInput,
        state.onSlidingRate,
        isDark,
    ])

    const renderSuccessModal = useCallback(() => {
        const amountLeft =
            (wdlResult &&
                wdlResult.hasOwnProperty('amountLeft') &&
                wdlResult.amountLeft) ||
            0
        const scale = DECIMAL_SCALES[currentCurr]

        const rmnBalance = amountLeft ? roundToDown(amountLeft, scale) : 0



        return (
            <EWModal active={modal.isSuccessModal} isSuccess={true}>
                <div className='Tool'>
                    <X onClick={onAllDone} />
                </div>
                {/*{wdlResult && (*/}
                <div className='Content'>
                    <div className='Content__Success_Graphic'>
                        <img src={getS3Url("/images/icon/wdl_success.png")} alt="" />
                    </div>
                    <div className='Content__Success_Notice'>
                        {t('ext_gate:wdl_success')}
                    </div>
                    <div className='Content__WithdrawVal'>
                            <span>
                                -
                                {formatNumber(
                                    +amount,
                                    DECIMAL_SCALES[currentCurr]
                                )}
                            </span>
                        <span>{currencyToText(currentCurr)}</span>
                    </div>
                    <div className='Content__AfterWdl'>
                        <div className='AfterWdl__Info'>
                            <span>{t('ext_gate:remain_balance')}</span>
                            <span>
                                    {rmnBalance
                                        ? formatNumber(rmnBalance)
                                        : '0.0000'}
                                </span>
                        </div>
                        <div className='AfterWdl__Info'>
                            <span>{t('ext_gate:time')}</span>
                            <span>
                                    {formatTime(Date.now())}
                                </span>
                        </div>
                    </div>
                    <div className='Content__SuccessTips'>
                        <Coffee size={17} color='#03BBCC' />
                        <span>{t('ext_gate:tips')}</span>
                    </div>
                </div>
                <div className='Wdl__Button'>
                    <a href='#' onClick={onAllDone}>
                        {t('common:global_btn.confirm')}
                    </a>
                </div>
            </EWModal>
        )
    }, [wdlResult, amount, currentCurr, tokenAvailable, modal.isSuccessModal])

    const renderMaintainModal = () => {
        const start = 1630065600000 // 19:00:00 27/08/2021
        const end = 1630072800000 // 21:00:00 27/08/2021
        const shouldShow = getTimeStampRange(start, end)

        if (!shouldShow) return null

        document.addEventListener(
            'contextmenu',
            (e) => e.preventDefault(),
            false
        )
        return (
            <EWModal active={MAINTAIN} isMaintain={true}>
                <div className='Tool' />
                <div className='Content'>
                    <div className='Content__Success_Graphic'>
                        <img
                            src='/images/vndc_maintain.png'
                            alt='MAINTAINANCE'
                        />
                    </div>
                    <br />
                    <div className='Content__Success_Notice'>
                        {t('common:global_label.system_maintenance')}
                    </div>
                    <div className='Content__Maintainance'>
                        {t('global_notice.launchpad_maintain')}
                    </div>

                    <div className='Content__Success_Notice'>
                        {t('common:global_label.maintain_time_suggest')}
                    </div>

                    <div className='Content__Maintainance'>
                        <div className='additional_content__timeline'>
                            {t('common:global_label.from_time_to_time', {
                                start: <span>{formatTime(start)}</span>,
                                end: <span>{formatTime(end)}</span>,
                            })}
                        </div>
                    </div>
                </div>
                <div className='Wdl__Button'></div>
            </EWModal>
        )
    }

    useEffect(() => {
        cookingWallet(balance)
        balance && Object.entries(balance).length
            ? setLoading(false)
            : setLoading(true)
    }, [balance])

    return (
        <>
            <ExternalWdlRoot isDark={isDark}>
                {renderUserPanel()}
                <EWSectionTitle isDark={isDark}>
                    {t('ext_gate:nami_wallet')}
                    <span
                        onClick={() =>
                            (window.location.href = buildNamiExchangeAppLink())
                        }
                    >
                        {activeLanguage === 'vi' ? 'Tải App' : 'Download App'}
                        <img src={getS3Url('/images/logo/nami_maldives.png')} alt='' />
                    </span>
                </EWSectionTitle>
                <EWSectionSubTitle isDark={isDark}>
                    {t('ext_gate:description')}
                </EWSectionSubTitle>
                <EWWalletWrapper>{renderWallet()}</EWWalletWrapper>
                <MoreToken>
                    {/*<span>*/}
                    {/*    <Translate id={`ext_gate:see_${isLimit ? 'less' : 'more'}`}/>*/}
                    {/*    <i className={`ci-unfold_${isLimit ? 'less' : 'more'}`}/>*/}
                    {/*</span>*/}
                </MoreToken>
            </ExternalWdlRoot>

            {/*Modal section*/}
            {renderWithdrawModal()}
            {renderSuccessModal()}

            {renderMaintainModal()}

            <DIM
                active={modal.isNotice}
                isDark={isDark}
                onClick={() => handleModal('isNotice', false)}
            />
            <NoticePopup active={modal.isNotice} isDark={isDark}>
                <div className='NoticePopup__Header'>{t('modal:notice')}</div>
                <div className='NoticePopup__Content'>
                    <Key size={24} color='#03BBCC' />
                    {t('common:sign_in_to_continue')}
                    <a href='#' onClick={() => handleLogin(false)}>
                        {t('common:sign_in')}
                    </a>
                </div>
            </NoticePopup>
        </>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'modal',
            'ext_gate',
        ])),
    },
})

export default ExternalWithdrawal
