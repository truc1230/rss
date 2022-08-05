import React from 'react';
import styled, {keyframes} from 'styled-components';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import DragTicket from 'components/screens/Nao/Luckydraw/DragTicket';
import {useTranslation} from 'next-i18next';
import {getS3Url, emitWebViewEvent} from 'redux/actions/utils';
import {ChevronUp} from 'react-feather';
import Skeletor from 'components/common/Skeletor';

const LuckyPage = ({
                       isNewUser,
                       volume,
                       tickets,
                       onOpen,
                       width,
                       loading,
                       flag
                   }) => {
    const {t} = useTranslation();
    const xs = width <= 360;
    const minWidth = xs ? 177 : 253;
    const zeroPad = (num, places) => String(num)
        .padStart(places, '0');

    const isReachTarget = {
        [10]: (isNewUser && volume > 1e7) || !isNewUser,
        [100]: volume > 1e8,
    }

    return (
        <>
            <div className="relative z-[2]">
                <div className={classnames(
                    'font-semibold text-[#02FFFE]',
                    {'text-sm leading-[22px] pb-2': xs},
                    {'leading-8 text-lg pb-4': !xs}
                )}>
                    {loading ? <Skeletor width={200} height={20}/> :
                        t(`nao:luckydraw:${tickets ? '' : 'not_'}ticket_title`, {value: zeroPad(tickets.length, 2)})}
                </div>
                <div className={classnames(
                    'font-medium ',
                    {'text-xs pb-8 px-8': xs},
                    {'leading-7 pb-12 px-5': !xs},
                    {'!pb-[10%]': tickets},
                )}>
                    {loading ? <Skeletor width={250} height={20}/> :
                        !tickets ?
                            isReachTarget[100] ? t(`nao:luckydraw:received_tickets`)
                                : t(`nao:luckydraw:ticket_des`, {
                                    vndc: isReachTarget[10] ? '100,000,000' : '10,000,000',
                                    nao: isReachTarget[10] ? '100' : '10',
                                }) : t('nao:luckydraw:pull_ticket')}
                </div>
                {!tickets && !loading &&
                <div onClick={() => emitWebViewEvent('back')}
                     className="mb-[5%] bg-nao-blue2 font-semibold leading-6 py-3 rounded-xl cursor-pointer">
                    {t('common:close')}
                </div>
                }
            </div>
            {tickets && <ArrowEffect/>}
            <BgCenter
                className={`select-none ${tickets ? 'top-[55%]' : 'top-1/2'}  ${xs ? 'min-w-[177px]' : 'min-w-[253px]'}`}>
                <div className={`bg-[#3C8BFD] w-full rounded-[50%] ${xs ? 'h-[165px] ' : 'h-[235px] '}`}></div>
                {tickets &&
                tickets.map((ticket, idx) => (
                    <BgCenter key={idx} className={`${xs ? 'min-w-[127px]' : 'min-w-[181px]'} top-[29%]`}>
                        <DragTicket flag={flag} last={tickets.length - 1 === idx} ticket={ticket} onOpen={onOpen}
                                    xs={xs}/>
                    </BgCenter>
                ))
                }
                <div style={{bottom: `calc(${minWidth}px/2)`}} className="z-[2] relative w-full">
                    <img src={getS3Url('/images/nao/luckydraw/bg_cover.png')}/>
                </div>
            </BgCenter>
            <div className={`${tickets ? 'h-[30%]' : 'h-[45%]'} bottom-0 absolute left-0  w-full`}>
                <img src={getS3Url('/images/nao/luckydraw/bg_footer.png')} className="w-full"/>
            </div>
        </>
    );
};

const ArrowEffect = () => {
    return (
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2">
            <div className="bounceAlpha-1 bounceAlpha">
                <ChevronUp size={30}/>
            </div>
            <div className="bounceAlpha-2 bounceAlpha -mt-6">
                <ChevronUp size={30}/>
            </div>
            <div className="bounceAlpha-3 bounceAlpha -mt-6">
                <ChevronUp size={30}/>
            </div>
        </div>
    );
};

const BgCenter = styled.div.attrs({
    className: 'absolute'
})`
    left: 50%;
    transform: translate(-50%, -42%)
`;
export default LuckyPage;
