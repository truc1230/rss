import { Transition } from '@headlessui/react';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { IconClose } from 'src/components/common/Icons';
import TradingHistoryDetailLoader from 'src/components/loader/TradingHistoryDetailLoader';
import { CategoryList } from 'src/redux/actions/const';
import { getTradingHistoryDetail } from 'src/redux/actions/trading-history';
import { formatWallet } from 'src/redux/actions/utils';
import { useComponentVisible } from 'src/utils/customHooks';
import AssetLogo from '../AssetLogo';

const DetailModalWrapper = ({ detail, assetConfig, closeModal, fullCategory }) => {
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(true);

    useEffect(() => {
        if (!isComponentVisible) {
            setTimeout(closeModal, 200);
        }
        return clearTimeout(closeModal, 200);
    }, [isComponentVisible]);

    return (
        <div className="fixed w-full h-full z-30 flex items-center justify-center top-0 left-0 bg-[rgba(0,0,0,0.4)]">
            <div ref={ref}>
                <DetailModal
                    detail={detail}
                    assetConfig={assetConfig}
                    fullCategory={fullCategory}
                    isComponentVisible={isComponentVisible}
                    setIsComponentVisible={setIsComponentVisible}
                />
            </div>
        </div>
    );
};

const DetailModal = ({ detail, assetConfig, closeModal, fullCategory, isComponentVisible, setIsComponentVisible }) => {
    const { t, i18n } = useTranslation(['trading-history', 'common']);
    const [tradingDetail, setTradingDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [isShow, setIsShow] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setTimeout(setIsShow(isComponentVisible), 200);
        return clearTimeout(setIsShow(isComponentVisible), 200);
    }, [isComponentVisible]);

    const asset = useMemo(() => {
        return assetConfig.filter(ast => ast.id === detail.assetId)?.[0];
    }, [detail, assetConfig]);

    const renderMoney = () => {
        if (asset) {
            if (detail?.moneyUse > 0) {
                return `+${formatWallet(detail?.moneyUse, 6, true)} ${asset?.assetCode}`;
            }
            return `${formatWallet(detail?.moneyUse, 6, true)} ${asset?.assetCode}`;
        }
        return '-';
    };

    useAsync(async () => {
        if (
            detail?.category === CategoryList.DEPOSIT ||
          detail?.category === CategoryList.DEPOSIT_FEE ||
          detail?.category === CategoryList.DEPOSIT_ON_CHAIN ||
          detail?.category === CategoryList.DEPOSIT_CHARGE_BACK ||
          detail?.category === CategoryList.WITHDRAW ||
          detail?.category === CategoryList.WITHDRAW_FEE ||
          detail?.category === CategoryList.WITHDRAW_ON_CHAIN ||
          detail?.category === CategoryList.WITHDRAW_CHARGE_BACK ||
          detail?.category === CategoryList.ATTLAS_MEMBERSHIP
        ) {
            const detailInfo = await getTradingHistoryDetail({
                category: detail?.category,
                transactionId: detail?.transactionId,
            });
            await setTradingDetail(detailInfo?.metadata);
        } else {
            await setTradingDetail(detail?.metadata);
        }
        setLoading(false);
    }, [detail]);

    const handleClose = () => {
        setIsComponentVisible(false);
    };

    const renderGeneralInfo = () => (
        <>
            <p className="text-sm text-[#52535C]">{t('transaction_code')}</p>
            <p className="text-sm text-[#02083D] text-right">{detail?.transactionId}</p>
            <p className="text-sm text-[#52535C]">{t('time')}</p>
            <p className="text-sm text-[#02083D] text-right">{format(parseISO(detail?.createdAt), 'dd/MM/yyyy H:mm')}</p>
            <p className="text-sm text-[#52535C]">{t('wallet_type')}</p>
            <p className="text-sm text-[#02083D] text-right">{detail?.walletType}</p>
            <p className="text-sm text-[#52535C]">{t('from')}</p>
            <div>
                <p className="text-sm text-[#02083D] text-right break-all">{detail?.fromUser?.name}</p>
                <p className="text-sm text-[#02083D] text-right break-all">{detail?.fromUser?.username && <span className="text-[#52535C] text-[12px]">@{detail?.fromUser?.username}</span>}</p>
            </div>
            <p className="text-sm text-[#52535C]">{t('to')}</p>
            <div>
                <p className="text-sm text-[#02083D] text-right break-all">{detail?.toUser?.name}</p>
                <p className="text-sm text-[#02083D] text-right break-all">{detail?.toUser?.username && <span className="text-[#52535C] text-[12px]">@{detail?.toUser?.username}</span>}</p>
            </div>
            <p className="text-sm text-[#52535C]">{t('transaction')}</p>
            <p className="text-sm text-[#02083D] text-right">{fullCategory.filter(cat => cat.name === detail.category)?.[0]?.description?.[i18n.language] || '-'}</p>
        </>
    );

    const handleCopy = (data) => {
        try {
            window.navigator.clipboard.writeText(data);
            setCopied(true);
        } catch (err) {
            console.log(err);
        }
    };

    const _renderCopyTransactionId = () => {
        if (!detail?.metadata?.originTransactionId) return null;
        return (
            <>
                <p className="text-sm text-[#52535C]">{t('origin_transaction_id')}</p>
                <p className="text-sm text-[#02083D] flex flex-row items-center justify-end">{detail?.metadata?.originTransactionId || '-'}
                    <button type="button" onClick={() => handleCopy(detail?.metadata?.originTransactionId || '-')} className="text-teal-400 ml-1 font-bold">
                        <span className="whitespace-nowrap">{copied ? t('common:copied') : t('common:copy')}</span>
                    </button>
                </p>
            </>
        );
    };

    const renderDetailList = () => {
        switch (detail?.category) {
            case CategoryList.SWAP_PLACE_ORDER: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                        <p className="text-sm text-[#52535C]">{t('coin_pair')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.fromAsset} &gt; {tradingDetail?.toAsset}</p>
                        <p className="text-sm text-[#52535C]">{t('exchange_rate')}</p>
                        <p className="text-sm text-[#02083D] text-right">1 {tradingDetail?.fromAsset === tradingDetail?.displayingPriceAsset ? tradingDetail?.toAsset : tradingDetail?.fromAsset} = {formatWallet(tradingDetail?.displayingPrice)} {tradingDetail?.displayingPriceAsset}</p>
                        <p className="text-sm text-[#52535C]">{t('pay_qty')}</p>
                        <p className="text-sm text-[#02083D] text-right">{formatWallet(tradingDetail?.fromQty, 6, true)} {tradingDetail?.fromAsset}</p>
                        <p className="text-sm text-[#52535C]">{t('receive_qty')}</p>
                        <p className="text-sm text-[#02083D] text-right">{formatWallet(tradingDetail?.toQty, 6, true)} {tradingDetail?.toAsset}</p>
                        <p className="text-sm text-[#52535C]">{t('transaction_fee')}</p>
                        <p className="text-sm text-[#02083D] text-right">{formatWallet(tradingDetail?.feeMetadata?.value)} {tradingDetail?.feeMetadata?.asset}</p>
                    </div>
                );
            }
            case CategoryList.SWAP_FEE: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                        {_renderCopyTransactionId()}
                    </div>
                );
            }
            case CategoryList.SPOT_MATCH_ORDER: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                        <p className="text-sm text-[#52535C]">Order ID</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.displayingId}</p>
                        <p className="text-sm text-[#52535C]">{t('coin_pair')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.symbol}</p>
                        <p className="text-sm text-[#52535C]">{t('exchange_rate')}</p>
                        <p className="text-sm text-[#02083D] text-right">{formatWallet(tradingDetail?.price, 6, true)}</p>
                        <p className="text-sm text-[#52535C]">{t('quantity')}</p>
                        <p className="text-sm text-[#02083D] text-right">{formatWallet(tradingDetail?.baseQty, 6, true)}</p>
                        <p className="text-sm text-[#52535C]">{t('receive_qty')}</p>
                        <p className="text-sm text-[#02083D] text-right">{formatWallet(tradingDetail?.quoteQty, 6, true)} {tradingDetail?.toAsset}</p>
                    </div>
                );
            }
            case CategoryList.SPOT_FEE: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                        {_renderCopyTransactionId()}
                    </div>
                );
            }
            case CategoryList.DEPOSIT_ON_CHAIN: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                        <p className="text-sm text-[#52535C]">{t('validation_number')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.metadata?.addressTag || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('code_number')}</p>
                        <p className="text-sm text-[#02083D] text-right">-</p>
                        <p className="text-sm text-[#52535C]">{t('tx_hash')}</p>
                        <p className="text-sm text-[#02083D] text-right break-all">{tradingDetail?.txId || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('transaction_fee')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.fee?.value ? <span>{formatWallet(tradingDetail?.fee?.value, 6, true)} {asset?.assetCode}</span> : '-'}</p>
                    </div>
                );
            }
            case CategoryList.WITHDRAW_ON_CHAIN: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}

                        <p className="text-sm text-[#52535C]">{t('validation_number')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.metadata?.addressTag || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('code_number')}</p>
                        <p className="text-sm text-[#02083D] text-right">-</p>
                        <p className="text-sm text-[#52535C]">{t('tx_hash')}</p>
                        <p className="text-sm text-[#02083D] text-right break-all">{tradingDetail?.txId || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('transaction_fee')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.fee?.value ? <span>{formatWallet(tradingDetail?.fee?.value, 6, true)} {asset?.assetCode}</span> : '-'}</p>
                    </div>
                );
            }
            case CategoryList.DEPOSIT: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                        <p className="text-sm text-[#52535C]">{t('content_send')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.metadata?.contentSend || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('account_number')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.metadata?.bank_details?.account_number || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('bank_name')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.metadata?.bank_details?.bank_name || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('transaction_fee')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.fee?.value ? <span>{formatWallet(tradingDetail?.fee?.value, 6, true)} {asset?.assetCode}</span> : '-'}</p>
                    </div>
                );
            }
            case CategoryList.WITHDRAW: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                        <p className="text-sm text-[#52535C]">{t('content_send')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.metadata?.contentSend || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('account_number')}</p>
                        <p className="text-sm text-[#02083D] text-right">{detail?.toUser?.accountNumber || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('bank_name')}</p>
                        <p className="text-sm text-[#02083D] text-right">{detail?.toUser?.bankName || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('transaction_fee')}</p>
                        <p className="text-sm text-[#02083D] text-right">{tradingDetail?.fee?.value ? <span>{formatWallet(tradingDetail?.fee?.value, 6, true)} {asset?.assetCode}</span> : '-'}</p>
                    </div>
                );
            }
            case CategoryList.TRANSFER_INTERNAL: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                        <p className="text-sm text-[#52535C]">{t('source_wallet')}</p>
                        <p className="text-sm text-[#02083D] text-right">{detail?.metadata?.fromWallet || '-'}</p>
                        <p className="text-sm text-[#52535C]">{t('target_wallet')}</p>
                        <p className="text-sm text-[#02083D] text-right">{detail?.metadata?.toWallet || '-'}</p>
                    </div>
                );
            }
            default: {
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {renderGeneralInfo()}
                    </div>
                );
            }
        }
    };

    return (

        <Transition
            show={isShow}
            as="div"
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform duration-400 transition ease-in-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
        >
            <div className="relative bg-white w-[400px] px-6 py-10 rounded-2xl box-border border border-[#EEF2FA]" style={{ boxShadow: '0px 16px 24px rgba(7, 12, 61, 0.04)' }}>
                <div className="absolute top-[24.33px] right-[24.33px] cursor-pointer" onClick={handleClose}>
                    <IconClose />
                </div>
                <div>
                    <div className="flex flex-col items-center justify-center">
                        <AssetLogo assetCode={asset?.assetCode} assetId={asset?.id} size={64} />
                        <p className="text-[#02083D] text-3xl break-word text-center mt-3" style={{ fontWeight: 500 }}>{renderMoney()}</p>
                        <div className={`${detail?.status === 1 ? 'bg-[rgba(5,177,105,0.1)]' : 'bg-[rgba(233,95,103,0.1)]'} rounded px-3 py-[5px] mt-2 flex flex-row items-center`}>
                            <span className={`text-sm font-bold ${detail?.status === 1 ? 'text-[#00C8BC]' : 'text-[#E5544B]'}`}>
                                {detail?.status === 1 ? t('status_success_detail') : t('status_expired')}
                            </span>
                        </div>
                    </div>
                    <hr className="my-5" />
                    {loading ? <TradingHistoryDetailLoader /> : renderDetailList()}
                </div>
            </div>
        </Transition>
    );
};

export default DetailModalWrapper;
