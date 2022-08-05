import React from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import { emitWebViewEvent, getS3Url } from 'redux/actions/utils';

const ExpiredModal = ({ onClose }) => {
    const { t } = useTranslation();

    const onRetry = () => {
        emitWebViewEvent('login');
    }

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
            containerClassName={`px-[24px] w-[342px] h-[458px] py-[32px] top-[50%] flex flex-col items-center justify-between`}>
            <div>
                <img src={getS3Url("/images/icon/ic_expired.png")} width={120} height={168} />
            </div>
            <div className="mt-4">
                <div className="text-center">
                    <div className="text-onus-white text-lg font-semibold">{t('futures:mobile:invalid_session_title')}</div>
                    <div className="text-onus-grey text-xs font-medium mt-4">{t('futures:mobile:invalid_session_content')}</div>
                </div>
                <Button
                    onusMode={true}
                    title={t('futures:mobile:retry')}
                    type="primary"
                    className={`!h-[44px] !text-sm !font-semibold mt-8`}
                    componentType="button"
                    onClick={onRetry}
                />
            </div>
        </Modal>
    );
};

export default ExpiredModal;
