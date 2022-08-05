import { useEffect, useRef, useState } from 'react';
import FuturesRecordTableTab, { FUTURES_RECORD_CODE } from 'components/screens/Futures/TradeRecord/RecordTableTab';
import FuturesOrderHistory from 'components/screens/Futures/TradeRecord/OrderHistory';
import FuturesTradeHistory from 'components/screens/Futures/TradeRecord/TradeHistory';
import FuturesPosition from 'components/screens/Futures/TradeRecord/Position';
import CheckBox from 'components/common/CheckBox';
import FuturesOpenOrders from 'components/screens/Futures/TradeRecord/OpenOrders';
import FuturesTxHistory from 'components/screens/Futures/TradeRecord/TxHistory';
import FuturesAssets from 'components/screens/Futures/TradeRecord/Assets';
import FuturesOpenOrdersVndc from 'components/screens/Futures/PlaceOrder/Vndc/OpenOrdersVndc';
import FuturesOrderHistoryVndc from 'components/screens/Futures/PlaceOrder/Vndc/OrderHistoryVndc';
import { useRouter } from 'next/router';
import { getLoginUrl } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

const FuturesTradeRecord = ({ isVndcFutures, layoutConfig, pairConfig, pairPrice, isAuth, pair, ...check }) => {
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const router = useRouter();
    const [tabActive, setTabActive] = useState(FUTURES_RECORD_CODE.position)
    const [hideOther, setHideOther] = useState(false)
    const [pickedTime, setPickedTime] = useState({
        [FUTURES_RECORD_CODE.openOrders]: null,
        [FUTURES_RECORD_CODE.orderHistory]: null,
        [FUTURES_RECORD_CODE.tradingHistory]: null,
        [FUTURES_RECORD_CODE.txHistory]: null,
        [FUTURES_RECORD_CODE.orderHistoryVndc]: null,
    })
    const [forceUpdateState, setForceUpdateState] = useState(0)
    const tableRef = useRef(null)
    const { t } = useTranslation();

    // ? Helper
    const onChangeTab = (tab) => tab !== tabActive && setTabActive(tab)

    const hideOtherToggle = () => setHideOther((prevState) => !prevState)

    const onForceUpdate = () =>
        setForceUpdateState((prevState) => (prevState > 15 ? 0 : prevState + 1))

    const onChangeTimePicker = (field, nextPickedTime) =>
        setPickedTime({ ...pickedTime, [field]: nextPickedTime })

    useEffect(() => {
        setTabActive(FUTURES_RECORD_CODE.openOrders)
    }, [isVndcFutures])

    useEffect(() => {
        if (tableRef?.current?.clientHeight) {
            // console.log('Re-calculate height ')
            const tableHeight = tableRef.current.clientHeight - 42
            const tableHeaderElement =
                document.getElementsByClassName('rdt_TableHead')?.[0]
            const tableBodyElement =
                document.getElementsByClassName('rdt_TableBody')?.[0]

            if (tableHeight && tableHeaderElement && tableBodyElement) {
                if (
                    tabActive === FUTURES_RECORD_CODE.orderHistory ||
                    tabActive === FUTURES_RECORD_CODE.tradingHistory ||
                    tabActive === FUTURES_RECORD_CODE.txHistory ||
                    tabActive === FUTURES_RECORD_CODE.openOrders
                ) {
                    let offsetH = 32;
                    if (tabActive === FUTURES_RECORD_CODE.orderHistory && isVndcFutures) {
                        offsetH += 56
                    }
                    if (tabActive === FUTURES_RECORD_CODE.openOrders && isVndcFutures) {
                        offsetH += layoutConfig?.w < 15 ? 10 : 5;
                    }
                    tableBodyElement.style.height = `${tableHeight - tableHeaderElement?.clientHeight - 15 - offsetH}px`

                } else {
                    tableBodyElement.style.maxHeight = `${tableHeight - tableHeaderElement?.clientHeight - 15
                        }px`
                }
            }
        }
    }, [layoutConfig?.h, tableRef, tabActive, forceUpdateState])

    const onLogin = () => {
        router.push(getLoginUrl('sso'))
    }

    return (
        <div ref={tableRef} className='h-full flex flex-col overflow-y-hidden'>
            <div className='min-h-[42px] px-5 flex items-center border-b border-divider dark:border-divider-dark'>
                <FuturesRecordTableTab
                    tabActive={tabActive}
                    onChangeTab={onChangeTab}
                    isVndcFutures={isVndcFutures}
                    countOrders={ordersList.length}
                />
                <div
                    className='flex items-center text-sm font-medium select-none cursor-pointer'
                    onClick={hideOtherToggle}
                >
                    <CheckBox active={hideOther} />{' '}
                    <span className='ml-1 whitespace-nowrap text-gray dark:text-txtSecondary-dark font-medium capitalize'>
                        {t('futures:hide_other_symbols')}
                    </span>
                </div>
            </div>
            <div className='flex-grow'>
                <div className='custom_trading_record h-full overflow-auto'>
                    {tabActive === FUTURES_RECORD_CODE.position && !isVndcFutures && (
                        <FuturesPosition
                            pairConfig={pairConfig}
                            isHideOthers={hideOther}
                            onForceUpdate={onForceUpdate}
                        />
                    )}

                    {tabActive === FUTURES_RECORD_CODE.openOrders &&
                        (isVndcFutures ? (
                            <FuturesOpenOrdersVndc
                                pairConfig={pairConfig}
                                onForceUpdate={onForceUpdate}
                                hideOther={hideOther}
                                isAuth={isAuth}
                                onLogin={onLogin}
                                pair={pair}

                            />
                        ) : (
                            <FuturesOpenOrders pairConfig={pairConfig} />
                        ))}

                    {tabActive === FUTURES_RECORD_CODE.orderHistory &&
                        (isVndcFutures ? (
                            <FuturesOrderHistoryVndc
                                onForceUpdate={onForceUpdate}
                                pairConfig={pairConfig}
                                hideOther={hideOther}
                                pairPrice={pairPrice}
                                pickedTime={
                                    pickedTime?.[
                                    FUTURES_RECORD_CODE.orderHistoryVndc
                                    ]
                                }
                                onChangeTimePicker={onChangeTimePicker}
                                isAuth={isAuth}
                                onLogin={onLogin}
                                pair={pair}
                            />
                        ) : (
                            <FuturesOrderHistory
                                pairConfig={pairConfig}
                                pickedTime={
                                    pickedTime?.[
                                    FUTURES_RECORD_CODE.orderHistory
                                    ]
                                }
                                onChangeTimePicker={onChangeTimePicker}
                            />
                        ))}
                    {tabActive === FUTURES_RECORD_CODE.tradingHistory && !isVndcFutures && (
                        <FuturesTradeHistory
                            pairConfig={pairConfig}
                            onForceUpdate={onForceUpdate}
                            pickedTime={
                                pickedTime?.[FUTURES_RECORD_CODE.tradingHistory]
                            }
                            onChangeTimePicker={onChangeTimePicker}
                        />
                    )}
                    {tabActive === FUTURES_RECORD_CODE.txHistory && !isVndcFutures && (
                        <FuturesTxHistory
                            pairConfig={pairConfig}
                            onForceUpdate={onForceUpdate}
                            pickedTime={
                                pickedTime?.[FUTURES_RECORD_CODE.txHistory]
                            }
                            onChangeTimePicker={onChangeTimePicker}
                        />
                    )}
                    {tabActive === FUTURES_RECORD_CODE.assets && !isVndcFutures && (
                        <FuturesAssets pairConfig={pairConfig} />
                    )}
                </div>
            </div>
        </div>
    )
}

export const customTableStyles = {
    headCells: {
        style: {
            whiteSpace: 'nowrap',
        },
    },
    rows: {
        style: {
            marginBottom: '8px',
        },
    },
}

export default FuturesTradeRecord
