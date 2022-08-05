import React, { useMemo } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';

const OrderClose = ({ open, onClose, onConfirm, data, isMobile }) => {
    const { t } = useTranslation();

    const width = useMemo(() => {
        return window.innerWidth > 330 ? 'w-[340px]' : 'w-[300px]'
    }, [open])

    return (
        <Modal
            isVisible={open}
            onBackdropCb={onClose}
            containerClassName={!isMobile ? 'w-[390px]' : width + ' top-[50%]'}
        >
            <div>
                <div className="text-center text-xl font-bold capitalize">
                    {t('futures:close_order:modal_title', { value: data?.displaying_id })}
                </div>
                <div className="mt-3 text-center text-lg"
                    dangerouslySetInnerHTML={{ __html: t('futures:close_order:confirm_message', { value: data?.displaying_id }) }}>
                </div>
                <div className="mt-4 w-full flex flex-row items-center justify-center">
                    <Button
                        title={t('common:cancel')} type="default"
                        componentType="button"
                        style={{ width: '48%' }}
                        className="mr-[10px]"
                        onClick={onClose} />
                    <Button
                        title={t('common:confirm')} type="primary"
                        componentType="button"
                        style={{ width: '48%' }}
                        onClick={onConfirm} />
                </div>
            </div>
        </Modal>
    );
};

export default OrderClose;
