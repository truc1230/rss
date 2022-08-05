import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import {useTranslation} from 'next-i18next';
import {getS3Url} from 'redux/actions/utils';

const AlertModal = forwardRef((props, ref) => {
    const {t} = useTranslation();
    const [isVisible, setVisible] = useState(false);
    const [height, setHeight] = useState(362 / 2);

    const options = useRef({
        type: '',
        title: '',
        messages: '',
        note: '',
    })
    const actions = useRef({
        onConfirm: null, onCancel: null,
    })

    useImperativeHandle(ref, () => ({
        show: onShow
    }))

    const onShow = (type, title, messages, note, onConfirm, onCancel, _options) => {
        options.current = {type, title, messages, note, ..._options};
        actions.current.onConfirm = onConfirm;
        actions.current.onCancel = onCancel;
        setVisible(true);
    }

    const onConfirm = () => {
        if (actions.current.onConfirm) actions.current.onConfirm();
        options.current = {}
        setVisible(false);
    }

    const onCancel = () => {
        options.current = {}
        if (actions.current.onCancel) actions.current.onCancel();
        setVisible(false);
    }

    const getImage = (type) => {
        switch (type) {
            case 'success':
                return '/images/icon/ic_success.png';
            case 'error':
                return '/images/icon/ic_error.png';
            case 'warning':
                return '/images/icon/ic_warning.png';
            case 'expired':
                return '/images/icon/ic_expired.png';
            default:
                return '/images/icon/success.png';
        }
    }

    useEffect(() => {
        setTimeout(() => {
            const el = document.querySelector('.alert-modal-mobile');
            if (el) {
                setHeight(el.clientHeight / 2)
            }
        }, 50);
    }, [isVisible])

    if (!options.current.title) return null;
    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onCancel}
               modalClassName="z-[99999999999]"
               containerStyle={{width: 'calc(100vw - 30px)', transform: 'translate(-50%,0)', left: '50%'}}
               onusClassName="!px-9 !pb-10 min-h-[334px] !bottom-[50px] rounded-[16px]"
        >
            <div className="flex flex-col items-center justify-between">
                <div className='mb-8'>
                    <img src={getS3Url(getImage(options.current.type))} width={80} height={80}/>
                </div>
                <div className='text-lg font-semibold mb-3 leading-6'>
                    {options.current.title}
                </div>
                <div className='text-center text-onus-grey font-normal leading-[1.375rem]'
                     dangerouslySetInnerHTML={{__html: options.current.messages}}>
                </div>
                {options.current.note && <div className='text-gray-1 text-center mt-[10px] '>
                    {options.current.note}
                </div>
                }
                <div className='flex items-center w-full mt-8'>
                    {!options.current?.hideCloseButton
                    && <Button
                        onusMode={true}
                        title={options.current.closeTitle || t('common:close')}
                        className={`!h-[3rem] !text-[16px] !font-semibold`}
                        componentType="button"
                        onClick={onCancel}
                    />
                    }
                    {actions.current?.onConfirm &&
                    <Button
                        onusMode={true}
                        title={options.current?.confirmTitle || t('futures:leverage:confirm')}
                        type="primary"
                        className={`ml-[7px] !h-[3rem] !text-[16px] !font-semibold`}
                        componentType="button"
                        onClick={onConfirm}
                    />
                    }
                </div>
            </div>
        </Modal>
    );
});

export default AlertModal;
