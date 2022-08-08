/* eslint-disable no-alert, no-console */
// @ts-nocheck
// import { appWithTranslation, useTranslation } from 'next-i18next';

import '../styles/app.scss';
import '../../public/css/font.css';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store, { persistor } from '../store';
import LoadingPage from '../components/LoadingPage';
import { useRef } from 'react';
import { Web3WalletProvider } from '../store/wallet/walletProvider';

const App = ({ Component, pageProps }) => {
    const {
        i18n: { language }
    } = useTranslation();
    const qcRef = useRef(
        new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        })
    );
    const walletProviderConfig = {
        walletConnect: {
            rpc: {
                1: 'https://mainet.infura.io/v3/f87b967bc65a41c0a1a25635493fa482',
                4: 'https://rinkeby.infura.io/v3/f87b967bc65a41c0a1a25635493fa482',
                42: 'https://kovan.infura.io/v3/f87b967bc65a41c0a1a25635493fa482'
            }
        },
        coinbaseWallet: {
            url: 'https://mainet.infura.io/v3/f87b967bc65a41c0a1a25635493fa482',
            appName: 'Nami Insurance'
        }
    };

    return (
        <QueryClientProvider client={qcRef.current}>
            <Provider store={store}>
                <Web3WalletProvider config={walletProviderConfig}>
                    <PersistGate loading={<LoadingPage />} persistor={persistor}>
                        <Component {...pageProps} />
                    </PersistGate>
                </Web3WalletProvider>
            </Provider>
        </QueryClientProvider>
    );
};

export default appWithTranslation(App);
