import React, { useState, useCallback, useEffect } from 'react'
import {
    AnalyticCommission,
    AnalyticTitle,
    AnalyticTopLine,
    AnalyticWrapper,
    BannerButtonGroup,
    BannerContainer,
    BannerLeft,
    BannerRight, Containerz, ContentWrapper,
    CopyIcon, DesktopWrapper,
    ReferralCatergories,
    ReferralCatergoriesItem,
    ReferralCatergoriesWrapper,
    ReferralID,
    ReferralLink,
    SubParagrapgh,
    TextTransparent,
    ContentContainerz
} from './styledReference'
import ReferralDashboard from "./Dashboard";
import ReferralFriendsList from "./FriendsList";
import ReferralCommission from "./Commission";
import useWindowSize from "../../hooks/useWindowSize"
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy, Check } from "react-feather";
import Axios from 'axios';
import { API_REFERRAL_COMMISSION_LOG, API_REFERRAL_DASHBOARD, API_REFERRAL_FRIENDS_LIST } from "../../redux/actions/apis";

const EXPORT_SVG = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
        <path
            d="M12.6563 4.6875H11.25V5.62501H12.1875V14.0625H2.81251V5.62501H3.75002V4.6875H2.34376C2.08465 4.6875 1.875 4.89715 1.875 5.15626V14.5312C1.875 14.7904 2.08465 15 2.34376 15H12.6563C12.9154 15 13.125 14.7904 13.125 14.5312V5.15626C13.125 4.89715 12.9154 4.6875 12.6563 4.6875Z"
            fill="#00B6C7" />
        <path
            d="M7.03113 1.79443V8.43751H7.96863V1.79443L9.98096 3.80676L10.6438 3.14392L7.49988 0L4.35596 3.14392L5.0188 3.80676L7.03113 1.79443Z"
            fill="#00B6C7" />
    </g>
    <defs>
        <clipPath id="clip0">
            <rect width="15" height="15" fill="white" />
        </clipPath>
    </defs>
</svg>

const Type = {
    SPOT: 'SPOT',
    FUTURES: 'FUTURES',
}


const PCView = () => {
    const [mode, setMode] = useState(0) // 0 dashboard, 1 friendslist, 2 commission history
    const [clipboard, setClipboard] = useState({ referralId: false, referralLink: false, referralCode: false })
    const [typeSort, setTypeSort] = useState({ dashboard: 2, friendsList: 2, commissionHistory: 2 })
    const [timeSort, setTimeSort] = useState(1); // 1-all, 2-yesterday, 3-this week, 4-this month
    const [pageFriendList, setPageFriendList] = useState(0)
    const [pageCommission, setPageCommission] = useState(0)
    const [state, setState] = useState({ pageSize: 6, type: Type.SPOT })
    const [dashboardData, setDashboardData] = useState(null)
    const [friendsListData, setFriendsListData] = useState(null)
    const [commissionData, setCommissionData] = useState(null)

    const user = useSelector(state => state.auth.user) || null;

    const { t } = useTranslation('reference')

    const { width } = useWindowSize();

    // side effect
    useEffect(() => {
        fetchDashboard()
    }, []);

    useEffect(() => {
        const { pageSize } = state
        fetchFriendList(pageFriendList, pageSize)
        fetchCommissionHistory(pageCommission, pageSize, typeSort.commissionHistory === 2 ? Type.SPOT : Type.FUTURES)
    }, [pageCommission, pageFriendList, state, typeSort.commissionHistory])

    const fetchDashboard = () => {
        Axios.get(API_REFERRAL_DASHBOARD)
            .then(response => {
                const { status, data } = response.data
                console.log(data)
                if (status === 'ok') setDashboardData(data)
            })
            .catch(e => console.log('SYSTEM: An error occured from database provider: ', e))
    }

    const fetchFriendList = (page, pageSize, type) => {
        Axios.get(API_REFERRAL_FRIENDS_LIST, { params: { page, pageSize, type } })
            .then(response => {
                const { status, data } = response.data
                if (status === 'ok') setFriendsListData(data)
            })
            .catch(e => console.log('SYSTEM: An error occured from database provider: ', e))
    }

    const fetchCommissionHistory = (page, pageSize, type) => {
        Axios.get(API_REFERRAL_COMMISSION_LOG, { params: { page, pageSize, type } })
            .then(response => {
                const { status, data } = response.data
                if (status === 'ok') setCommissionData(data)
            })
            .catch(e => console.log('SYSTEM: An error occured from database provider: ', e))
    }


    const handleCompactLink = (address, first, last) => {
        return address ? `${address.substring(0, first)}...${address.substring(address.length - last)}` : ''
    }


    const renderBanner = useCallback(() => {
        // console.log('namidev-DEBUG: USER !!!', user)
        const code_refer = (user && user.hasOwnProperty('code_refer') && user.code_refer) || ''
        const referal_id = (user && user.hasOwnProperty('referal_id') && user.referal_id) || ''
        const link_refer = `https://nami.exchange/referral?ref=${code_refer ? code_refer : ''}`

        return (
            <BannerContainer>
                <Containerz>
                    <div className='md:flex block items-center justify-around w-full'>
                        <BannerLeft>
                            <div>
                                <div>{t('referral_pages.banner.title1')}</div>
                                <br />
                                <div className='mt-2'>{t('referral_pages.banner.title2')}</div>
                            </div>
                            <SubParagrapgh>
                                <b>{t('referral_pages.banner.sub_title')}</b>

                            </SubParagrapgh>
                        </BannerLeft>
                        <BannerRight>
                            <AnalyticTopLine />
                            <AnalyticWrapper>
                                <AnalyticTitle>
                                    {t('referral_pages.banner.referral_code')}

                                </AnalyticTitle>
                                <ReferralID>
                                    <div>{code_refer || '---'}</div>
                                    <CopyToClipboard text={code_refer}
                                        onCopy={() => handleCopy('referralCode')}>
                                        <CopyIcon>
                                            {clipboard.referralCode ? <Check /> : <Copy />}
                                        </CopyIcon>
                                    </CopyToClipboard>
                                </ReferralID>
                                {/*<Row>*/}
                                {/*    <Col style={{paddingRight: 0}}>*/}
                                <AnalyticTitle>

                                    {t('referral_pages.banner.referral_link')}

                                </AnalyticTitle>
                                <ReferralLink>
                                    {code_refer ? handleCompactLink(link_refer, 15, 10) : '---'}
                                    <CopyToClipboard text={link_refer}
                                        onCopy={() => handleCopy('referralLink')}>
                                        <CopyIcon>
                                            {clipboard.referralLink ? <Check /> : <Copy />}
                                        </CopyIcon>
                                    </CopyToClipboard>
                                </ReferralLink>
                                {/*</Col>*/}
                                {/*{width >= 414 ? null : <div className='w-100'/>}*/}
                                {/*<Col style={width > 414 ? {paddingLeft: 0} : {marginTop: 15}}>*/}
                                {/*    <AnalyticTitle><Translate*/}
                                {/*        id='referral_pages.banner.referral_code'/></AnalyticTitle>*/}
                                {/*    <ReferralLink>*/}
                                {/*        {code_refer}*/}
                                {/*        <CopyToClipboard text={code_refer}*/}
                                {/*                         onCopy={() => handleCopy('referralCode')}>*/}
                                {/*            <CopyIcon>*/}
                                {/*                {clipboard.referralCode ? <Check/> : <Copy/>}*/}
                                {/*            </CopyIcon>*/}
                                {/*        </CopyToClipboard>*/}
                                {/*    </ReferralLink>*/}
                                {/*</Col>*/}
                                {/*</Row>*/}
                                <AnalyticCommission>
                                    <div>
                                        <div>
                                            {t('referral_pages.banner.exchange_commission')}
                                        </div>
                                        <div>20%</div>
                                    </div>
                                    <div>
                                        <div>

                                            {t('referral_pages.banner.futures_commission')}
                                        </div>
                                        <div>20%</div>
                                    </div>
                                </AnalyticCommission>
                            </AnalyticWrapper>
                        </BannerRight>
                    </div>
                </Containerz>
            </BannerContainer>
        )
    }, [width, clipboard, user])

    const handleScroll = (mode, section) => {
        setMode(mode);
        document.getElementById(section).scrollIntoView({ block: 'center', behavior: 'smooth' })
    }

    const renderCategories = useCallback(() => {
        return (
            <ReferralCatergories>
                <ReferralCatergoriesWrapper>
                    <ReferralCatergoriesItem active={mode === 0} onClick={() => handleScroll(0, 'dashboard')}>
                        {t('referral_pages.categories.dashboard')}
                    </ReferralCatergoriesItem>
                    <ReferralCatergoriesItem active={mode === 1} onClick={() => handleScroll(1, 'friendslist')}>
                        {t('referral_pages.categories.friends_list')}

                    </ReferralCatergoriesItem>
                    <ReferralCatergoriesItem active={mode === 2} onClick={() => handleScroll(2, 'commission-history')}>
                        {t('referral_pages.categories.commission_history')}

                    </ReferralCatergoriesItem>
                </ReferralCatergoriesWrapper>
            </ReferralCatergories>
        )
    }, [mode, width])

    return (
        <div>
            {renderBanner()}
            {renderCategories()}
            <DesktopWrapper>
                <ContentContainerz>
                    <ContentWrapper id='dashboard'>
                        <ReferralDashboard data={dashboardData} width={width} typeSort={typeSort} setTypeSort={setTypeSort}
                            timeSort={timeSort} setTimeSort={setTimeSort} user={user} />
                    </ContentWrapper>
                    <ContentWrapper id='friendslist'>
                        <ReferralFriendsList data={friendsListData} width={width} ExportSvg={EXPORT_SVG}
                            state={state} setState={setState} page={pageFriendList} setPage={setPageFriendList}
                            typeSort={typeSort} setTypeSort={setTypeSort} user={user} />
                    </ContentWrapper>
                    <ContentWrapper id='commission-history'>
                        <ReferralCommission data={commissionData} width={width} ExportSvg={EXPORT_SVG}
                            state={state} setState={setState} page={pageCommission} setPage={setPageCommission}
                            typeSort={typeSort} setTypeSort={setTypeSort} user={user} />
                    </ContentWrapper>
                </ContentContainerz>
            </DesktopWrapper>
        </div>
    )
}


export default PCView