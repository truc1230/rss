import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber, setTransferModal, } from 'redux/actions/utils';
import { useEffect, useState } from 'react';
import { getProfitVndc } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useTranslation } from 'next-i18next';
import orderBy from 'lodash/orderBy';
import isNil from 'lodash/isNil';

const AVAILBLE_KEY = 'futures_available'

const FuturesMarginRatioVndc = ({ pairConfig, auth, lastPrice }) => {
    const dispatch = useDispatch();
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null
    const futuresMarketWatch = useSelector((state) => state?.futures?.marketWatch) || null
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const wallets = useSelector(state => state.wallet.FUTURES)
    const [balance, setBalance] = useState([]);
    const [totalProfit, setTotalProfit] = useState(0);
    const { t } = useTranslation()
    const [listOrders, setListOrders] = useState([]);

    const walletMapper = (allWallet, assetConfig) => {
        if (!allWallet || !assetConfig) return
        const mapper = []
        const FUTURES_ASSET = ['VNDC', 'NAMI']
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const futures = assetConfig.filter(o => FUTURES_ASSET.includes(o?.assetCode))
            futures && futures.forEach(item => allWallet?.[item.id]
                && mapper.push(
                    {
                        ...item,
                        [AVAILBLE_KEY]: allWallet?.[item?.id]?.value - allWallet?.[item?.id]?.locked_value,
                        wallet: allWallet?.[item?.id]
                    }))
        }
        console.log(mapper)
        const dataFilter = orderBy(mapper, ['assetCode', 'VNDC'], ['desc']);
        if (Array.isArray(dataFilter) && dataFilter.length > 0) {
            setBalance(dataFilter)
        }
    }

    useEffect(() => {
        walletMapper(wallets, assetConfig)
    }, [wallets, assetConfig])

    useEffect(() => {
        let _totalProfit = 0;
        ordersList.forEach((item) => {
            const lastPrice = futuresMarketWatch?.[item.symbol]?.lastPrice || 0
            _totalProfit += getProfitVndc(item, lastPrice);
        });
        setTotalProfit(_totalProfit);
    }, [ordersList, futuresMarketWatch])


    const onOpenTransfer = () => {
        dispatch(setTransferModal({ isVisible: true }))
    }

    return (
        <div className='pt-5 h-full !overflow-x-hidden overflow-y-auto '>
            <div className='pt-4 pb-5 px-[10px]'>
                <div className='flex items-center justify-between dragHandleArea'>
                    <span className='futures-component-title'>{t('common:assets')}</span>
                </div>
                <div className='mt-4 flex items-center'>
                    <Link href="/trade">
                        <a target="_blank" className='!text-darkBlue dark:!text-txtSecondary-dark px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                            {t('futures:spot_trading')}
                        </a>
                    </Link>
                    <Link href="/swap">
                        <a target="_blank" className='!text-darkBlue dark:!text-txtSecondary-dark px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]'>
                            {t('futures:convert')}
                        </a>
                    </Link>
                    <div onClick={onOpenTransfer} className='cursor-pointer px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-3 dark:!text-txtSecondary-dark rounded-[4px]'>
                        {t('common:transfer')}
                    </div>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        {t('futures:unrealized_pnl')}
                    </span>
                    <span className='flex items-center font-medium'>
                        <span className={totalProfit === 0 ? '' : totalProfit < 0 ? 'text-red' : 'text-teal'}>{totalProfit === 0 ? '' : totalProfit > 0 ? '+' : ''}{formatNumber(totalProfit, 0, 0, true)}</span>
                        <span className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'>
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
                <div className='mt-3.5 flex justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        {t('futures:balance')}
                    </span>
                    <div className="flex flex-col items-end">
                        {balance?.map((item, i) => {
                            let value = item?.wallet?.value;
                            if (+value < 0 || Math.abs(+value) < 1e-4 || isNil(value) || !value) value = 0;
                            return (
                                <span key={i} className='flex font-medium'>
                                    {value ? formatNumber(value, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : Number(0).toPrecision((item?.assetDigit ?? 0) + 1)}
                                    <span className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'>
                                        {item?.assetCode}
                                    </span>
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FuturesMarginRatioVndc
