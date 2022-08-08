import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { Connector } from '@web3-react/types';

export type MetaMaskProviderType = {
    provider?: any;
    web3Provider?: any;
    address?: string;
    chainId?: number;
};
export type Connectors = [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks][];

export type ConnectorId = 'metaMask' | 'walletConnect' | 'coinbaseWallet';

export type ConnectorInfo = {
    id: ConnectorId;
    name: string;
    connector: Connector;
};

export type ConnectorsData = Record<ConnectorId, ConnectorInfo>;
