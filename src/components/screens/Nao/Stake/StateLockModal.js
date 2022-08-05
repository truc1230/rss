import React, { useState, useCallback, useMemo, useRef, useContext } from 'react';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { getS3Url, formatNumber, formatTime } from 'redux/actions/utils';
import { BackgroundHeader, CardNao, ButtonNao, Tooltip } from 'components/screens/Nao/NaoStyle';
import Slider from 'components/trade/InputSlider'
import colors from 'styles/colors';
import { ThumbLabel } from 'components/trade/StyleInputSlider';
import ceil from 'lodash/ceil';
import fetchApi from 'utils/fetch-api';
import { API_POOL_STAKE, API_POOL_UN_STAKE } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import TradingInput from 'components/trade/TradingInput';
import { useTranslation } from 'next-i18next';
import { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import Modal from 'components/common/ReModal';
import CheckBox from 'components/common/CheckBox';
import { useEffect } from 'react';
import { addDays } from 'date-fns'
import { floor } from 'lodash'


const StateLockModal = ({ visible = true, onClose, isLock, onConfirm, assetNao, data, balance = 0 }) => {
    const context = useContext(AlertContext);
    const [percent, setPercent] = useState(0);
    const { t } = useTranslation();
    const arrPercent = ['25', '50', '75', '100'];
    const [amount, setAmount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const isChangeSlide = useRef(false);

    const onChangePercent = (x) => {
        isChangeSlide.current = true;
        const _amount = floor(balance * x / 100, assetNao?.assetDigit ?? 8);
        setAmount(_amount)
        setPercent(x)
    }

    const customPercentLabel = useCallback((pos) => {
        return (
            <ThumbLabel isZero={pos.left === 0}
                isDark
                onusMode
                className={`left-1/2 translate-x-[-50%] w-max !text-sm !font-medium`}
            >
                {ceil(pos.left, 0)}%
            </ThumbLabel>
        )
    }, [])

    const onChangeAmount = (e) => {
        if (isChangeSlide.current) {
            isChangeSlide.current = false;
            return;
        }
        const _amount = e.floatValue ?? '';
        setAmount(_amount)
        const per = balance ? +(!_amount ? 0 : _amount * 100 / balance).toFixed(0) : 0;
        setPercent(per);
    }

    const onSave = async () => {
        if (!amount || loading || !validator().isValid) return;
        let isAlert = localStorage.getItem('hidden_alert');
        if (isAlert) {
            isAlert = JSON.parse(isAlert)
        }
        if (!showAlert && !isAlert?.hidden) {
            setShowAlert(true)
            return;
        }
        setLoading(true);
        try {
            const { data, status, message } = await fetchApi({
                url: isLock ? API_POOL_STAKE : API_POOL_UN_STAKE,
                options: {
                    method: 'POST',
                },
                params: { amount: Number(amount) }
            });
            if (status === ApiStatus.SUCCESS) {
                context.alert.show('success', t(`nao:pool:${isLock ? 'stake' : 'unstake'}_success`), t(`nao:pool:${isLock ? 'stake' : 'unstake'}_message`), null, null, () => {
                    if (onConfirm) onConfirm();
                })
            } else {
                context.alert.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`))
            }

        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    const validator = () => {
        if (amount > balance) {
            return { msg: `${t('nao:maximum_amount')} ${formatNumber(balance, assetNao?.assetDigit)}`, isValid: false };
        }
        if (amount < 10000 && isLock) {
            return { msg: `${t('nao:minimum_amount')} ${formatNumber(10000)}`, isValid: false };
        }
        return { isValid: true };
    }


    // const overview = useMemo(() => {
    //     const available = (data?.availableStaked ?? 0) + amount;
    //     return {
    //         available: available,
    //         estimate:
    //     }
    // }, [amount, data])
    // console.log(overview)
    return (
        <Portal portalId='PORTAL_MODAL'>
            {showAlert && <AlertModal onConfirm={onSave} onClose={() => setShowAlert(false)} t={t} isLock={isLock}
                amount={amount} decimal={assetNao?.assetDigit ?? 8}
                data={data} loading={loading}
            />}
            <div
                className={classNames(
                    'flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow disabled-zoom',
                    { invisible: !visible },
                    { visible: visible },
                )}
            >
                <div className='flex-1 min-h-0 overflow-y-auto'>
                    <BackgroundHeader className='px-4 py-6 flex items-center justify-between'>
                        <img src={getS3Url('/images/nao/ic_nao.png')} alt="" width="40" height="40" />
                        <img className="cursor-pointer select-none" onClick={onClose} src={getS3Url('/images/nao/ic_close.png')} height='18' width='18' alt="" />
                    </BackgroundHeader>
                    <div className="px-4 py-6">
                        <label className="text-nao-green text-2xl font-semibold leading-[50px]">{t(`nao:pool:${isLock ? 'lock' : 'unlock'}`)} NAO</label>
                        <div className="flex items-center justify-between">
                            <div className="text-nao-text font-medium leading-6 text-sm">{isLock ? t('nao:pool:input_lock') : t('nao:pool:input_unlock')}</div>
                            <div className="flex items-center">
                                <img src={getS3Url('/images/nao/ic_nao.png')} alt="" width="20" height="20" />
                                <div className='ml-2 text-lg font-semibold text-nao-blue'>NAO</div>
                            </div>
                        </div>
                        <CardNao className="mt-2 mb-3 !flex-row items-center !p-5">
                            <TradingInput
                                validator={validator()}
                                onusMode
                                thousandSeparator
                                allowNegative={false}
                                type="text"
                                labelClassName="hidden"
                                className={`flex-grow text-2xl font-semibold text-nao-white w-full `}
                                containerClassName={`w-full border-none !bg-transparent !p-0`}
                                value={amount}
                                decimalScale={assetNao?.assetDigit}
                                onValueChange={onChangeAmount}
                                renderTail={() => (
                                    <div className="text-nao-text font-medium text-sm">NAO</div>
                                )}
                                inputMode="decimal"
                                allowedDecimalSeparators={[',', '.']}
                                renderText={e => console.log(e)}
                            />
                        </CardNao>
                        <div className="flex items-center justify-between">
                            {isLock ?
                                <div className="text-nao-yellow text-sm italic">{t('nao:minimun', { value: '10,000 NAO' })}</div>
                                : <div />
                            }
                            <div className="text-sm font-medium leading-6 flex justify-end">
                                <div className="text-nao-text">{t('nao:available')}:</div>&nbsp;
                                <span>{formatNumber(balance, assetNao?.assetDigit ?? 0)} NAO</span>
                            </div>
                        </div>
                        <div className='mt-8'>
                            <Slider
                                onusMode
                                naoMode
                                labelSuffix='%'
                                x={percent}
                                axis='x'
                                xStart={0}
                                xmax={100}
                                height={8}
                                customDotAndLabel={() => { }}
                                BgColorLine={colors.nao.bg4}
                                bgColorActive={colors.nao.green}
                                bgColorSlide="linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)"
                                customPercentLabel={customPercentLabel}
                                onChange={({ x }) => onChangePercent(x)}
                            />
                        </div>
                        <div className="flex space-x-2 mt-8">
                            {arrPercent.map(per => {
                                const active = Number(per) === percent;
                                return (
                                    <ButtonNao key={per} onClick={() => onChangePercent(Number(per))} isActive active={active}
                                        className={`w-full py-1 text-xs !rounded-md leading-5 ${active ? 'font-semibold' : ''}`}>{`${per}%`}</ButtonNao>
                                )
                            })}
                        </div>
                        {isLock &&
                            <div className="mt-8">
                                <Tooltip id="tooltip-profit-est" />
                                <label className="text-sm text-nao-text font-medium leading-6">{t('nao:pool:lock_overview')}</label>
                                <CardNao noBg stroke="1.5" className="mt-2 !py-5 space-y-2">
                                    <div className="text-sm flex justify-between items-center">
                                        <div className="text-nao-text font-medium leading-6">{t('nao:pool:qty_lock')}</div>
                                        <span className="font-semibold">{formatNumber(data?.availableStaked, assetNao?.assetDigit ?? 8)} NAO</span>
                                    </div>
                                    <div className="text-sm flex justify-between items-center">
                                        <div className="text-nao-text font-medium leading-6">{t('nao:pool:est_apy_2')}</div>
                                        <span className="font-semibold">{formatNumber(data?.apy, 2)}%</span>
                                    </div>
                                    <div className="text-sm flex justify-between items-center">
                                        <div className="space-x-2 flex items-center">
                                            <div className="text-nao-text font-medium leading-6">{t('nao:pool:est_profit')}</div>
                                            <div data-tip={t('nao:pool:tooltip_profit_est')} data-for="tooltip-profit-est" >
                                                <img className="min-w-[20px]" src={getS3Url('/images/nao/ic_help.png')} height={20} width={20} />
                                            </div>
                                        </div>
                                        <span className="font-semibold">~{formatNumber(data?.profitEstimated, 0) + ' VNDC'} </span>
                                    </div>
                                    <div className="text-sm flex justify-between items-center">
                                        <div className="text-nao-text font-medium leading-6">{t('nao:pool:lock_duration')}</div>
                                        <span className="font-semibold">{data?.duration ?? 7} {t('nao:pool:days')}</span>
                                    </div>
                                </CardNao>
                            </div>
                        }
                        <div className="mt-6 flex items-center text-nao-yellow font-medium text-xs">
                            <img src={getS3Url('/images/nao/ic_warning.png')} className="mr-3" width={24} height={22} alt="" />
                            {t(`nao:pool:description_${isLock ? 'lock' : 'unlock'}`)}
                        </div>
                        <ButtonNao onClick={onSave} className={`py-3 mt-8 font-semibold ${!Number(amount) || !validator()?.isValid ? 'opacity-30' : ''}`}>
                            {t('common:confirm')}
                        </ButtonNao>
                    </div>
                </div>

            </div>
        </Portal>
    );
};

const AlertModal = ({ onConfirm, onClose, t, isLock, amount, decimal, data, loading }) => {
    const [checked, setChecked] = useState(false);

    const onHandleChecked = () => {
        localStorage.setItem('hidden_alert', JSON.stringify({ hidden: !checked }))
        setChecked(!checked)
    }

    const timeTogetBack = useMemo(() => {
        const now = new Date();
        return addDays(now, Number(data?.duration ?? 7));
    }, [data])

    const revenue = useMemo(() => {
        if (!data) return 0;
        const _amount = (isLock ? amount : -amount);
        const availableStaked = data?.availableStaked ?? 0;
        const totalStaked = data?.totalStaked ?? 0;
        const ratio = (availableStaked + _amount) / (totalStaked + _amount);
        return (data?.poolRevenueThisWeek ?? 0) * ratio;
    }, [data])

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
            onusClassName="!pt-[48px] !pb-[50px]" >
            <label className="text-[20px] font-semibold leading-6">{t(`nao:pool:confirm_${isLock ? 'lock' : 'unlock'}`)}</label>
            <div className='text-sm mt-6 divide-onus-bg2 divide-y '>
                <div className="flex items-center justify-between pb-3">
                    <label className="text-nao-grey">{t(`nao:pool:amount_${isLock ? 'lock' : 'unlock'}`)}</label>
                    <span>{formatNumber(amount, decimal)} NAO</span>
                </div>
                {/* <div className="flex items-center justify-between py-3">
                    <label className="text-nao-grey">{t('nao:pool:est_revenue')}</label>
                    <span>{formatNumber(revenue, decimal)} NAO</span>
                </div> */}
                <div className="flex items-center justify-between pt-3">
                    <label className="text-nao-grey">{isLock ? t('nao:pool:lock_duration') : t('nao:pool:time_to_get_back')}</label>
                    <span>{isLock ? `${data?.duration ?? 7} ${t('nao:pool:days')}` : formatTime(timeTogetBack, 'HH:mm:ss dd/MM/yyyy')} </span>
                </div>
            </div>
            {/* <div className="flex items-center mt-6" onClick={onHandleChecked}>
                <CheckBox onusMode={true} active={checked}
                    boxContainerClassName={`rounded-[2px] ${checked ? '' : '!bg-onus-bg2'}`} />
                <span className="ml-3 whitespace-nowrap text-nao-grey font-medium text-xs">
                    {t('nao:pool:not_show_message')}
                </span>
            </div> */}
            <div className="flex items-center space-x-2 font-semibold mt-6">
                <div onClick={onClose} className="h-[50px] w-full flex items-center justify-center bg-onus-bg2 rounded-md">
                    {t('nao:cancel')}
                </div>
                <div onClick={onConfirm} className={`h-[50px] w-full flex items-center justify-center bg-onus-base rounded-md ${loading ? 'opacity-30' : ''}`}>
                    {t('common:confirm')}
                </div>
            </div>
        </Modal>
    )
}

export default StateLockModal;
