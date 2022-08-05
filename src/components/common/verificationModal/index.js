import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const VerificationModal = ({ type }) => {
    const VERIFICATION_TYPE = ['email', 'google'];
    const { t } = useTranslation(['common']);

    const [code, setCode] = useState('');

    const handleClipboard = () => {
        // eslint-disable-next-line no-undef
        navigator.clipboard.readText()
            .then(text => {
                setCode(text);
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    };

    const handleResend = () => {
        console.log('resend code');
    };

    return (
        <div className="fixed w-full h-full z-30 flex items-center justify-center">
            <div className="bg-white w-[400px] px-8 py-12 rounded-[12px] box-border border border-[#EEF2FA]" style={{ boxShadow: '0px 16px 24px rgba(7, 12, 61, 0.04)' }}>
                <p className="text-2xl font-bold mb-2">{t('active_account_title')}</p>
                <p className="text-sm text-[#52535C] mb-8">{type === VERIFICATION_TYPE[0] ? t('active_account_email_desc') : t('active_account_google_auth_desc')}</p>
                <>
                    <p className="text-[12px] text-[#02083D]">{type === VERIFICATION_TYPE[0] ? t('active_account_email') : t('active_account_google')}</p>
                    <div className="relative flex flex-row items-center">
                        <input
                            type="text"
                            className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-14 text-[#02083D] text-sm"
                            placeholder={t('active_account_placeholder')}
                            onChange={e => setCode(e.target.value)}
                            value={code}
                        />
                        <div className="absolute top-2 right-4 cursor-pointer mt-[0.5px]" onClick={handleClipboard}>
                            <span className="text-[12px] text-[#00C8BC] font-bold">{t('active_account_paste')}</span>
                        </div>
                    </div>
                </>
                <div className="w-full flex flex-row items-center justify-center">
                    <p className="mt-3 text-[12px] text-[#8B8C9B]">{t('active_account_resend')} <span className="text-[12px] text-[#00C8BC] font-bold cursor-pointer" onClick={handleResend}>{t('active_account_resend_action')}</span></p>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
