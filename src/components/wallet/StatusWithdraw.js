import { StatusBankTransfer } from 'src/redux/actions/const';
import { useTranslation } from 'next-i18next';

const StatusWithdraw = ({ status }) => {
    const { t } = useTranslation('common');
    let text = '';
    let className = '';
    switch (status) {
        case StatusBankTransfer.Success:
            text = t('success');
            className = 'text-teal';
            break;
        case StatusBankTransfer.Declined:
            text = t('expired');
            className = 'text-red';
            break;
        case StatusBankTransfer.Pending:
            text = t('pending');
            className = 'text-yellow';
            break;
        case StatusBankTransfer.DepositedWaitingForConfirmation:
            text = t('waiting_confirmation');
            className = 'text-yellow';
            break;
        case StatusBankTransfer.TransferredWaitingForConfirmation:
            text = t('waiting_confirmation');
            className = 'text-yellow';
            break;
        default:
            break;
    }
    return <span data-tag="allowRowEvents" className={className}>{text}</span>;
};

export default StatusWithdraw;
