import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import { countDecimals, formatNumber, getSuggestSl, getSuggestTp } from 'redux/actions/utils';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useSelector } from 'react-redux';
import { ceil, find } from 'lodash';
import TradingInput from 'components/trade/TradingInput';
import Switcher from 'components/common/Switcher';
import CheckBox from 'components/common/CheckBox';
import Slider from 'components/trade/InputSlider';
import { Dot, ThumbLabel } from 'components/trade/StyleInputSlider';
import colors from 'styles/colors';
import { DefaultFuturesFee } from 'redux/actions/const';

const EditSLTPVndcMobile = ({
    onClose,
    isVisible,
    order,
    status,
    onConfirm,
    pairTicker,
    lastPrice = 0,
    isMobile,
    onusMode = false,
    disabled
}) => {
    const { t } = useTranslation();
    const [data, setData] = useState({
        displaying_id: order?.displaying_id,
        price: +(status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price),
        sl: Number(order?.sl),
        tp: Number(order?.tp),
    });
    const [show, setShow] = useState({
        tp: +order?.tp > 0,
        sl: +order?.sl > 0
    });
    const [tabSl, setTabSl] = useState(0);
    const [tabTp, setTabTp] = useState(0);
    const profit = useRef({
        tp: 0,
        sl: 0
    });
    const [percent, setPercent] = useState({
        tp: 0,
        sl: 0
    });
    const [autoType, setAutoType] = useState(false);
    const dotStep = useRef(4);
    const _lastPrice = pairTicker ? pairTicker[order?.symbol]?.lastPrice : lastPrice;
    const quoteAsset = pairTicker ? pairTicker[order?.symbol]?.quoteAsset : order?.quoteAsset;
    const futuresConfigs = useSelector(state => state.futures.pairConfigs);
    const assetConfig = useSelector(state => state.utils.assetConfig)
    const wallets = useSelector((state) => state.wallet?.FUTURES);
    const symbol = order?.symbol;
    const pairConfig = find(futuresConfigs, { symbol });
    const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
    const decimalSymbol = find(assetConfig, { id: pairConfig?.quoteAssetId })?.assetDigit ?? 0;
    if (!pairConfig) return null;
    const isChangeSlide = useRef(false);

    const getProfitSLTP = (sltp) => {
        const {
            fee = 0,
            side,
            quantity,
            open_price,
            status,
            price,
            size
        } = order;
        const isBuy = side === VndcFutureOrderType.Side.BUY;
        const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price;
        let total = quantity * (isBuy ? sltp - openPrice : openPrice - sltp);
        const _fee = quantity * (sltp + openPrice) * DefaultFuturesFee.NamiFrameOnus;
        let profit = total - _fee;
        return profit;
    };

    const calculateSLTP = (profit) => {
        const {
            fee = 0,
            side,
            quantity,
            open_price,
            status,
            price
        } = order;
        const openPrice = +(status === VndcFutureOrderType.Status.PENDING ? price : open_price);
        let _profit = side === VndcFutureOrderType.Side.BUY ? profit + fee : -profit + fee;
        const sltp = (_profit / quantity) + openPrice;
        const decimals = countDecimals(decimalScalePrice?.tickSize);
        return +Number(sltp)
            .toFixed(decimals);
    };

    const getSLTP = (index = 60, key) => {
        const {
            quantity,
            open_price,
            status,
            price,
            side,
            order_value,
            margin
        } = order;

        let leverage = order.leverage
        if (order_value && margin) leverage = order_value / margin;
        const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price;
        const tpsl = key === 'sl' ? getSuggestSl(side, openPrice, leverage, index / 100) : getSuggestTp(side, openPrice, leverage, index / 100);
        const decimals = countDecimals(decimalScalePrice?.tickSize);
        return +tpsl.toFixed(decimals);
    };

    const onChangeAutoType = () => {
        localStorage.setItem('auto_type_tp_sl', JSON.stringify({ auto: !autoType }));
        setAutoType(!autoType);
    };

    useEffect(() => {
        document.body.classList.add('overflow-hidden')
        if (order?.sl) {
            profit.current.sl = getProfitSLTP(Number(order?.sl));
        }
        if (order?.tp) {
            profit.current.tp = getProfitSLTP(Number(order?.tp));
        }
        if (order.leverage <= 10) {
            if (!order?.sl) {
                profit.current.sl = 0;
            }
            if (!order?.tp) {
                profit.current.tp = 0;
            }
        }
        setTimeout(() => {
            setPercent({
                sl: getPercentSlTp(Number(order?.sl), 'sl')
                    .toFixed(0),
                tp: getPercentSlTp(Number(order?.tp), 'tp')
                    .toFixed(0),
            });
        }, 100);
        setData({
            ...data,
            tp: Number(order?.tp),
            sl: Number(order?.sl),
        });
        const autoTypeInput = localStorage.getItem('auto_type_tp_sl');
        if (autoTypeInput) {
            autoTypeInput = JSON.parse(autoTypeInput);
            setAutoType(autoTypeInput?.auto);
        }
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, []);

    const onHandleChange = (key, e) => {
        if (isChangeSlide.current) {
            isChangeSlide.current = false;
            return;
        }
        const value = +e.value === 0 ? '' : +e.value;
        const decimals = countDecimals(decimalScalePrice?.tickSize);
        profit.current[key] = value ? getProfitSLTP(value) : 0;
        setPercent({
            ...percent,
            [key]: getPercentSlTp(value, key)
        });
        setData({
            ...data,
            [key]: value
        });
    };

    const getPercentSlTp = (sltp, key) => {
        if (!sltp) return 50;
        let {
            leverage,
            side,
            order_value,
            margin
        } = order;

        if (order_value && margin) leverage = order_value / margin;
        let formatX = 0;
        let _activePrice = data.price;
        if (side == VndcFutureOrderType.Side.BUY) {
            formatX = (sltp * (1 - DefaultFuturesFee.NamiFrameOnus) - _activePrice * (1 + DefaultFuturesFee.NamiFrameOnus)) * leverage / _activePrice * 100
        } else {
            formatX = (sltp * (-1 - DefaultFuturesFee.NamiFrameOnus) + _activePrice * (1 - DefaultFuturesFee.NamiFrameOnus)) * leverage / _activePrice * 100
        }
        return formatX <= -100 ? -1 : Math.abs(formatX > 0 ? 50 + formatX / 2 : -50 - formatX / 2);
    };

    const placeholder = (key) => {
        const tab = key === 'stop_loss' ? tabSl : tabTp;
        return tab === 0 ? t(`futures:mobile:${key}_input`) : tab === 1 ? t(`futures:mobile:profit_input`) : t('futures:mobile:percent_input');
    };

    const setDataGeneral = (sltp, key) => {
        profit.current[key] = sltp ? getProfitSLTP(sltp) : 0;
        setData({
            ...data,
            [key]: sltp
        });
        setPercent({
            ...percent,
            [key]: sltp ? getPercentSlTp(sltp, key) : 50
        });
    };

    const onSwitch = (key) => {
        if (!order?.displaying_id) {
            if (autoType) {
                if (order.leverage <= 10) {
                    setDataGeneral(0, key);
                } else if (order.leverage <= 20) {
                    if (key === 'sl') {
                        const sltp = getSLTP(60, key);
                        setDataGeneral(sltp, key);
                    } else {
                        setDataGeneral(0, key);
                    }
                } else if (order.leverage > 20 && order.leverage <= 100) {
                    const sltp = getSLTP(60, key);
                    setDataGeneral(sltp, key);
                } else {
                    const sltp = getSLTP(90, key);
                    setDataGeneral(sltp, key);
                }
            }
        } else {
            if (order[key]) {
                if (!data[key]) setDataGeneral(order[key], key);
            } else {
                setDataGeneral(0, key);
            }
        }
        setShow({
            ...show,
            [key]: !show[key]
        });
    };

    const customDotAndLabel = useCallback((xmax, pos, key) => {
        const dot = [];
        const label = [];
        const size = 100 / dotStep.current;
        const postion = pos.left === 50 ? 0 : pos.left > 50 ? (pos.left - 50) * 2 : -(50 - pos.left) * 2;
        for (let i = 0; i <= dotStep.current; ++i) {
            // console.log(Number(i * size) ,Number(data[key] > 0 ? percent[key] : 50))
            const index = postion * dotStep.current / 100;
            const a = index / 2;
            const b = i - (dotStep.current / 2);
            let active = false;
            if (a >= b && b >= 0 || a <= b && b <= 0) {
                active = true;
            }
            dot.push(
                <Dot
                    key={`inputSlider_dot_${i}`}
                    active={active}
                    percentage={i * size}
                    isDark
                    onusMode
                    bgColorActive={colors.onus.slider}
                    bgColorDot={colors.onus.bg3}

                />
            );
            // label.push(
            //     <div className='relative' key={`inputSlider_label_${i}`}>
            //         <span
            //             onClick={() => {
            //                 onSetValuePercent(i * size, key)
            //             }}
            //             className={classNames(
            //                 'block absolute text-xs text-onus-grey select-none cursor-pointer',
            //                 {
            //                     'left-1/2 -translate-x-1/2 ml-[3px]': i > 0 && i < dotStep.current,
            //                     '-left-1/2 translate-x-[-80%]': i === dotStep.current,
            //                     '!text-onus-white': Number(i * size) === Number(data[key] > 0 ? percent[key] : 50) && onusMode,
            //                 }
            //             )}
            //         >
            //             {getLabelPercent(i * size, key)}
            //             {'%'}
            //         </span>
            //     </div>
            // )
        }
        return {
            dot,
            label
        };
    }, [percent]);

    const customPercentLabel = useCallback((pos) => {
        // const hidden = arrDot.includes(pos.left);
        // if (hidden) return;
        const postion = pos.left === 50 ? 0 : pos.left > 50 ? (pos.left - 50) * 2 : -(50 - pos.left) * 2;
        return (
            <ThumbLabel isZero={pos.left === 0}
                isDark
                onusMode
                className={`left-1/2 translate-x-[-50%] w-max`}
            >
                {ceil(postion, 0)}%
            </ThumbLabel>
        );
    }, []);

    const getLabelPercent = (index, key) => {
        //+- 100% -> total 200%
        const negative = -(50 - index) < 0;
        const formatX = index === 50 ? 0 : index > 50 ? (index - 50) * 2 : -(50 - index) * 2;
        return formatX.toFixed(0);
    };

    const arrDot = useMemo(() => {
        const size = 100 / dotStep.current;
        const arr = [];
        for (let i = 0; i <= dotStep.current; i++) {
            arr.push(i * size);
        }
        return arr;
    }, [dotStep.current]);

    const onChangePercent = (x, xmax, key) => {
        const _x = arrDot.reduce((prev, curr) => {
            let i = 0;
            if (Math.abs(curr - x) < 2 || Math.abs(prev - x) < 2) {
                i = Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
            }
            return i;
        });
        onSetValuePercent(_x ? _x : x, key);
    };

    const onSetValuePercent = (x, key) => {
        isChangeSlide.current = true;
        const formatX = getLabelPercent(x, key);
        const tpsl = getSLTP(key === 'sl' ? -formatX : formatX, key);
        profit.current[key] = getProfitSLTP(tpsl);
        setData({
            ...data,
            [key]: tpsl
        });
        setPercent({
            ...percent,
            [key]: x
        });
    };

    const textColor = (value) => {
        return value === 0 ? 'text-onus-white' : value > 0 ? 'text-onus-green' : 'text-onus-red';
    };

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
        >

            <div>
                <div
                    className="text-lg font-bold text-onus-white pb-[6px]">{t('futures:mobile:modify_tpsl_title')}</div>
                <div
                    className="text-onus-green font-semibold relative w-max bottom-[-13px] bg-onus-bgModal px-[6px] left-[9px]">{order?.symbol} {order?.leverage}x
                </div>
                <div className="border border-onus-bg2 px-[15px] py-[10px] rounded-lg pt-[21px]">
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-onus-grey">
                            {t('futures:order_table:open_price')}
                        </span>
                        <span className="font-medium">{formatNumber(data.price, 2, 0, true)}</span>
                    </div>
                    <div className="h-[1px] bg-onus-bg2 w-full my-[10px]"></div>
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-onus-grey">
                            {t('futures:tp_sl:mark_price')}
                        </span>
                        <span className="font-medium">{formatNumber(_lastPrice, 2, 0, true)}</span>
                    </div>

                </div>
            </div>
            <div
                className="flex items-center text-sm font-medium select-none cursor-pointer pt-4"
                onClick={onChangeAutoType}
            >
                <CheckBox onusMode={true} active={autoType}
                    boxContainerClassName={`rounded-[2px] ${autoType ? '' : 'border !border-onus-grey !bg-onus-bg2'}`} />
                <span className="ml-3 whitespace-nowrap text-onus-grey font-medium text-xs">
                    {t('futures:mobile:auto_type_sltp')}
                </span>
            </div>
            <div className="pt-8">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center mr-2'>
                        <label className="text-onus-white font-semibold whitespace-nowrap mr-2">{t('futures:stop_loss')}</label>
                        <Switcher onusMode addClass="!bg-onus-white w-[22px] h-[22px]" wrapperClass="min-h-[24px] !h-6 min-w-[48px]"
                            active={show.sl} onChange={() => onSwitch('sl')} />
                    </div>
                    {show.sl && <div className="text-xs flex items-center ">
                        <div
                            className="font-normal text-onus-grey whitespace-nowrap">{t('futures:mobile:pnl_estimate')}:
                        </div>
                        &nbsp;
                        <div
                            className={`font-medium text-right ${textColor(profit.current.sl)}`}>{formatNumber(profit.current.sl, decimalSymbol, 0, true) + ' ' + quoteAsset}</div>
                    </div>
                    }
                </div>
                {show.sl &&
                    <div className="h-[44px] rounded-[6px] w-full bg-onus-bg2 flex mt-4">
                        <TradingInput
                            onusMode={onusMode}
                            thousandSeparator
                            type="text"
                            placeholder={placeholder('stop_loss')}
                            labelClassName="hidden"
                            className={`flex-grow text-sm font-medium h-[21px] text-onus-white w-full `}
                            containerClassName={`w-full !px-3 border-none ${isMobile ? '!bg-onus-bg2' : ''}`}
                            value={data.sl}
                            decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                            onValueChange={(e) => onHandleChange('sl', e)}
                            renderTail={() => (
                                <span className={`font-medium pl-2 text-onus-grey`}>
                                    {tabSl === 2 ? '%' : quoteAsset}
                                </span>
                            )}
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                        />
                    </div>
                }
                <div className={`mt-2 pb-2 ${!show.sl ? 'hidden' : ''}`}>
                    <Slider
                        useLabel
                        onusMode
                        labelSuffix="%"
                        x={percent.sl}
                        axis="x"
                        xmax={100}
                        bgColorActive={colors.onus.slider}
                        bgColorSlide={colors.onus.slider}
                        xStart={50}
                        positionLabel="top"
                        customPercentLabel={customPercentLabel}
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'sl')}
                        onChange={({ x }) => onChangePercent(x, 100, 'sl')}
                    />
                </div>
            </div>
            <div className="pt-8 pb-10">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center mr-2'>
                        <label className="text-onus-white font-semibold whitespace-nowrap mr-2">{t('futures:take_profit')}</label>
                        <Switcher onusMode addClass="!bg-onus-white w-[22px] h-[22px]" wrapperClass="min-h-[24px] !h-6 min-w-[48px]"
                            active={show.tp} onChange={() => onSwitch('tp')} />
                    </div>
                    {show.tp && <div className="text-xs flex items-center">
                        <div
                            className="font-normal text-onus-grey whitespace-nowrap">{t('futures:mobile:pnl_estimate')}:
                        </div>
                        &nbsp;
                        <div
                            className={`font-medium text-right ${textColor(profit.current.tp)}`}>{formatNumber(profit.current.tp, decimalSymbol, 0, true) + ' ' + quoteAsset}</div>
                    </div>}
                </div>
                {show.tp &&
                    <div className="h-[44px] rounded-[6px] w-full bg-onus-bg2 flex mt-4">
                        <TradingInput
                            onusMode={onusMode}
                            thousandSeparator
                            type="text"
                            placeholder={placeholder('take_profit')}
                            labelClassName="hidden"
                            className={`flex-grow text-sm font-medium h-[21px] text-onus-white w-full `}
                            containerClassName={`w-full !px-3 border-none ${isMobile ? '!bg-onus-bg2' : ''}`}
                            value={data.tp}
                            decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                            onValueChange={(e) => onHandleChange('tp', e)}
                            renderTail={() => (
                                <span className={`font-medium pl-2 text-onus-grey`}>
                                    {tabTp === 2 ? '%' : quoteAsset}
                                </span>
                            )}
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                        />
                    </div>
                }
                <div className={`mt-2 ${!show.tp ? 'hidden' : ''}`}>
                    <Slider
                        useLabel
                        onusMode
                        labelSuffix="%"
                        x={percent.tp}
                        axis="x"
                        xmax={100}
                        bgColorActive={colors.onus.slider}
                        bgColorSlide={colors.onus.slider}
                        xStart={50}
                        positionLabel="top"
                        customPercentLabel={customPercentLabel}
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'tp')}
                        onChange={({ x }) => onChangePercent(x, 100, 'tp')}
                    />
                </div>
            </div>
            <Button
                onusMode={true}
                title={t('futures:leverage:confirm')}
                type="primary"
                className={`!h-[50px] !text-[16px] !font-semibold`}
                componentType="button"
                disabled={disabled}
                onClick={() => {
                    const newData = {
                        ...data,
                        sl: show?.sl ? data.sl : 0,
                        tp: show?.tp ? data.tp : 0,
                    };
                    if (!disabled) onConfirm(newData);
                }}
            />
        </Modal>
    );
};

export default EditSLTPVndcMobile;
