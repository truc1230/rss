import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import { useWindowSize } from 'utils/customHooks';
import SvgMenu from 'components/svg/Menu';
import { getS3Url } from 'redux/actions/utils';
import colors from 'styles/colors';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import Portal from 'components/hoc/Portal';
import { X, ArrowLeft } from 'react-feather';
import classNames from 'classnames';
import StakeTab from 'components/screens/Nao/Stake/StakeTab';
import PerformanceTab from 'components/screens/Nao/Stake/PerformanceTab';
import { BackgroundHeader } from 'components/screens/Nao/NaoStyle';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import fetchApi from 'utils/fetch-api';
import { API_POOL_USER_INFO } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useRouter } from 'next/router'; 'next/router'
import { useOutsideAlerter } from 'components/screens/Nao/NaoStyle';

const getAssetNao = createSelector(
    [
        state => state.utils.assetConfig,
        (utils, params) => params
    ],
    (assets, params) => {
        return assets.find(rs => rs.assetCode === params);
    }
);

const Stake = () => {
    const { width, height } = useWindowSize();
    const [visible, setVisible] = useState(false);
    const [currentLocale, onChangeLang] = useLanguage();
    const { t, i18n: { language } } = useTranslation();
    const [tab, setTab] = useState(0);
    const [dataSource, setDataSource] = useState(null);
    const assetNao = useSelector(state => getAssetNao(state, 'NAO'));
    const refStake = useRef(null);
    const router = useRouter();

    useEffect(() => {
        getStake();
    }, [])

    const getStake = async () => {
        try {
            const { data } = await fetchApi({
                url: API_POOL_USER_INFO,
            });
            if (data) {
                setDataSource(data)
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const onShowLock = () => {
        refStake.current.showLock(true)
    }

    return (
        <LayoutNaoToken isHeader={false}>
            <div className="bg-nao-bgShadow sticky top-0 z-10">
                <BackgroundHeader className="stake_header">
                    {/* <Drawer visible={visible} onClose={() => setVisible(false)} onChangeLang={onChangeLang}
                    language={language} t={t} />
                <div className="flex items-center justify-between px-4 pt-6">
                    <img src={getS3Url("/images/nao/ic_nao.png")} alt="" width={40} height={40} />
                    {width <= 768 &&
                        <div
                            className='relative'
                            onClick={() => setVisible(true)}
                        >
                            <SvgMenu
                                size={25}
                                className={'cursor-pointer select-none'}
                                color={colors.nao.text}
                            />
                        </div>
                    }
                </div> */}
                    <div className='flex items-center justify-center py-4'>
                        <div className='absolute left-5'>
                            <ArrowLeft onClick={() => router.back()} />
                        </div>
                        <label className="text-[20px] font-semibold leading-[50px] text-nao-green">{t('nao:governance_pool')}</label>
                    </div>
                    <Tabs tab={tab}>
                        <TabItem onClick={() => setTab(0)} active={tab === 0}>{t("nao:pool:stake_nao")}</TabItem>
                        <TabItem onClick={() => setTab(1)} active={tab === 1}>{t("nao:pool:performance")}</TabItem>
                    </Tabs>
                </BackgroundHeader>
            </div>
            <div className="h-full w-full px-4 py-6">
                <div className={tab !== 0 ? 'hidden' : ''}>
                    <StakeTab ref={refStake} assetNao={assetNao} dataSource={dataSource} getStake={getStake} />
                </div>
                <div className={tab !== 1 ? 'hidden' : height < 600 ? 'min-h-[600px] relative' : ''}>
                    <PerformanceTab onShowLock={onShowLock} assetNao={assetNao} isSmall={height < 600} dataSource={dataSource} />
                </div>
            </div>
        </LayoutNaoToken>
    );
};

const Drawer = ({ visible, onClose, language, onChangeLang, t, scrollToView }) => {
    const wrapperRef = useRef(null);
    const timer = useRef(null)
    const handleOutside = () => {
        if (visible && onClose) {
            onClose()
        }
    }

    useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden')
        } else {
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                document.body.classList.remove('overflow-hidden')
            }, 300);
        }
    }, [visible])

    useOutsideAlerter(wrapperRef, handleOutside.bind(this));

    const _scrollToView = (el) => {
        document.body.classList.remove('overflow-hidden')
        if (scrollToView) scrollToView(el)
    }

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div
                className={classNames(
                    'flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden',
                    'ease-in-out transition-all flex items-end duration-300 z-30',
                    { invisible: !visible },
                    { visible: visible },
                    { 'translate-x-full': !visible },
                    { 'translate-x-0': visible },
                )}
            >
                <div ref={wrapperRef} className='flex-1 w-[284px] min-h-0 bg-nao-bgModal'>
                    <div className="pt-[35px] px-5 flex justify-end">
                        <img className="cursor-pointer select-none" onClick={onClose} src={getS3Url('/images/nao/ic_close.png')} height='18' width='18' alt="" />
                    </div>
                    <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between h-[calc(100%-65px)]">
                    </div>
                </div>

            </div>
        </Portal>
    )
}

const Tabs = styled.div.attrs({
    className: 'relative flex items-center border-b-4 border-nao-white/[0.1] '
})`
  &:after{
        content: "";
        position:absolute;
        bottom:-4px;
        height:4px;
        background-color:${() => colors.nao.green};
        transform:${({ tab }) => `translate(${tab * 100}%,0)`};
        width:50%;
        transition: all 0.2s;
    }
`

const TabItem = styled.div.attrs(({ active }) => ({
    className: `pb-3 w-full flex items-center justify-center text-sm leading-6 ${active ? 'text-nao-green font-semibold' : 'text-nao-text'}`
}))`
  
`

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common', 'nao', 'error'
        ])),
    },
})
export default Stake;
