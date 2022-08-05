import FetchApi from 'src/utils/fetch-api';
import { API_BROKER_CHART_DATA, API_BROKER_INCOME, API_BROKER_USER, API_BROKER_USER_ANALYTICS, } from './apis';
import { ApiStatus } from './const';

export async function getBrokerIncome({ page = 1, pageSize = 10 }) {
    try {
        const opts = {
            url: API_BROKER_INCOME,
            options: {
                method: 'GET',
            },
            params: {
                page,
                pageSize,
            },
        };
        const res = await FetchApi(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function getBrokerUsers({ page = 1, pageSize = 10 }) {
    try {
        const opts = {
            url: API_BROKER_USER,
            options: {
                method: 'GET',
            },
            params: {
                page,
                pageSize,
            },
        };
        const res = await FetchApi(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function getBrokerDashboardChartData({ from, to }) {
    try {
        const opts = {
            url: API_BROKER_CHART_DATA,
            options: {
                method: 'GET',
            },
            params: {
                from,
                to,
            },
        };
        const res = await FetchApi(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function getBrokerDashboardUserAnalytics() {
    try {
        const opts = {
            url: API_BROKER_USER_ANALYTICS,
            options: {
                method: 'GET',
            },
        };
        const res = await FetchApi(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}
