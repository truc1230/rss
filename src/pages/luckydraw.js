import React, { useEffect, useState, useRef } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import styled from 'styled-components';
import LuckyPage from 'components/screens/Nao/Luckydraw/LuckyPage';
import LuckyTicket from 'components/screens/Nao/Luckydraw/LuckyTicket';
import { useWindowSize } from 'utils/customHooks';
import classnames from 'classnames';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { API_GET_TICKETS, API_CLAIM_TICKET } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import { emitWebViewEvent, getS3Url } from 'redux/actions/utils';
import { ArrowLeft } from 'react-feather';
import { Tooltip } from 'components/screens/Nao/NaoStyle'
import { useTranslation } from 'next-i18next'
import LuckyInfoModal from 'components/screens/Nao/Luckydraw/LuckyInfoModal'
import LuckyEndedModal from 'components/screens/Nao/Luckydraw/LuckyEndedModal'


const Luckydraw = () => {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState([]);
    const { width, height } = useWindowSize();
    const [open, setOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const ticket = useRef(null)
    const [loading, setLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const flag = useRef(false);
    const volume = useRef(0)

    useEffect(() => {
        // getTickets();
    }, [])

    const onClaim = async (code) => {
        try {
            const { data, status } = await fetchApi({
                url: API_CLAIM_TICKET,
                options: { method: 'POST' },
                params: {
                    ticket_code: code
                }
            });
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const getTickets = async () => {
        try {
            const { data, status } = await fetchApi({
                url: API_GET_TICKETS,
            });
            if (status === ApiStatus.SUCCESS) {
                volume.current = data?.data_volume
                setTickets(data?.tickets)
                setIsNewUser(data?.is_new_user)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    const _tickets = tickets.length > 0 ? tickets : false

    const onOpen = (data) => {
        if (!_tickets) return;
        ticket.current = data;
        flag.current = true;
        setTimeout(() => {
            setOpen(true);
        }, 300);
    }

    const onClose = (data) => {
        const _tickets = [...tickets];
        const index = _tickets.findIndex(i => i?._id === data?._id)
        _tickets.splice(index, 1)
        ticket.current = null;
        onClaim(data?.reward?.ticket_code)
        setTickets(_tickets)
        setOpen(false);
    }

    return (
        <LayoutNaoToken isHeader={false}>
            {showInfo && <LuckyInfoModal volume={volume.current} onClose={() => setShowInfo(false)} />}
            <LuckyEndedModal onClose={() => emitWebViewEvent('back')} />
            <Background>
                <BackgroundImage width={width} className="text-center !pt-12">
                    <div className="flex items-center justify-between relative top-0">
                        {_tickets && !open ? <ArrowLeft size={24} onClick={() => emitWebViewEvent('back')} /> : <div />}
                        {!open && <img onClick={() => setShowInfo(true)} src={getS3Url("/images/nao/luckydraw/v2/ic_helper.png")} width="24" height="24" alt="" />}
                    </div>
                    {!open ?
                        <LuckyPage isNewUser={isNewUser} volume={volume.current} flag={flag.current} loading={loading} tickets={_tickets} width={width} onOpen={onOpen} />
                        :
                        <LuckyTicket tickets={_tickets} ticket={ticket.current} open={open} width={width} onClose={onClose} />
                    }
                </BackgroundImage>
            </Background>
        </LayoutNaoToken>
    );
};


const Background = styled.div.attrs({
    className: 'min-w-full overflow-hidden'
})`
    background:radial-gradient(196.95% 136.02% at 50% -4.15%, #005BDF 0%, #010163 77.35%);
    height:calc(var(--vh, 1vh) * 100)
`

const BackgroundImage = styled.div.attrs(({ width }) => ({
    className: classnames(
        'min-w-full h-full flex flex-col justify-between overflow-hidden relative ',
        { 'px-4 pt-8 pb-6': width > 360 },
        { 'p-4': width <= 360 },
    )
}))`
    background-image:${() => `url(${getS3Url(`/images/nao/luckydraw/bg_screen.png`)})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center top;
`
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common', 'nao'
        ])),
    },
})
export default Luckydraw;
