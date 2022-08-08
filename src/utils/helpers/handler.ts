import type { AddEthereumChainParameter } from '@web3-react/types';
import { getPrice, getPriceClaim } from '../../api';
import { ChainData, PriceClaim } from '../../types';
import { Chains } from '../constants/chains';

interface BasicChainInformation {
    urls: string[];
    name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
    nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
    blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

export const truncateAddress = (address: string) => {
    if (!address) return 'No Account';
    const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export const toHex = (num: number) => {
    const val = Number(num);
    return '0x' + val.toString(16);
};

export function getChainId(network: string): number {
    const chains: ChainData[] = Object.values(Chains);
    const match = filterMatches<ChainData>(chains, (x) => x.network === network, undefined);
    if (!match) {
        throw new Error(`No chainId found match ${network}`);
    }
    return match.chainId;
}

export function filterMatches<T>(
    array: T[],
    condition: (x: T) => boolean,
    fallback: T | undefined
): T | undefined {
    let result = fallback;
    const matches = array.filter(condition);

    if (!!matches && matches.length) {
        result = matches[0];
    }

    return result;
}

export const CHAINS: {
    [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
    1: {
        urls: ['https://mainnet.infura.io/v3/f87b967bc65a41c0a1a25635493fa482'],
        name: 'Mainnet'
    },

    4: {
        urls: ['https://rinkeby.infura.io/v3/f87b967bc65a41c0a1a25635493fa482'],
        name: 'Rinkeby'
    },

    42: {
        urls: ['https://kovan.infura.io/ws/v3/f87b967bc65a41c0a1a25635493fa482'],
        name: 'Kovan'
    }
};

function isExtendedChainInformation(
    chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
    return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
    const chainInformation = CHAINS[chainId];
    if (isExtendedChainInformation(chainInformation)) {
        return {
            chainId,
            chainName: chainInformation.name,
            nativeCurrency: chainInformation.nativeCurrency,
            rpcUrls: chainInformation.urls,
            blockExplorerUrls: chainInformation.blockExplorerUrls
        };
    } else {
        return chainId;
    }
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{
    [chainId: number]: string[];
}>((accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls;

    if (validURLs.length) {
        accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
}, {});

export const getExpiredDay = (value: number) => {
    const current_date = new Date();
    let expiredDate = new Date(current_date.setDate(current_date.getDate() + value));

    return expiredDate.getTime() / 1000 + 250; // add ~ 4 minutes
};

export const getExpiredDayFrom = (timestamp: number, value: number) => {
    const date = new Date(timestamp * 1000);
    let expiredDate = new Date(date.setDate(date.getDate() + value));
    return expiredDate.getTime() / 1000;
};

export const getDayFromInHistory = (value: number) => {
    const current_date = new Date();
    let expiredDate = new Date(current_date.setDate(current_date.getDate() - value));

    return expiredDate.getTime() / 1000;
};

export const priceClaim = async (
    deposit: number | bigint,
    liquidation_price: number | bigint,
    hedge: number,
    accessToken: string,
    symbol: string,
    currentPrice: number
) => {
    const price = getCurrentPriceToken(currentPrice, symbol);

    let hedgeFixPercent = hedge / 100;

    const dataPost: PriceClaim = {
        deposit,
        current_price: price ? price : 1000,
        liquidation_price,
        hedge: hedgeFixPercent
    };

    const price_claim = await getPriceClaim(dataPost, accessToken);

    return price_claim;
};

export const checkNullValueInObject = (obj: Object): boolean => {
    const isNullish = Object.values(obj).every((value) => {
        if (!value) {
            return false;
        }
        return true;
    });

    return isNullish;
};

export const getCurrentPrice = async () => {
    try {
        const data = await getPrice();

        return data;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const getCurrentPriceToken = (currentPrice: any, symbol: string) => {
    let price: number;

    switch (symbol) {
        case 'USDTUSDT': {
            price = 1;
            break;
        }
        case 'ETHUSDT': {
            price = currentPrice.ETHUSDT;
            break;
        }
        case 'BTCUSDT': {
            price = currentPrice.BTCUSDT;
            break;
        }
        case 'BNBUSDT': {
            price = currentPrice.BNBUSDT;
            break;
        }
        default:
            price = 0;
            break;
    }
    return Number(price);
};
