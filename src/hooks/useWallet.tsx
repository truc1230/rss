import { useContext } from 'react';
import { Web3WalletContext } from '../store/wallet/walletProvider';

const useWallet = () => {
    const wallet = useContext(Web3WalletContext);
    // const {
    //     account,
    //     switchNetwork,
    //     chain,
    //     activate,
    //     deactivate,
    //     isActive,
    //     error,
    //     connector,
    //     provider,
    //     balance,
    //     contractCaller,
    //     getBalance,
    //     getBalanceNain
    // } = wallet;

    if (!wallet) {
        throw new Error('useWallet must be used within a Web3WalletProvider');
    }

    return wallet;
};

export default useWallet;
