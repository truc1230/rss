import { useWeb3React } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';
import { ethers, providers } from 'ethers';
import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { ContractCaller } from '../../contract';
import { ConnectorId, ConnectorInfo } from '../../types';
import { NAIN_ABI } from '../../utils/constants/abi/NAIN_ABI';
import { CHAINS, getAddChainParameters } from '../../utils/helpers/handler';

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

const useWeb3WalletState = (
    connectorsData: Record<ConnectorId, { id: ConnectorId; name: string; connector: Connector }>
) => {
    const { connector, account, chainId, isActive, error, provider } = useWeb3React() as any;
    const contractCaller = useRef<ContractCaller | null>(null);

    const activate = async (connectorId: ConnectorId, chainId?: number) => {
        const connector = connectorsData[connectorId].connector;
        console.log(connector);

        connector.deactivate();
        connector instanceof WalletConnect
            ? await connector.activate(chainId)
            : await connector.activate(!chainId ? undefined : getAddChainParameters(chainId));
    };

    const deactivate = () => {
        connector.deactivate();
    };

    useEffect(() => {
        connector.connectEagerly && connector.connectEagerly();
    }, [connector]);

    useEffect(() => {
        if (provider) {
            contractCaller.current = new ContractCaller(provider as providers.Web3Provider);
        }
    }, [provider]);

    const { data: balance } = useQuery(
        'balance',
        () =>
            provider!.getBalance(account!).then((res) => parseFloat(ethers.utils.formatEther(res))),
        {
            enabled: !!provider && !!account,
            initialData: 0
        }
    );

    const switchNetwork = async (chainId: number) => {
        activate(getConnectorInfo(connector).id, chainId);
    };

    const getBalance = async () => {
        const balance =
            provider &&
            (await provider!
                .getBalance(account!)
                .then((res) => parseFloat(ethers.utils.formatEther(res))));
        return balance;
    };

    const getBalanceNain = async () => {
        const contractAddress = '0xFced2B7B391074805b67af672A2a0321623b8A1E'; // address of NAIN contract
        const contract = new ethers.Contract(contractAddress, NAIN_ABI, provider);
        const bal = await contract.balanceOf(account!);
        const balance = parseFloat(ethers.utils.formatEther(bal));
        return balance;
    };

    useEffect(() => {
        if (error) {
            if (error.message.includes('Disconnected from chain')) {
                activate(getConnectorInfo(connector).id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error?.message]);

    return {
        account: account?.toLowerCase(),
        switchNetwork,
        chain: chainId ? { ...CHAINS[chainId], id: chainId } : undefined,
        activate,
        deactivate,
        isActive,
        error,
        connector: getConnectorInfo(connector),
        provider,
        balance,
        contractCaller,
        getBalance,
        getBalanceNain
    };
};
export default useWeb3WalletState;
