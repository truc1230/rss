import { useState } from 'react';
import fetchAPI from 'utils/fetch-api';
import { ApiStatus, StatusBankTransfer } from 'src/redux/actions/const';
import { formatPrice } from 'src/redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';

const ItemWithCopy = ({ label, value }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    return (
        <div className="text-sm font-medium flex items-center justify-between leading-none">
            <span>{label}</span>
            {value
                ? (
                    <CopyToClipboard
                        text={value}
                        className="cursor-pointer text-sm text-teal-700 font-semibold"
                        onCopy={() => setCopied(true)}
                    >
                        <span>{copied ? t('referral:copied') : t('referral:copy')}</span>
                    </CopyToClipboard>
                )
                : null}
        </div>
    );
};
const DetailDepositBank = ({ order, onClose }) => {
    const [orderStatus, setOrderStatus] = useState(order.status);
    const { t } = useTranslation();
    const putOrder = async () => {
        const { data, status } = await fetchAPI({
            url: '/api/v1/deposit/bank_deposit_transferred',
            options: {
                method: 'PUT',
            },
            params: {
                ...order,
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setOrderStatus(StatusBankTransfer.DepositedWaitingForConfirmation);
        }
    };
    return (
        <>
            <div className="card">
                <div className="card-header !py-5 !px-8">
                    <div className="text-sm text-black-600">
                        { t('wallet:transfer_detail') }
                    </div>
                </div>
                <div className="card-body !pt-3 !pb-12 !px-8">
                    <div className="form-group">
                        <label className="text-black-500">
                            { t('wallet:bank_name') }
                        </label>
                        <div className="text-sm font-medium">
                            {order?.metadata?.bank_details?.bank_name}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="text-black-500">
                            { t('wallet:account_holder') }
                        </label>
                        <div className="text-sm font-medium">
                            {order?.metadata?.bank_details?.account_name}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="text-black-500">
                            { t('wallet:account_number') }
                        </label>
                        <ItemWithCopy
                            label={order?.metadata?.bank_details?.account_number}
                            value={order?.metadata?.bank_details?.account_number}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-black-500">
                            { t('wallet:amount_transferred') }
                        </label>
                        <ItemWithCopy
                            label={`${formatPrice(order?.amount, 0)} VNDC`}
                            value={order?.amount}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-black-500">
                            { t('wallet:transaction_detail') }
                        </label>
                        <ItemWithCopy
                            label={order?.metadata?.contentSend}
                            value={order?.metadata?.contentSend}
                        />
                    </div>
                    <div className="rounded border border-black-200 bg-black-100 p-3 text-xs mt-5">
                        <div className="font-semibold text-sm mb-2">
                            { t('wallet:note') }
                        </div>
                        <div className="text-black-600">
                            { t('wallet:transfer_note') }
                        </div>
                    </div>
                    <div className="mt-5">
                        <button
                            className="btn btn-primary w-full"
                            type="button"
                            onClick={putOrder}
                            disabled={orderStatus === StatusBankTransfer.DepositedWaitingForConfirmation}
                        >
                            { t('wallet:transfer_already') }
                        </button>
                    </div>
                    <div className="mt-5">
                        <button
                            className="btn btn-secondary w-full"
                            type="button"
                            onClick={() => onClose(orderStatus !== order.status)}
                        >
                            { t('wallet:back') }
                        </button>
                    </div>
                    {
                        orderStatus === StatusBankTransfer.DepositedWaitingForConfirmation && (
                            <div className="mt-5 text-black-500 text-xs">
                                { t('wallet:if_not') }
                            </div>
                        )
                    }
                    <p className="mt-4 text-xs text-[#52535C]">{t('wallet:if_not')}</p>
                </div>
            </div>
        </>
    );
};

export default DetailDepositBank;
