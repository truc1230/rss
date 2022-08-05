import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, memo } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import { ButtonNao, useOutsideAlerter } from 'components/screens/Nao/NaoStyle';
import useWindowSize from 'hooks/useWindowSize';

const AlertNaoV2Modal = memo(forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [isVisible, setVisible] = useState(false);
    const [height, setHeight] = useState(362 / 2);
    const timer = useRef(null);
    const isClose = useRef(false)
    const { width } = useWindowSize()
    const isMobile = width <= 640;
    const wrapperRef = useRef(null);


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
        options.current = { type, title, messages, note, ..._options };
        actions.current.onConfirm = onConfirm;
        actions.current.onCancel = onCancel;
        isClose.current = false;
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            isClose.current = true
        }, 500);
        setVisible(true);
    }

    const onConfirm = () => {
        if (!isClose.current) return;
        if (actions.current.onConfirm) actions.current.onConfirm();
        options.current = {}
        setVisible(false);
    }

    const onCancel = () => {
        if (!isClose.current) return;
        options.current = {}
        if (actions.current.onCancel) actions.current.onCancel();
        setVisible(false);
    }

    useOutsideAlerter(wrapperRef, onCancel);


    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <SuccessIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />
            case 'team':
                return <TeamIcon />
            default:
                return <SuccessIcon />;
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
            onusClassName={`${isMobile ? 'pb-[3.75rem] !px-6' : '!p-8 max-w-[420px]'} min-h-[304px] rounded-t-[16px] !bg-nao-tooltip `}
            containerClassName="!bg-nao-bgModal2/[0.9]"
            center={!isMobile}
            isAlertModal
        >
            <div ref={wrapperRef} className="flex flex-col items-center justify-between h-full">
                <div className='mb-6'>
                    {getIcon(options.current.type)}
                </div>
                <div className='text-2xl font-semibold leading-8 mb-6 text-center'>
                    {options.current.title}
                </div>
                {options.current.messages &&
                    <div className='mb-6 text-center text-sm' dangerouslySetInnerHTML={{ __html: options.current.messages }}>
                        {/* {options.current.messages} */}
                    </div>
                }
                {/* <div className='text-gray-1 mb-[30px] text-center'>
                    {options.current.note}
                </div> */}
                <div className='flex items-center w-full space-x-4'>
                    {!options.current?.hideCloseButton
                        && <ButtonNao onClick={onCancel} border className="w-full !rounded-md">{options.current.closeTitle || t('common:close')}</ButtonNao>
                    }
                    {actions.current?.onConfirm &&
                        <ButtonNao onClick={onConfirm} className="w-full !rounded-md">
                            {options.current?.confirmTitle || t('futures:leverage:confirm')}
                        </ButtonNao>
                    }
                </div>
            </div>
        </Modal>
    );
}));


const SuccessIcon = () => {
    return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M57 26L37.1667 52L23 41.0526" stroke="#49E8D5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M77 40C77 60.4345 60.4345 77 40 77C19.5655 77 3 60.4345 3 40C3 19.5655 19.5655 3 40 3C60.4345 3 77 19.5655 77 40Z" stroke="#49E8D5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const WarningIcon = ({ size = 80 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M40 0C62.056 0 80 17.944 80 40C80 62.056 62.056 80 40 80C17.944 80 0 62.056 0 40C0 17.944 17.944 0 40 0ZM40 6C21.252 6 6 21.252 6 40C6 58.748 21.252 74 40 74C58.748 74 74 58.748 74 40C74 21.252 58.748 6 40 6ZM40.0156 51.1836C42.2276 51.1836 44.0156 52.9716 44.0156 55.1836C44.0156 57.3956 42.2276 59.1836 40.0156 59.1836C37.8036 59.1836 35.9956 57.3956 35.9956 55.1836C35.9956 52.9716 37.7676 51.1836 39.9756 51.1836H40.0156ZM39.9764 21.816C41.6324 21.816 42.9764 23.16 42.9764 24.816V42.492C42.9764 44.148 41.6324 45.492 39.9764 45.492C38.3204 45.492 36.9764 44.148 36.9764 42.492V24.816C36.9764 23.16 38.3204 21.816 39.9764 21.816Z" fill="#FF9F1A" />
        </svg>
    )
}

export const ErrorIcon = () => {
    return (
        <svg width="89" height="80" viewBox="0 0 89 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M44.0515 0C48.5385 0 52.5548 2.32706 54.7807 6.22457L86.3918 61.4935C88.6045 65.3602 88.5913 69.9747 86.3522 73.8326C84.1131 77.6949 80.1144 80 75.6582 80H12.3876C7.92703 80 3.92835 77.6949 1.68927 73.8326C-0.549815 69.9747 -0.563012 65.3602 1.64968 61.4935L33.3224 6.21577C35.5483 2.32267 39.5558 0 44.0471 0H44.0515ZM44.0471 6.59848C41.9532 6.59848 40.088 7.68063 39.0411 9.49741L7.37716 64.7707C6.3478 66.5743 6.3566 68.7254 7.39916 70.5246C8.44172 72.3238 10.3069 73.4015 12.3876 73.4015H75.6582C77.7346 73.4015 79.5997 72.3238 80.6423 70.5246C81.6893 68.7254 81.6981 66.5743 80.6599 64.7707L49.0532 9.49741C48.0106 7.68063 46.1454 6.59848 44.0471 6.59848ZM44.0172 54.9829C46.4499 54.9829 48.4162 56.9493 48.4162 59.3819C48.4162 61.8146 46.4499 63.7809 44.0172 63.7809C41.5846 63.7809 39.5962 61.8146 39.5962 59.3819C39.5962 56.9493 41.545 54.9829 43.9732 54.9829H44.0172ZM44.0084 28.875C45.8296 28.875 47.3077 30.353 47.3077 32.1742V45.8111C47.3077 47.6322 45.8296 49.1103 44.0084 49.1103C42.1872 49.1103 40.7092 47.6322 40.7092 45.8111V32.1742C40.7092 30.353 42.1872 28.875 44.0084 28.875Z" fill="#DC1F4E" />
        </svg>
    )
}

const TeamIcon = () => {
    return (
        <svg width="68" height="61" viewBox="0 0 68 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.1666 40C46.3883 40 49 42.6117 49 45.8333L48.9964 49.0402C49.3852 56.3372 43.9598 60.0301 34.2226 60.0301C24.5262 60.0301 19 56.3974 19 49.1667V45.8333C19 42.6117 21.6116 40 24.8333 40H43.1666ZM43.1666 45H24.8333C24.3731 45 24 45.3731 24 45.8333V49.1667C24 53.0872 26.9555 55.0301 34.2226 55.0301C41.4489 55.0301 44.2084 53.1518 44 49.1733V45.8333C44 45.3731 43.6269 45 43.1666 45ZM6.49996 23.3333L21.0866 23.3336C20.8124 24.3989 20.6666 25.5158 20.6666 26.6667C20.6666 27.2304 20.7016 27.7859 20.7695 28.3311L6.49996 28.3333C6.03972 28.3333 5.66663 28.7064 5.66663 29.1667V32.5C5.66663 36.4206 8.62218 38.3635 15.8893 38.3635C17.4289 38.3635 18.7658 38.2782 19.9144 38.1055C18.0305 39.299 16.6182 41.1632 16.004 43.3606L15.8893 43.3635C6.19283 43.3635 0.666626 39.7307 0.666626 32.5V29.1667C0.666626 25.945 3.2783 23.3333 6.49996 23.3333ZM61.5 23.3333C64.7216 23.3333 67.3333 25.945 67.3333 29.1667L67.3298 32.3736C67.7185 39.6705 62.2931 43.3635 52.5559 43.3635L51.9951 43.3576C51.3635 41.1008 49.8898 39.1957 47.9342 38.0025C49.2231 38.2445 50.7575 38.3635 52.5559 38.3635C59.7822 38.3635 62.5417 36.4852 62.3333 32.5066V29.1667C62.3333 28.7064 61.9602 28.3333 61.5 28.3333L47.2305 28.3307C47.2983 27.7856 47.3333 27.2302 47.3333 26.6667C47.3333 25.5158 47.1875 24.3989 46.9133 23.3336L61.5 23.3333ZM34 16.6667C39.5228 16.6667 44 21.1438 44 26.6667C44 32.1895 39.5228 36.6667 34 36.6667C28.4771 36.6667 24 32.1895 24 26.6667C24 21.1438 28.4771 16.6667 34 16.6667ZM34 21.6667C31.2385 21.6667 29 23.9052 29 26.6667C29 29.4281 31.2385 31.6667 34 31.6667C36.7614 31.6667 39 29.4281 39 26.6667C39 23.9052 36.7614 21.6667 34 21.6667ZM15.6666 0C21.1895 0 25.6666 4.47715 25.6666 10C25.6666 15.5228 21.1895 20 15.6666 20C10.1438 20 5.66663 15.5228 5.66663 10C5.66663 4.47715 10.1438 0 15.6666 0ZM52.3333 0C57.8561 0 62.3333 4.47715 62.3333 10C62.3333 15.5228 57.8561 20 52.3333 20C46.8104 20 42.3333 15.5228 42.3333 10C42.3333 4.47715 46.8104 0 52.3333 0ZM15.6666 5C12.9052 5 10.6666 7.23858 10.6666 10C10.6666 12.7614 12.9052 15 15.6666 15C18.428 15 20.6666 12.7614 20.6666 10C20.6666 7.23858 18.428 5 15.6666 5ZM52.3333 5C49.5719 5 47.3333 7.23858 47.3333 10C47.3333 12.7614 49.5719 15 52.3333 15C55.0947 15 57.3333 12.7614 57.3333 10C57.3333 7.23858 55.0947 5 52.3333 5Z" fill="#49E8D5" />
        </svg>
    )
}

export default AlertNaoV2Modal;
