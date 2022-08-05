import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { getS3Url } from 'redux/actions/utils';

const NotKYC = ({ type }) => {
    const { t } = useTranslation();
    return (
        <div className="grid lg:grid-cols-2 items-center gap-y-7">
            <div>
                <div className="text-2xl mb-12 font-medium">
                    {type === 'deposit'
                        ? t('wallet:not_kyc_deposit_fiat')
                        : t('wallet:not_kyc')}
                </div>
                <Link href="/my/verification">
                    <button
                        className="btn btn-primary"
                        type="button"
                    >{t('wallet:go_verification')}
                    </button>
                </Link>

            </div>
            <div>
                <img src={getS3Url("/images/bg/withdraw-vndc-section-1.svg")} alt="" />
            </div>
        </div>
    );
};

export default NotKYC;
