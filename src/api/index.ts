import axios from 'axios';
import { baseURL } from '../utils/constants/endpoint';

export const fetcher = axios.create({ baseURL });

export * from './insurance';

export const getPriceEth = async () => {
    const { data } = await axios.get(
        'https://nami.exchange/api/v3/spot/market_watch?symbol=ETHUSDT'
    );

    return data;
};
