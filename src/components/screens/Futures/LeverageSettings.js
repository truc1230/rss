import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import { Minus, Plus, X } from 'react-feather';
import { ScaleLoader } from 'react-spinners';
import SvgWarning from 'components/svg/SvgWarning';
import Button from 'components/common/Button';
import Slider from 'components/trade/InputSlider';
import colors from 'styles/colors';
import Modal from 'components/common/ReModal';
import axios from 'axios';
import { formatNumber, getLoginUrl, scrollFocusInput, emitWebViewEvent } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TradingInput from 'components/trade/TradingInput';
import WarningCircle from '../../svg/WarningCircle'

const FuturesLeverageSettings = ({
    pair,
    isVisible,
    onClose,
    leverage,
    setLeverage,
    pairConfig,
    leverageBracket,
    isAuth,
    isVndcFutures,
    dots,
    className,
    onusMode = false,
    containerStyle,
}) => {
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation();
    const [_leverage, _setLeverage] = useState(leverage)
    const [_leverageBracket, _setLeverageBracket] = useState(
        pairConfig?.leverageBracket?.[0]
    )

    const onSetLeverage = async (symbol, leverage) => {
        setLoading(true)
        try {
            const { data } = await axios.post(API_FUTURES_LEVERAGE, {
                symbol,
                leverage,
            })
            console.log(data)
            if (data?.status === 'ok') {
                setLeverage(data?.data?.[symbol])
            }
        } catch (error) {
            // console.log(`Can't set leverage `, e)
        } finally {
            setLoading(false)
            onClose()
        }
    }

    const renderNotionalCap = useCallback(() => {
        return (
            <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                {formatNumber(
                    _leverageBracket?.notionalCap,
                    pairConfig?.quoteAssetPrecision
                )}{' '}
                {pairConfig?.quoteAsset}
            </span>
        )
    }, [_leverageBracket, pairConfig])

    const getValidator = useMemo(() => {
        let isValid = true;
        let msg = null;
        const min = pairConfig?.leverageConfig?.min ?? 0;
        const max = pairConfig?.leverageConfig?.max ?? 0;
        if (min > _leverage) {
            msg = `Minimum Qty is ${min}`
            isValid = false
        }
        if (max < _leverage) {
            msg = `Maximum Qty is ${max}`
            isValid = false
        }
        return { isValid, msg, isError: !isValid }
    }, [_leverage])

    const renderConfirmButton = useCallback(
        () => (
            <Button
                title={
                    loading ? (
                        <ScaleLoader
                            color={colors.white}
                            width={2}
                            height={12}
                        />
                    ) : (
                        t('futures:leverage:confirm')
                    )
                }
                onusMode={onusMode}
                componentType='button'
                className={`${onusMode ? '!text-[16px] !font-semibold !h-[48px]' : '!h-[36px]'} ${!onusMode && getValidator?.isError ? '!bg-gray-3 dark:!bg-darkBlue-4 text-gray-1 dark:text-darkBlue-2 cursor-not-allowed' : ''}`}
                type='primary'
                disabled={loading || getValidator?.isError}
                onClick={() => !loading && onSetLeverage(pair, _leverage)}
            />
        ),
        [_leverage, pair, loading, onusMode]
    )

    useEffect(() => {
        if (_leverage && pairConfig) {
            _setLeverageBracket(
                pairConfig?.leverageBracket?.find(
                    (o) => _leverage >= o?.initialLeverage
                )
            )
        }
    }, [_leverage, pairConfig])

    const onLogin = () => {
        emitWebViewEvent('login')
    }

    const changeClass = `w-5 h-5 flex items-center justify-center rounded-md  ${onusMode ? 'hover:bg-onus-bg2 dark:hover:bg-onus-bg2' : 'hover:bg-bgHover dark:hover:bg-bgHover-dark'}`

    return (
        <Modal
            onusMode={onusMode}
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName={`max-w-[306px] select-none ${className}`}
            containerStyle={{ ...containerStyle }}
        >
            <div className={`-mt-1 ${onusMode ? 'mb-6 text-lg' : 'mb-7 pb-4 text-sm'} flex items-center justify-between font-bold`}>
                {t('futures:leverage:title')}
                {!onusMode &&
                    <div
                        className='flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer'
                        onClick={onClose}
                    >
                        <X size={16} />
                    </div>
                }
            </div>
            <div className={`mb-1.5 font-medium text-txtSecondary dark:text-txtSecondary-dark ${onusMode ? 'uppercase text-xs' : 'text-sm'}`}>
                {t('futures:leverage:leverage')}
            </div>
            <div className={`px-2 flex items-center ${onusMode ? 'bg-onus-bg2 dark:bg-onus-bg2 mb-6 h-[44px]' : 'bg-gray-4 dark:bg-darkBlue-3 mb-4 h-[36px]'} rounded-[4px]`}>

                <div className={changeClass}>
                    <Minus
                        size={onusMode ? 20 : 10}
                        className={`${onusMode ? 'text-onus-white w-5' : 'text-txtSecondary dark:text-txtSecondary-dark'} cursor-pointer`}
                        onClick={() =>
                            _leverage > 1 &&
                            _setLeverage((prevState) => Number(prevState) - 1)
                        }
                    />
                </div>
                <TradingInput
                    onusMode={onusMode}
                    label=' '
                    value={_leverage}
                    suffix={'x'}
                    decimalScale={0}
                    containerClassName={`min-w-[200px] px-2.5 flex-grow text-sm font-medium border-none ${onusMode ? '!bg-onus-bg2 h-[44px]' : 'h-[36px]'}`}

                    inputClassName="!text-center"
                    onValueChange={({ value }) => _setLeverage(value)}
                    validator={getValidator}
                    inputMode="decimal"
                    allowedDecimalSeparators={[',', '.']}
                    onFocus={onusMode && scrollFocusInput}
                />
                <div className={changeClass}>
                    <Plus
                        size={onusMode ? 20 : 10}
                        className={`${onusMode ? 'text-onus-white w-5' : 'text-txtSecondary dark:text-txtSecondary-dark'} cursor-pointer`}
                        onClick={() =>
                            _leverage < pairConfig?.leverageConfig?.max &&
                            _setLeverage((prevState) => Number(prevState) + 1)
                        }
                    />
                </div>
            </div>
            <div className={`${onusMode ? 'mb-6' : 'mb-3'}`}>
                <Slider
                    onusMode={onusMode}
                    useLabel
                    positionLabel={onusMode ? 'top' : 'bottom'}
                    labelSuffix='x'
                    x={_leverage}
                    bgColorSlide={onusMode ? '#418FFF' : undefined}
                    bgColorActive={onusMode ? '#418FFF' : undefined}
                    // BgColorLine={onusMode ? colors.onus.bg2 : ''}
                    axis='x'
                    xmax={pairConfig?.leverageConfig?.max}
                    onChange={({ x }) =>
                        +x === 0 ? _setLeverage(1) : _setLeverage(x)
                    }
                    dots={dots}
                />
                {/* useLabel axis='x' x={percent.sl} xmax={100}
                        labelSuffix='%'
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'sl')}
                        bgColorSlide={colors.onus.red}
                        bgColorActive={colors.onus.red}
                        xStart={50}
                        reload={tab}
                        onChange={({ x }) => onChangePercent(x, 100, 'sl')} /> */}
            </div>
            {!isVndcFutures && <>
                <div className='mb-1 text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark select-none'>
                    *{t('futures:calulator:max_position_leverage')}: {renderNotionalCap()}
                </div>
                <span className='block mb-1 font-medium text-xs text-dominant'>
                    {t('futures:leverage:check_leverage')}
                </span>
            </>}
            {isAuth && <>
                {!isVndcFutures &&
                    <span className='block mb-1 font-medium text-xs text-dominant'>
                        {t('futures:leverage:position_limit_enlarge')}
                    </span>
                }
                <div className='mt-2.5 flex items-start'>
                    <div className='pt-1'>
                        {onusMode ?
                            <WarningCircle size={16} fill={colors.onus.orange} className="mt-[-2px]" />
                            :
                            <SvgWarning size={12} fill={colors.red2} />
                        }
                    </div>
                    <div className={`pl-2.5 font-medium text-xs ${onusMode ? 'text-onus-orange' : 'text-red'} `}>
                        {t('futures:leverage:description')}
                    </div>
                </div>
            </>
            }
            {isAuth ?
                <div className={`${onusMode ? 'mt-8' : 'mt-5 mb-2'}`}>{renderConfirmButton()}</div>
                :
                <div className={`${onusMode ? 'mt-8' : 'mt-5 h-full'} mb-2 cursor-pointer flex items-center justify-center `}>
                    <div className={`w-[200px] ${onusMode ? 'bg-onus-base' : 'bg-dominant font-medium '} text-white text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80`}
                        onClick={onLogin}
                    >
                        {onusMode ? t('futures:mobile:login_short') : t('futures:order_table:login_to_continue')}
                    </div>
                </div>
            }
        </Modal>
    )
}

export default FuturesLeverageSettings
