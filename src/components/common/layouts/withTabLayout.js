import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { getLastestSourcePath } from 'redux/actions/utils';
import { PATHS } from 'constants/paths';
import { log } from 'utils';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import TabItem, { TabItemComponent } from 'components/common/TabItem';

import styled from 'styled-components';
import colors from 'styles/colors';
import useApp from 'hooks/useApp';

const INITIAL_STATE = {
    currentLastestPath: null,
}

export default (props) => (WrappedComponent) => {
    return wrappedProps => {
        // Own props
        const { routes, wrapperStyle = {}, tabStyle, useModal = false, hideInApp = false, debug } = props

        // Init state
        const [state, set] = useState(INITIAL_STATE)
        const setState = state => set(prevState => ({ ...prevState, ...state }))

        // Use hooks
        const [currentTheme, ] = useDarkMode()
        const router = useRouter()
        const { t } = useTranslation()
        const isApp = useApp()

        // Helper
        const setCurrentLastestPath = (currentLastestPath) => setState({ currentLastestPath })

        // Render Handler
        const renderTabLink = useCallback(() => {
            if (!(routes || Object.keys(routes).length) || (hideInApp && isApp)) return null

            return Object.values(routes).map(route => {
                const path = getLastestSourcePath(route?.pathname)
                const isActive = state.currentLastestPath === path

                return (
                    <TabItem key={`tab_link__${path}`} href={route?.pathname}
                             title={route?.localized ? t(route?.localized) : route?.alias}
                             active={isActive} component={TabItemComponent.Link}/>
                )
            })
        }, [routes, tabStyle, hideInApp, isApp, state.currentLastestPath])

        useEffect(() => {
            setCurrentLastestPath(getLastestSourcePath(router?.pathname))
        }, [router])

        useEffect(() => {
            debug && log.d('withTabLayout props => ', props)
        }, [props, debug])

        useEffect(() => {
            debug && log.d('withTabLayout state => ', state)
        }, [state, debug])

        return (
            <>
                <MaldivesLayout
                    contentWrapperStyle={{ ...wrapperStyle, position: useModal ? 'unset !important' : 'relative' }}
                    hideInApp={hideInApp && isApp}>
                    <Background isDark={currentTheme === THEME_MODE.DARK}>
                        <CustomContainer className="mal-container px-4 h-full">
                            <div className={hideInApp && isApp ?
                                'flex items-center mb-8 lg:mb-10'
                                : 'flex items-center mb-8 lg:mb-10 border-b border-divider dark:border-divider-dark'}>
                                {renderTabLink()}
                            </div>
                            <WrappedComponent {...wrappedProps}/>
                        </CustomContainer>
                    </Background>
                </MaldivesLayout>
            </>
        )
    }
}

const Background = styled.div.attrs({ className: 'w-full h-full pt-5 pb-24 lg:pb-32 2xl:pb-44' })`
  background-color: ${({ isDark }) => isDark ? colors.darkBlue1 : '#F8F9FA'};
`

const CustomContainer = styled.div`
  @media (min-width: 1024px) {
    max-width: 1000px !important;
  }

  @media (min-width: 1280px) {
    max-width: 1260px !important;
  }

  @media (min-width: 1440px) {
    max-width: 1300px !important;
  }

  @media (min-width: 1920px) {
    max-width: 1440px !important;
  }
`

export const TAB_ROUTES = {
    ACCOUNT: [
        { pathname: PATHS.ACCOUNT.PROFILE, alias: 'Profile', localized: 'navbar:menu.user.profile', auth: true },
        // { pathname: PATHS.ACCOUNT.SECURITY, alias: 'Security', localized: null, auth: true },
        { pathname: PATHS.ACCOUNT.IDENTIFICATION, alias: 'Identification', localized: 'identification:title_tab', auth: true },
        { pathname: PATHS.ACCOUNT.REWARD_CENTER, alias: 'Reward Center', localized: 'reward-center:title', auth: false },
        // { pathname: PATHS.ACCOUNT.REFERRAL, alias: 'Referral', localized: null, auth: true },
        // { pathname: PATHS.ACCOUNT.SETTINGS, alias: 'Settings', localized: null, auth: true },
    ],
    FEE_STRUCTURE: [
        { pathname: PATHS.FEE_STRUCTURES.TRADING, alias: 'Trading Fee', localized: 'fee-structure:trading_fee_t' },
        { pathname: PATHS.FEE_STRUCTURES.DEPWDL, alias: 'Deposit and Withdrawal Fee', localized: 'fee-structure:depwdl_fee' }
    ],
}
