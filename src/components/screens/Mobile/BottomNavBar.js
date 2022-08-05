import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import classNames from 'classnames';
import { setBottomTab } from 'redux/actions/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const BottomNavBar = memo(() => {
    const router = useRouter();
    const { t } = useTranslation();
    const listNav = [
        { title: t('common:mobile:markets'), prefix: 'mobile', nav: 'market', icon: 'ic_mobile_markets' },
        { title: 'Futures', prefix: 'mobile', nav: 'futures', icon: 'ic_mobile_futures' },
        { title: t('common:mobile:wallets'), prefix: 'mobile', nav: 'wallet', icon: 'ic_mobile_wallets' },
    ]
    const [currentTheme] = useDarkMode()
    const dispatch = useDispatch();
    const isDark = currentTheme === THEME_MODE.DARK;
    const bottomNav = useSelector(state => state.utils.bottomNav)
    const [tab, setTab] = useState(bottomNav ?? listNav[0].nav);

    const onChangeTab = (e) => {
        router.push(`/${e.prefix}/${e.nav}`)
        dispatch(setBottomTab(e.nav))
        setTab(e.nav)
    }

    useEffect(() => {
        if (!bottomNav) {
            dispatch(setBottomTab(listNav[0].nav))
        }
    }, [])

    useEffect(() => {
        const _tab = listNav.find(rs => router.pathname.indexOf(rs.nav) !== -1);
        if (_tab) {
            setTab(_tab.nav);
        }
    }, [router])

    return (
        <Tabs isDark={isDark}>
            {listNav.map((item) => {
                return (
                    <Tab key={item.nav} active={tab === item.nav} onClick={() => onChangeTab(item)}>
                        <img src={`/images/icon/${item.icon}${tab === item.nav ? '_act' : ''}.png`} height="30" width="30" />
                        {item.title}
                    </Tab>
                )
            })}
        </Tabs>
    );
}, () => { return true });


const Tabs = styled.div.attrs({
    className: "bg-white dark:bg-darkBlue-3 bottom-navigation"
})`
    height:80px;
    width:100%;
    position:fixed;
    bottom:0;
    z-index:10;
    border-radius:12px 12px 0 0;
    padding:10px;
    display:flex;
    align-items:center;
    justify-content:space-around;
    box-shadow: 3px -5px 30px -16px rgba(0, 0, 0, 0.16);
    svg,path{
            fill:${colors.grey3}
        }
    .active{
        color: ${({ isDark }) => isDark ? colors.white : colors.darkBlue1};
        svg,path{
            fill:${colors.teal}
        }
    }

`
const Tab = styled.div.attrs(({ active }) => ({
    className: classNames(
        'text-xs text-gray-1 dark:text-txtSecondary-dark h-full flex items-center flex-col px-[10px]',
        {
            'active': active
        }
    )
}))`
`
export default BottomNavBar;
