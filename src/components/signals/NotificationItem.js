import AssetLogo from 'src/components/wallet/AssetLogo';
import { enUS, vi } from 'date-fns/locale';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAssetName } from 'redux/actions/utils';
import { formatPrice, getS3Url, getTimeAgo, render24hChange } from 'src/redux/actions/utils';
import FetchApi from 'utils/fetch-api';

const NotificationItem = (props) => {
    const { t, i18n } = useTranslation();
    const { notification } = props;
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';
    const [selectedIndicator, setSelectedIndicator] = useState('');
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);

    const { metadata } = notification || {};
    const { priceTicker } = metadata || {};

    const INDICATORS = {
        VOL: 'VOL',
        BOLL: 'BOLL',
        RSI: 'RSI',
    };

    useEffect(() => {
        if (notification) {
            let indicator;

            if (notification?.category === 'ESTIMATE_VOLUME') {
                indicator = INDICATORS.VOL;
            }
            if (notification?.category === 'TOP_BB' || notification?.category === 'BOTTOM_BB') {
                indicator = INDICATORS.BOLL;
            }
            if (notification?.category === 'RSI_BUY' || notification?.category === 'RSI_SELL') {
                indicator = INDICATORS.RSI;
            }
            setSelectedIndicator(indicator);
        }
    }, [notification]);

    const renderMetaData = () => {
        return (
            <>
                { metadata?.rsi && (
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-black-600">RSI</div>
                        <div className="font-medium text-right">{metadata?.rsi}</div>
                    </div>
                )}
                { metadata?.highest && (
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-black-600">{t('signals:old_ceil')}</div>
                        <div className="font-medium text-right">{ formatPrice(metadata?.highest, exchangeConfig, priceTicker?.q)} {priceTicker?.q}</div>
                    </div>
                )}
                { metadata?.lowest && (
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-black-600">{t('signals:old_bottom')}</div>
                        <div className="font-medium text-right">{ formatPrice(metadata?.lowest, exchangeConfig, priceTicker?.q)} {priceTicker?.q}</div>
                    </div>
                )}
                { notification.category === 'BOTTOM_BB' && metadata?.bb?.lower && (
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-black-600">{t('signals:bottom_bb')}</div>
                        <div className="font-medium text-right">{ formatPrice(metadata?.bb?.lower, exchangeConfig, priceTicker?.q)} {priceTicker?.q}</div>
                    </div>
                )}
                { notification.category === 'TOP_BB' && metadata?.bb?.upper && (
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-black-600">{t('signals:top_bb')}</div>
                        <div className="font-medium text-right">{ formatPrice(metadata?.bb?.upper, exchangeConfig, priceTicker?.q)} {priceTicker?.q}</div>
                    </div>
                )}
                { metadata?.estimateVolume && (
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-black-600">{t('signals:estimate_volume')}</div>
                        <div className="font-medium text-right">{ formatPrice(metadata?.estimateVolume, exchangeConfig, priceTicker?.b)} {priceTicker?.b}</div>
                    </div>
                )}
                { metadata?.avgVolume && (
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-black-600">{t('signals:avg_volume')}</div>
                        <div className="font-medium text-right">{ formatPrice(metadata?.avgVolume, exchangeConfig, priceTicker?.b)} {priceTicker?.b}</div>
                    </div>
                )}
            </>
        );
    };

    const handleReadSignal = (userId = 0, signalId) => {
        FetchApi({
            url: '/api/v1/signal/read',
            options: {
                method: 'PUT',
            },
            params: {
                userId,
                id: signalId,
            },
        });
    };

    const renderContent = () => (
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="flex items-center md:col-span-7 xl:col-span-5 col-span-11">
                <div className="mr-4">
                    {notification.s3LogoUrl && (
                        <img src={getS3Url(notification.s3LogoUrl)} alt="" className="h-[64px] w-[64px] min-w-[64px]" />)}
                </div>
                <div className="flex-grow">
                    <div className="font-medium text-black-600">
                        {notification?.title?.[i18n.language]}
                    </div>
                    <div className="text-sm text-black-500">
                        {getTimeAgo(notification?.createdAt, { locale: i18n.language === 'vi' ? vi : enUS })}
                    </div>
                </div>
            </div>
            <div className="text-xs md:col-span-5 xl:col-span-4 col-span-7 my-3 xl:my-0">
                <div className="flex items-center mb-1">
                    {
                        notification?.metadata?.baseAsset && (
                            <>
                                <AssetLogo assetCode={notification?.metadata?.baseAsset} size={24} />
                                <div className="ml-2">
                                    <p className="text-sm font-bold">{notification?.metadata?.baseAsset}</p>
                                    <p className="text-[#8B8C9B] text-xs">{getAssetName(notification?.metadata?.baseAssetId)}</p>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="flex items-center justify-between mb-1">
                    <div className="text-black-600">{t('signals:exchange_rate')}</div>
                    <div className="font-medium text-right">
                        1 {priceTicker?.b} = {formatPrice(priceTicker?.ld, exchangeConfig, priceTicker?.q)} {priceTicker?.q}
                    </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                    <div className="text-black-600">{t('signals:change_24h')}:</div>
                    <div className="font-medium text-right">
                        {render24hChange(priceTicker)}
                    </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                    <div className="text-black-600">{t('signals:volume_24h')}:</div>
                    <div className="font-medium text-right">
                        {formatPrice(priceTicker?.vb, exchangeConfig, priceTicker?.b)} {priceTicker?.b}
                    </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                    <div className="text-black-600">{t('signals:time_frame')}:</div>
                    <div className="font-medium text-right">
                        {notification.timeframe}
                    </div>
                </div>
                {renderMetaData()}
            </div>
            <div className="mt-5 xl:px-0 xl:mt-0 col-span-12 xl:col-span-3 xl:mx-0 xl:justify-self-end">
                <a href={`/trade/${notification?.metadata?.baseAsset}-${quoteAsset}?timeframe=${notification.timeframe}&indicator=${selectedIndicator}`} target="_blank" rel="noreferrer">
                    <button
                        className="btn btn-primary w-full xl:w-[155px] xl:max-w-[155px] hover:!bg-[#4822FA] focus:!bg-[#2A11AC]"
                        type="button"
                        onClick={() => handleReadSignal(notification?.userId, notification?._id)}
                    >
                        {t('signals:btn_trade')}
                    </button>
                </a>
            </div>
        </div>
    );

    return (
        <div className="rounded-xl mb-3 border border-black-200 py-8 px-5 border-l-8" style={{ borderLeftColor: notification?.backgroundColor }}>
            {renderContent()}
        </div>
    );
};

export default NotificationItem;
