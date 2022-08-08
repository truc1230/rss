import { fetcher } from '.';
import { LogIntype, BuyInsuranceType, PriceClaim, GetOrderFuture } from '../types/insurance';
import { parseNumber } from '../utils/helpers/format';
import { type } from 'os';

export const logIn = async (props: LogIntype) => {
    try {
        const { walletAddress, signature } = props;

        const { data } = await fetcher.post(
            '/user/log-in',
            {
                walletAddress,
                signature
            },
            { withCredentials: false }
        );

        return data;
    } catch (error) {
        return false;
    }
};

export const checkExpiredCookie = async () => {
    try {
        const { data } = await fetcher.get('/user/check-expire');

        return data;
    } catch (error) {
        return false;
    }
};

export const getPrice = async () => {
    try {
        const { data } = await fetcher.get(`/get-price-futures`);

        return data;
    } catch (error) {
        return false;
    }
};

export const getInsurancByAddress = async (walletAddress: string) => {
    try {
        const { data } = await fetcher.get(
            `/get-insurance-by-address?owner=${walletAddress.toUpperCase()}&min=0&max=2&isAll=false`
        );

        return data;
    } catch (error) {
        return false;
    }
};

export const getInsurancByDate = async (
    walletAddress: string,
    startDate: number,
    endDate: number,
    field: string,
    asset: string
) => {
    try {
        const { data } = await fetcher.get(
            `/get-insurance-by-date?owner=${walletAddress.toUpperCase()}&from=${startDate}&to=${endDate}&field=${field}&asset=${asset}`
        );

        return data;
    } catch (error) {
        return false;
    }
};

export const getInsuranceById = async (_id: string) => {
    try {
        const { data } = await fetcher.get(`/get-insurance-by-id?_id=${_id}`);

        return data;
    } catch (error) {
        return false;
    }
};

export const buyInsurance = async (props: BuyInsuranceType, accessToken: string) => {
    try {
        const {
            owner,
            current_price,
            liquidation_price,
            deposit,
            expired,
            id_transaction,
            amount,
            asset,
            id_sc,
            hedge
        } = props;

        const price = JSON.stringify(deposit, (_, v) =>
            typeof v === 'bigint' ? `${v}n` : v
        ).replace(/"(-?\d+)n"/g, (_, a) => a);

        const { data } = await fetcher.post(
            '/buy-insurance',
            {
                owner,
                id_transaction,
                id_sc,
                asset,
                amount,
                current_price: parseNumber(current_price as unknown as string),
                liquidation_price: parseNumber(liquidation_price),
                deposit: deposit,
                expired: parseNumber(expired),
                hedge: Number(hedge)
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        console.log(data);

        return data;
    } catch (error) {
        console.error(error);

        return false;
    }
};

export const getPriceClaim = async (props: PriceClaim, accessToken: string) => {
    try {
        const { current_price, liquidation_price, deposit, hedge } = props;

        const { data } = await fetcher.post(
            '/get-price-claim',
            {
                value: Number(deposit),
                p_start: parseNumber(current_price as unknown as string),
                p_claim: parseNumber(liquidation_price),
                hedge: hedge
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        return data;
    } catch (error) {
        console.error(error);

        return false;
    }
};

export const getOrderFuturesSuccess = async (props: GetOrderFuture) => {
    try {
        const { symbol, pageSize, page } = props;

        const { data } = await fetcher.get(
            `/get-order-future?symbol=${symbol}&pageSize=${pageSize}&page=${page}`
        );
        return data.order_success.data.orders;
    } catch (error) {
        console.error(error);

        return false;
    }
};
export const getOrderFuturesAvailable = async (props: GetOrderFuture) => {
    try {
        const { symbol, pageSize, page } = props;

        const { data } = await fetcher.get(
            `/get-order-future?symbol=${symbol}&pageSize=${pageSize}&page=${page}`
        );
        return data.order_available.data.orders;
    } catch (error) {
        console.error(error);

        return false;
    }
};
