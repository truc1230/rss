import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { createContext, ReactNode, useMemo } from 'react';
import { ConnectorInfo, ConnectorsData } from '../../types';
import { Connector } from '@web3-react/types';
import useWeb3WalletState from './useWeb3WalletState';

export interface Web3WalletProviderProps {
    children: ReactNode;
    config: {
        walletConnect: ConstructorParameters<typeof WalletConnect>['1'];
        coinbaseWallet: ConstructorParameters<typeof CoinbaseWallet>['1'];
    };
}

export const Web3WalletContext = createContext<ReturnType<typeof useWeb3WalletState> | null>(null);
const Web3WalletStateProvider = ({
    children,
    connectorsData
}: {
    children: ReactNode;
    connectorsData: ConnectorsData;
}) => {
    const state = useWeb3WalletState(connectorsData);

    return <Web3WalletContext.Provider value={state}>{children}</Web3WalletContext.Provider>;
};
const getConnectorInfo = (connector: Connector): ConnectorInfo => {
    if (connector instanceof MetaMask) {
        return {
            id: 'metaMask',
            name: 'MetaMask',
            connector
        };
    } else if (connector instanceof WalletConnect) {
        return {
            id: 'walletConnect',
            name: 'WalletConnect',
            connector
        };
    } else {
        return {
            id: 'coinbaseWallet',
            name: 'Coinbase Wallet',
            connector
        };
    }
};

export const Web3WalletProvider = ({ children, config }: Web3WalletProviderProps) => {
    const [metaMask, metaMaskHooks] = useMemo(
        () => initializeConnector<MetaMask>((actions) => new MetaMask(actions)),
        []
    );

    const [walletConnect, walletConnectHooks] = useMemo(
        () =>
            initializeConnector<WalletConnect>(
                (actions) => new WalletConnect(actions, config.walletConnect, false, false),
                [1, 4]
            ),
        [config.walletConnect]
    );

    const [coinbaseWallet, coinbaseHooks] = useMemo(
        () =>
            initializeConnector<CoinbaseWallet>(
                (actions) => new CoinbaseWallet(actions, config.coinbaseWallet)
            ),
        [config.coinbaseWallet]
    );

    const connectors: [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks][] = useMemo(
        () => [
            [metaMask, metaMaskHooks],
            [walletConnect, walletConnectHooks],
            [coinbaseWallet, coinbaseHooks]
        ],
        [metaMask, metaMaskHooks, walletConnect, walletConnectHooks, coinbaseWallet, coinbaseHooks]
    );

    const connectorsData = {
        metaMask: getConnectorInfo(metaMask),
        walletConnect: getConnectorInfo(walletConnect),
        coinbaseWallet: getConnectorInfo(coinbaseWallet)
    };
    console.log('Web3WalletProvider');

    return (
        <Web3ReactProvider connectors={connectors}>
            <Web3WalletStateProvider connectorsData={connectorsData}>
                {children}
            </Web3WalletStateProvider>
        </Web3ReactProvider>
    );
};
