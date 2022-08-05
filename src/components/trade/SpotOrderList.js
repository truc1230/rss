import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import OpeningOrder from './OpeningOrder';
import OrderHistory from './OrderHistory';
import SpotFund from './SpotFund';
import TradeHistory from './TradeHistory';

const SpotOrderList = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const [activeTab, setActiveTab] = useState('open');
    const [height, setHeight] = useState(0);
    const [filterByCurrentPair, setFilterByCurrentPair] = useState(false);
    const elementRef = useRef(null);

    const { query } = useRouter();
    const [currentTheme] = useDarkMode();

    useEffect(() => {
        setHeight(elementRef.current.clientHeight - 90);
    }, [elementRef]);

    const _renderTab = useMemo(() => {
        const tabs = [
            {
                label: t('spot:open_orders'),
                value: 'open',
            },
            {
                label: t('spot:order_history'),
                value: 'order_history',
            },
            {
                label: t('spot:trade_history'),
                value: 'trade_history',
            },
            {
                label: t('spot:funds'),
                value: 'fund',
            },
        ];
        return (
            <ul className="tabs justify-start mb-2 w-full">
                {tabs.map((tab, index) => {
                    const { label, value } = tab;
                    const isActive = activeTab === value;
                    return (
                        <li className={`tab-item px-2 font-medium ${isActive ? 'active' : ''}`} key={value}>
                            <a
                                className={'tab-link text-txtSecondary dark:text-txtSecondary-dark ' + (isActive ? 'active' : '')}
                                onClick={() => setActiveTab(value)}
                            >
                                {label}
                            </a>
                        </li>);
                })}
            </ul>
        );
    }, [activeTab]);

    return (
        <>
            <div className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark pb-6 h-full" ref={elementRef}>
                <div className="flex items-center justify-between relative dragHandleArea">
                    {_renderTab}
                </div>
                <div className={`px-3 ${currentTheme === THEME_MODE.LIGHT ? 'rdt_light' : 'rdt_dark'}`} style={{ height: 'calc(100% - 80px)' }}>
                    {activeTab === 'open' && <OpeningOrder
                        height={height}
                        orderListWrapperHeight={props.orderListWrapperHeight}
                        currentPair={query?.id}
                    />}
                    {activeTab === 'order_history' && <OrderHistory
                        height={height}
                        orderListWrapperHeight={props.orderListWrapperHeight}
                        currentPair={query?.id}
                    />}
                    {activeTab === 'trade_history' && <TradeHistory
                        height={height}
                        orderListWrapperHeight={props.orderListWrapperHeight}
                        currentPair={query?.id}
                    />}
                    {activeTab === 'fund' && <SpotFund
                        height={height}
                        orderListWrapperHeight={props.orderListWrapperHeight}
                        currentPair={query?.id}
                    />}
                </div>
            </div>

        </>
    );
};

export default SpotOrderList;
