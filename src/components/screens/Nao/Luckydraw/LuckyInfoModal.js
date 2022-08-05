import React, { useRef } from 'react';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { Progressbar, useOutsideAlerter } from 'components/screens/Nao/NaoStyle'
import { formatNumber } from 'redux/actions/utils';

const LuckyInfoModal = ({ visible = true, onClose, volume }) => {
    const { t } = useTranslation();
    const wrapperRef = useRef(null)

    useOutsideAlerter(wrapperRef, onClose)

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div
                className={classNames(
                    'flex flex-col items-center justify-center fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden',
                    { invisible: !visible },
                    { visible: visible },
                )}
            >
                <div ref={wrapperRef} className={'max-w-[330px] bg-[#00288C] rounded-3xl px-6 py-10 relative mx-[1.875rem] text-center flex flex-col items-center'}>
                    <label className='text-[#02FFFE] text-xl leading-7 font-semibold'>{t('nao:luckydraw:conditions')}</label>
                    <div className='pt-[1.125rem]'>{t('nao:luckydraw:ticket_des', { vndc: '100,000,000', nao: '100' })}</div>
                    <div className='pt-10'>
                        <div className="text-nao-text2 text-sm leading-5">{t('nao:luckydraw:vol_trade')}</div>
                        <div className="font-semibold leading-6 pt-2">{formatNumber(volume, 0)} VNDC</div>
                    </div>
                    <div className='pt-6 w-full'>
                        <div className='flex items-center justify-between text-nao-text2 text-xs pb-2'>
                            <div>{formatNumber(volume, 0)}</div>
                            <div>100,000,000</div>
                        </div>
                        <div className="w-full bg-nao-text2/[0.3] rounded-lg">
                            <Progressbar background="#02FFFE" height={10} percent={Math.ceil(volume / 100000000 * 100)} />
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default LuckyInfoModal;