import React from 'react';
import { useTranslation } from 'next-i18next';
import { emitWebViewEvent, formatCurrency, formatNumber, getS3Url } from 'redux/actions/utils';
import { useDispatch } from 'react-redux';

const OrderMarginMobile = ({ marginAndValue, pairConfig, availableAsset, decimal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const quoteAsset = pairConfig?.quoteAsset ?? '';

    const openTransferModal = () => {
        emitWebViewEvent('deposit')
    }

    const Available = () => {
        return (
            <div className="flex items-center flex-wrap">
                {formatNumber(availableAsset * 100000000 ?? 0, 0)}&nbsp;&nbsp;
                <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' onClick={openTransferModal} />
            </div>
        )
    }
    return (
        <div className="flex flex-col h-full justify-around">
            <div className="flex justify-between text-xs font-medium ">
                <div className="mr-1 text-onus-grey min-w-[50px]">{t('futures:mobile:available')}</div>
                <div className="flex items-end justify-end text-right" style={{ wordBreak: 'break-word' }}>
                    {formatNumber(availableAsset ?? 0, decimal)}
                    {/*{onMobile && <> &nbsp;&nbsp;<img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' onClick={openTransferModal} /></>}*/}
                    <> &nbsp;&nbsp;<img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' onClick={openTransferModal} /></>
                </div>
            </div>
            <div className="flex justify-between text-xs font-medium ">
                <div className="mr-1 text-onus-grey min-w-[50px]">{t('futures:margin')}</div>
                <div className="flex items-center flex-wrap justify-end	text-right" style={{ wordBreak: 'break-word' }}>
                    {`${marginAndValue?.marginLength > 7 ? formatCurrency(marginAndValue?.margin, decimal) : formatNumber(
                        marginAndValue?.margin,
                        decimal
                    )}`}
                </div>
            </div>
        </div>
    );
};

export default OrderMarginMobile;
