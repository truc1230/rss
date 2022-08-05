import Button from 'src/components/common/Button';

import { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

const Modal = ({
                   isVisible,
                   children,
                   title,
                   positiveLabel,
                   negativeLabel,
                   onConfirmCb,
                   onCloseCb,
                   onBackdropCb,
                   className = '',
                   containerClassName = '',
                   type = 'alert',
                   noButton = false,
                   titleStyle
               }) => {

    const { t } = useTranslation(['common'])

    const renderButtonGroup = useCallback(() => {

        if (type === 'confirm-one-choice') {
            return <Button title={positiveLabel || t('common:confirm')} type="primary"
                           componentType="button"
                           onClick={() => onConfirmCb && onConfirmCb()}/>
        }

        if (type === 'confirmation') {
            return (
                <>
                    <Button title={negativeLabel || t('common:close')} type="secondary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={() => onCloseCb && onCloseCb()}/>
                    <Button title={positiveLabel || t('common:confirm')} type="primary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={() => onConfirmCb && onConfirmCb()}/>
                </>
            )
        }

        if (type === 'alert') {
            return <Button title={negativeLabel || t('common:close')} type="secondary"
                           componentType="button"
                           onClick={() => onCloseCb && onCloseCb()}/>
        }
    }, [type, positiveLabel, negativeLabel, onConfirmCb, onCloseCb])

    return (
        <>
            <div className={`mal-overlay ${isVisible ? 'mal-overlay__active' : ''}`}
                 onClick={() => onBackdropCb && onBackdropCb()}/>
            <div className={classNames('mal-modal z-[9999999999] min-w-[280px]', containerClassName)}>
                {isVisible &&
                <div className={'p-4 ' + className}>
                    {title && <div
                        className={titleStyle ? 'mt-3 text-center font-bold ' + titleStyle : 'mt-3 text-center font-bold'}>{title}</div>}
                    {children}
                    {!noButton && <div className="flex flex-row items-center justify-between mt-5">
                        {renderButtonGroup()}
                    </div>}
                </div>}
            </div>
        </>
    )
}

export default Modal
