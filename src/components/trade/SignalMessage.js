import AssetLogo from 'src/components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import { getTimeAgo } from 'redux/actions/utils';
import { enUS, vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';

const SignalMessage = ({ filteredSignals, signal, handleChangeSymbol, signalIndex }) => {
    const { i18n } = useTranslation();

    const [status, setStatus] = useState(0);

    useEffect(() => {
        if (signal?.status === 1) {
            setStatus(1);
        }
    }, [signal]);

    const INDICATORS = {
        VOL: 'VOL',
        BOLL: 'BOLL',
        RSI: 'RSI',
    };

    const handleReadSignal = () => {
        let indicator;

        if (signal?.category === 'ESTIMATE_VOLUME') {
            indicator = INDICATORS.VOL;
        }
        if (signal?.category === 'TOP_BB' || signal?.category === 'BOTTOM_BB') {
            indicator = INDICATORS.BOLL;
        }
        if (signal?.category === 'RSI_BUY' || signal?.category === 'RSI_SELL') {
            indicator = INDICATORS.RSI;
        }

        handleChangeSymbol({ base: signal?.metadata?.baseAsset, quote: signal?.metadata?.quoteAsset }, signal?.metadata?.timeframe, signal?.userId, signal?._id, indicator);

        setStatus(1);
    };

    return (
        <button type="button" className="w-full flex items-center px-3" onClick={handleReadSignal}>
            <AssetLogo assetCode={signal?.metadata?.baseAsset} size={32} />
            <div className={`w-full text-left ml-[10px] py-3 ${(signalIndex !== (filteredSignals.length - 1)) && 'border-b border-[#EEF2FA]'}`}>
                <div className="w-full flex flex-row items-center justify-between">
                    <p className="text-sm" style={{ fontWeight: 500 }}>{signal?.title[i18n.language]}</p>
                    {status === 0 && <span className="bg-teal rounded-full w-[6px] h-[6px] min-w-[6px] ml-1" />}
                </div>
                <p className="text-xs text-[#8B8C9B]">{getTimeAgo(signal?.createdAt, { locale: i18n.language === 'vi' ? vi : enUS })} {i18n.language === 'vi' ? 'trước' : 'ago'}</p>
            </div>
        </button>

    );
};

export default SignalMessage;
