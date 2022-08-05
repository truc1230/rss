import React from 'react';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

const LuckyEndedModal = ({ visible = true, onClose }) => {
    const { t } = useTranslation();

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div
                className={classNames(
                    'flex flex-col items-center justify-center fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden',
                    { invisible: !visible },
                    { visible: visible },
                )}
            >
                <div className={'relative h-full mx-4'}>
                    <div className={'max-w-[330px] mx-[0.875rem] min-h-[346px] bg-[#00288C] rounded-3xl px-6 py-10 relative text-center flex flex-col items-center top-1/2 -translate-y-1/2'}>
                        <label className='text-[#02FFFE] text-xl leading-7 font-semibold'>{t('nao:luckydraw:the_promotion_end_title')}</label>
                        <div className='pt-[1.125rem]'>{t('nao:luckydraw:the_promotion_end_description')}</div>
                        <div className='absolute bottom-0 right-[22px]'>
                            <img className="w-[170px] h-[173px]" src={getS3Url('/images/nao/luckydraw/ic_the_promotion_end.png')} />
                        </div>
                    </div>
                    <div className="absolute bottom-[3.75rem] w-full">
                        <div onClick={() => onClose()}
                            className="bg-nao-blue2 text-center font-semibold leading-6 py-3 rounded-xl cursor-pointer">
                            {t('common:close')}
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default LuckyEndedModal;