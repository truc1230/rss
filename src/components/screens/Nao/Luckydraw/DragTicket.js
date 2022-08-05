import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'utils/customHooks';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import { TextTicket, TextTicketLiner } from 'components/screens/Nao/NaoStyle';
import { formatTime, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';

const DragTicket = ({ ticket, onOpen, xs, last, index, flag }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { t } = useTranslation();
    const dragRef = useRef(null);

    const handleDrag = (e, data) => {
        if (data.y < -(data.node.clientHeight / 5)) {
            setPosition({ x: 0, y: -1000 });
            setTimeout(() => {
                if (onOpen) onOpen(ticket);
            }, 300);
        }
    }

    const handleStop = (e, data) => {
        // if (data.y < -123) {
        //     data.node.style.transform = 'translate(0, -100vh)'
        //     setPosition({ x: 0, y: data.y });
        //     if (onOpen) onOpen(ticket);
        // }
    }

    const isGift = ticket?.can_receive;

    return (
        <Draggable
            axis="y"
            position={position}
            onDrag={handleDrag}
            onStop={handleStop}
            defaultClassName={`animation`}
            ref={dragRef}
        >

            <Ticket className={flag ? '' : 'grown-up'}>
                {/* <div className={`${!last ? 'rotate-[-10deg]' : ''}`}> */}
                <TextTicket className={`top-[38%] !opacity-100 ${isGift ? '!text-sm' : '!text-[1rem]'} font-semibold px-10 flex flex-col items-center`}>
                    {t(`nao:luckydraw:${isGift ? 'congrat_first' : 'goodluck'}`)}
                    {isGift && <div className="flex items-center space-x-2 pt-1">
                        <TextTicketLiner className="text-sm font-semibold">{ticket?.reward?.value} NAO</TextTicketLiner>
                    </div>}
                </TextTicket>
                <TextTicket xs={xs} className="top-[86%]">
                    <div className="leading-4">ID: #{ticket?.reward?.ticket_code}</div>
                    <div className="leading-4">{t('common:Thời gian')}: {formatTime(ticket?.reward?.time, 'yyyy-MM-dd HH:mm')}</div>
                </TextTicket>
                <img src={getS3Url(`/images/nao/luckydraw/v2/${isGift ? 'ic_gift' : 'ic_open_ticket'}.png`)} width={181} height={390} />
                {/* </div> */}
            </Ticket>
        </Draggable>
    );
};


const Ticket = styled.div.attrs({
    className: 'relative'
})`
    transition: transform 0.3s;
`


export default DragTicket;