import Footer from 'src/components/common/Footer/Footer';
import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT, } from 'src/components/common/NavBar/constants';
import NavBar from 'src/components/common/NavBar/NavBar';
import { useEffect, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component'
import { useWindowSize } from 'utils/customHooks';
import TransferModal from 'components/wallet/TransferModal';
import useApp from 'hooks/useApp';
import { PORTAL_MODAL_ID } from 'constants/constants';
import { NavBarBottomShadow } from '../NavBar/NavBar';
import { useStore } from 'src/redux/store';
import {setTheme } from 'redux/actions/user';
const MadivesLayout = ({
    navOverComponent,
    navMode = false,
    hideFooter = false,
    navStyle = {},
    navName,
    contentWrapperStyle = {},
    light,
    dark,
    children,
    hideNavBar,
    page,
    changeLayoutCb,
    hideInApp,
    spotState,
    resetDefault,
    onChangeSpotState,
    useNavShadow = false,
    useGridSettings = false,
}) => {
    // * Initial State
    const [state, set] = useState({ isDrawer: false })
    const setState = (_state) =>
        set((prevState) => ({ ...prevState, ..._state }))

    // Use Hooks
    const { width, height } = useWindowSize()

    const isApp = useApp()

    // NOTE: Apply this style for NavBar on this layout.
    const navbarStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
    }
    const store = useStore();
    useEffect(() => {
        store.dispatch(setTheme());
    }, []);

    return (
        <>
            <div
                className={`mal-layouts flex flex-col ${light ? 'mal-layouts___light' : ''
                    } ${dark ? 'mal-layouts___dark' : ''}`}
                style={
                    state.isDrawer
                        ? {
                            height,
                            overflow: 'hidden',
                        }
                        : {}
                }
            >
                <ReactNotifications className='fixed z-[9000] pointer-events-none w-full h-full' />
                {!hideNavBar && !hideInApp && !isApp && (
                    <NavBar
                        name={navName}
                        useOnly={navMode}
                        style={{ ...navbarStyle, ...navStyle }}
                        spotState={spotState}
                        onChangeSpotState={onChangeSpotState}
                        resetDefault={resetDefault}
                        layoutStateHandler={setState}
                        page={page}
                        changeLayoutCb={changeLayoutCb}
                        useGridSettings={useGridSettings}
                    />
                )}
                <div
                    style={{
                        paddingTop:
                            !navOverComponent && !hideInApp && !isApp
                                ? width >= 992
                                    ? DESKTOP_NAV_HEIGHT
                                    : MOBILE_NAV_HEIGHT
                                : 0,
                        ...contentWrapperStyle,
                    }}
                    className='relative flex-1 bg-white dark:bg-darkBlue-1'
                >
                    {useNavShadow && <NavBarBottomShadow />}
                    {children}
                </div>
                {!hideFooter && !hideInApp && <Footer />}
                <TransferModal />
                <div id={`${PORTAL_MODAL_ID}`} />
            </div>
        </>
    )
}

export default MadivesLayout
