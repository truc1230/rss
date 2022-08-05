import { createContext, useEffect, useRef, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { useWindowSize } from 'utils/customHooks';
import TransferModal from 'components/wallet/TransferModal';
import useApp from 'hooks/useApp';
import { PORTAL_MODAL_ID } from 'constants/constants';
import Head from 'next/head';
import AlertModal from 'components/screens/Mobile/AlertModal';
import { useDispatch } from 'react-redux';
import { reloadData } from 'redux/actions/heath';

export const AlertContext = createContext(null);

const LayoutMobile = ({
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
    const [state, set] = useState({ isDrawer: false });
    const setState = (_state) =>
        set((prevState) => ({ ...prevState, ..._state }));

    const dispath = useDispatch();

    // Use Hooks
    const {
        width,
        height
    } = useWindowSize();

    const isApp = useApp();
    const alert = useRef(null);

    useEffect(() => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        let vw = window.innerWidth;
        if (vw <= 360) {
            document.documentElement.style.setProperty('font-size', '14px');
        }
        document.body.classList.add('hidden-scrollbar');
        // document.body.classList.add('!bg-onus');
        setTimeout(() => {
            if (window.fcWidget) {
                window.fcWidget.hide();
                window.fcWidget.close();
            }
        }, 1000);

        const intervalReloadData = setInterval(() => {
            dispath(reloadData());
        }, 5 * 60 * 1000);

        return () => {
            document.body.classList.remove('hidden-scrollbar');
            // document.body.classList.remove('bg-onus');
            clearInterval(intervalReloadData);
        };
    }, []);

    const onHiddenBottomNavigation = (ishidden) => {
        const el = document.querySelector('.bottom-navigation');
        if (el) {
            el.style.display = ishidden ? 'none' : 'flex';
        }
    };

    return (
        <>
            <Head>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <div
                className={`layout-onus flex flex-col font-inter bg-onus`}
                style={
                    state.isDrawer
                        ? {
                            height,
                            overflow: 'hidden'
                        }
                        : {}
                }
            >
                <ReactNotifications className="fixed z-[9000] pointer-events-none w-full h-full"/>
                <div
                    className="relative flex-1 bg-onus dark:bg-onus"
                >
                    <AlertContext.Provider value={{
                        alert: alert.current,
                        onHiddenBottomNavigation
                    }}>
                        {children}
                    </AlertContext.Provider>
                </div>
                <TransferModal isMobile alert={alert.current}/>
                <div id={`${PORTAL_MODAL_ID}`}/>
                {/* <BottomNavBar /> */}
                <AlertModal ref={alert}/>
            </div>
        </>
    );
};

export default LayoutMobile;
